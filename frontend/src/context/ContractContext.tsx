/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/contract";
import { useWallet } from "./WalletContext";

interface ContractContextType {
  contract: ethers.Contract | null;
  isLoading: boolean;
}

const ContractContext = createContext<ContractContextType>({
  contract: null,
  isLoading: true,
});

export const useContract = () => useContext(ContractContext);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, address } = useWallet();

  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum || !isConnected || !address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Wait a bit to ensure wallet is ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing contract:", error);
        // If we get the "already processing" error, wait and retry once
        if (
          error instanceof Error &&
          error.message.includes("Already processing")
        ) {
          console.log("Retrying contract initialization in 1 second...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(
              CONTRACT_ADDRESS,
              CONTRACT_ABI,
              signer
            );
            setContract(contractInstance);
          } catch (retryError) {
            console.error(
              "Error on contract initialization retry:",
              retryError
            );
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [isConnected, address]);

  return (
    <ContractContext.Provider value={{ contract, isLoading }}>
      {children}
    </ContractContext.Provider>
  );
};
