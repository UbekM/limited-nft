/** @format */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  error: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionQueueRef = useRef<Promise<void> | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }

    // Clear any existing retry timeout
    clearRetryTimeout();

    // If there's already a connection in progress, return that promise
    if (connectionQueueRef.current) {
      return connectionQueueRef.current;
    }

    // Create a new connection promise
    connectionQueueRef.current = (async () => {
      if (isConnecting) {
        console.log("Wallet connection already in progress...");
        return;
      }

      setIsConnecting(true);
      setError(null);

      try {
        // First try to get accounts without requesting
        let accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        // If no accounts, then request them
        if (!Array.isArray(accounts) || accounts.length === 0) {
          // Wait a bit before requesting accounts
          await new Promise((resolve) => setTimeout(resolve, 500));

          try {
            accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
          } catch (requestError) {
            // Handle specific MetaMask errors
            if (requestError instanceof Error) {
              if (requestError.message.includes("Already processing")) {
                // Wait and retry once
                await new Promise((resolve) => setTimeout(resolve, 1000));
                accounts = await window.ethereum.request({
                  method: "eth_requestAccounts",
                });
              } else if (requestError.message.includes("User rejected")) {
                setError("Connection rejected. Please try again.");
                return;
              } else {
                throw requestError;
              }
            }
          }
        }

        if (Array.isArray(accounts) && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setError(null);
        } else {
          setError("No accounts found. Please unlock MetaMask.");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setError(
          error instanceof Error ? error.message : "Failed to connect wallet"
        );

        // Set up retry after 5 seconds if it's a recoverable error
        if (
          error instanceof Error &&
          (error.message.includes("Already processing") ||
            error.message.includes("User rejected"))
        ) {
          retryTimeoutRef.current = setTimeout(() => {
            setError(null);
            connect();
          }, 5000);
        }
      } finally {
        setIsConnecting(false);
        connectionQueueRef.current = null;
      }
    })();

    return connectionQueueRef.current;
  }, [isConnecting]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
    connectionQueueRef.current = null;
    clearRetryTimeout();
  }, []);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (Array.isArray(accounts) && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            setError(null);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          setError("Failed to check wallet connection");
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setError(null);
        } else {
          disconnect();
        }
      };

      const handleChainChanged = () => {
        // Reload the page on chain change to ensure proper state
        window.location.reload();
      };

      const handleDisconnect = () => {
        disconnect();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
          window.ethereum.removeListener("disconnect", handleDisconnect);
        }
        clearRetryTimeout();
      };
    }
  }, [disconnect]);

  return (
    <WalletContext.Provider
      value={{ address, isConnected, isConnecting, connect, disconnect, error }}
    >
      {children}
    </WalletContext.Provider>
  );
};
