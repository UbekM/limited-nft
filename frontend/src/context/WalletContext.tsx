/** @format */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type EthereumRequestMethod =
  | "eth_requestAccounts"
  | "eth_accounts"
  | "eth_chainId"
  | "eth_sendTransaction"
  | "eth_sign"
  | "personal_sign"
  | "eth_signTypedData"
  | "wallet_switchEthereumChain"
  | "wallet_addEthereumChain";

type EthereumRequestParams = {
  method: EthereumRequestMethod;
  params?: unknown[];
};

type EthereumEventType =
  | "accountsChanged"
  | "chainChanged"
  | "connect"
  | "disconnect";

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

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: EthereumRequestParams) => Promise<unknown>;
      on: (
        event: EthereumEventType,
        callback: (...args: unknown[]) => void
      ) => void;
      removeListener: (
        event: EthereumEventType,
        callback: (...args: unknown[]) => void
      ) => void;
      isMetaMask?: boolean;
    };
  }
}

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
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask to use this feature");
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
        const provider = window.ethereum;
        if (!provider) {
          throw new Error("No ethereum provider found");
        }

        let accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        if (!Array.isArray(accounts) || accounts.length === 0) {
          toast.error("No accounts found");
          return;
        }

        setAddress(accounts[0]);
        setIsConnected(true);
        toast.success("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet");

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

  const handleAccountsChanged = useCallback((accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setAddress(accounts[0] as string);
      setIsConnected(true);
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum === "undefined") return;

      try {
        const provider = window.ethereum;
        if (!provider) return;

        const accounts = await provider.request({
          method: "eth_accounts",
        });

        if (Array.isArray(accounts) && accounts.length > 0) {
          setAddress(accounts[0] as string);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();

    const provider = window.ethereum;
    if (provider) {
      provider.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (provider) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
      }
      clearRetryTimeout();
    };
  }, [handleAccountsChanged]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </WalletContext.Provider>
  );
};
