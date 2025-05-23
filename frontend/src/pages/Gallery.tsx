/** @format */

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Navigation from "../components/Navigation";
import NFTCard from "../components/NFTCard";
import { useNFT } from "../context/NFTContext";

const METADATA_CID = "QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

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

type EthereumProvider = {
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

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const PlaceholderImage = styled.div<{ text: string; gradient: string }>`
  width: 100%;
  aspect-ratio: 1;
  background: ${(props) => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const { nfts, mintedNFTs, isLoading, contract, checkIfMinted } = useNFT();
  const [account, setAccount] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const showMintModal = searchParams.get("mint") === "true";

  // Auto-show mint modal if mint=true in URL
  useEffect(() => {
    if (showMintModal && nfts.length > 0) {
      setSelectedNFT(1); // Select first NFT by default
    }
  }, [showMintModal, nfts]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Failed to connect wallet. See console for details.");
    }
  };

  const mintNFT = async (tokenId: number) => {
    if (!contract || !account) {
      alert("Please connect your wallet first.");
      return;
    }

    // Double check minted status before proceeding
    const isMinted = await checkIfMinted(tokenId);
    if (isMinted) {
      alert("This NFT has already been minted.");
      return;
    }

    setMinting(true);
    try {
      const tokenURI = `ipfs://${METADATA_CID}/metadata_${tokenId}.json`;
      const tx = await contract.mintNFT(account, tokenURI);
      console.log("Minting tx:", tx.hash);
      const receipt = await tx.wait();

      // Verify the mint was successful
      if (receipt.status === 1) {
        alert(`NFT #${tokenId} minted successfully!`);
        setSelectedNFT(null);
        // Reload NFTs to update minted status
        window.location.reload();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Mint failed:", err);
      alert("Minting failed. See console.");
    }
    setMinting(false);
  };

  return (
    <>
      <Navigation />
      <GalleryContainer>
        <GalleryContent>
          <GalleryHeader style={{ paddingBottom: "70px" }}>
            <AnimatedTitle>🎨 Limited NFT Gallery</AnimatedTitle>
            <WalletSection>
              {account ? (
                <WalletInfo>
                  <WalletAddress>{account}</WalletAddress>
                  <WalletStatus>Connected</WalletStatus>
                </WalletInfo>
              ) : (
                <ConnectButton onClick={connectWallet}>
                  Connect Wallet
                </ConnectButton>
              )}
            </WalletSection>
          </GalleryHeader>

          <GalleryGrid>
            {isLoading
              ? // Show loading placeholders
                Array.from({ length: 12 }).map((_, idx) => (
                  <AnimatedNFTCard
                    key={`loading-${idx}`}
                    style={{ "--index": idx } as React.CSSProperties}
                  >
                    <PlaceholderImage
                      text="Loading..."
                      gradient="linear-gradient(135deg, #666 0%, #444 100%)"
                    />
                    <MintButton disabled>Loading...</MintButton>
                  </AnimatedNFTCard>
                ))
              : nfts.map((nft, idx) => {
                  const tokenId = idx + 1;
                  const isMinted = mintedNFTs.has(tokenId);

                  return (
                    <AnimatedNFTCard
                      key={idx}
                      style={{ "--index": idx } as React.CSSProperties}
                    >
                      <NFTCard id={tokenId} metadata={nft} />
                      <MintButton
                        onClick={() => !isMinted && setSelectedNFT(tokenId)}
                        disabled={minting || isMinted}
                      >
                        {minting && selectedNFT === tokenId
                          ? "Minting..."
                          : isMinted
                          ? "Already Minted"
                          : `Mint #${tokenId}`}
                      </MintButton>
                    </AnimatedNFTCard>
                  );
                })}
          </GalleryGrid>
        </GalleryContent>

        {selectedNFT && !mintedNFTs.has(selectedNFT) && !isLoading && (
          <MintModal>
            <ModalContent>
              <ModalTitle>Mint NFT #{selectedNFT}</ModalTitle>
              <ModalText>
                Are you sure you want to mint this NFT? This action cannot be
                undone.
              </ModalText>
              <ModalButtons>
                <ModalButton
                  onClick={() => mintNFT(selectedNFT)}
                  disabled={minting}
                >
                  {minting ? "Minting..." : "Confirm Mint"}
                </ModalButton>
                <ModalButton secondary onClick={() => setSelectedNFT(null)}>
                  Cancel
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </MintModal>
        )}
      </GalleryContainer>
    </>
  );
}

// Styled Components
const GalleryContainer = styled.div`
  position: relative;
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
  padding-top: 80px; // Account for fixed navbar
`;

const GalleryContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const GalleryHeader = styled.header`
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const AnimatedTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #ffffff;
  animation: ${fadeIn} 1s ease-out;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
`;

const WalletAddress = styled.div`
  font-size: 0.9rem;
  color: #e0e0e0;
  font-family: monospace;
`;

const WalletStatus = styled.div`
  font-size: 0.8rem;
  color: #4caf50;
  font-weight: 600;
`;

const ConnectButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 36px;
  margin-top: 40px;
  padding: 0 24px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 12px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    gap: 16px;
    padding: 0 8px;
  }
`;

const AnimatedNFTCard = styled.div`
  animation: ${fadeIn} 1s ease-out;
  animation-delay: calc(var(--index) * 0.1s);
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    gap: 8px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    border-radius: 10px;
  }
`;

const MintButton = styled.button`
  background: ${(props) => {
    if (props.children === "Loading...") {
      return "linear-gradient(135deg, #666 0%, #444 100%)";
    }
    if (props.disabled) {
      return props.children === "Already Minted"
        ? "linear-gradient(135deg, #666 0%, #444 100%)"
        : "linear-gradient(135deg, #4caf50 0%, #45a049 100%)";
    }
    return "linear-gradient(135deg, #4caf50 0%, #45a049 100%)";
  }};
  color: white;
  border: none;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);

    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    padding: 10px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;

const MintModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: #2d2d2d;
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${pulse} 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
`;

const ModalText = styled.p`
  color: #e0e0e0;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button<{ secondary?: boolean }>`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: ${(props) =>
    props.secondary
      ? "rgba(255, 255, 255, 0.1)"
      : "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"};
  color: ${(props) => (props.secondary ? "#e0e0e0" : "white")};
  border: ${(props) =>
    props.secondary ? "1px solid rgba(255, 255, 255, 0.2)" : "none"};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    ${(props) =>
      !props.secondary &&
      `
      background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
      box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    `}
    ${(props) =>
      props.secondary &&
      `
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    `}
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
