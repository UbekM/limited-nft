/** @format */

import * as React from "react";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import Navigation from "../components/Navigation";
import { useWallet } from "../context/WalletContext";
import { useContract } from "../context/ContractContext";
import { CONTRACT_ABI } from "../constants/contract";

const IPFS_CID = "bafybeibxopzjrohhlj2xrmijrk75vtmnujanee7tin4ly6ode2mrrhmwxq";
const IMAGE_IPFS_CID =
  "bafybeiboqfyvwo6fzhjbnudrgfxr565vkz2pgqyencvds33qgfquxbpwmi";

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

interface NFTAttribute {
  trait_type: string;
  value: string;
  attributes?: NFTAttribute[];
  colors?: string[];
}

interface NFTMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  attributes: NFTAttribute[];
}

interface StyledProps {
  secondary?: boolean;
  disabled?: boolean;
}

interface NFTCardProps {
  metadata: NFTMetadata;
  isMinted: boolean;
}

const ITEMS_PER_PAGE = 10;

// Add proper error type
type ContractError = {
  code?: string;
  message?: string;
  data?: string;
};

// Add error boundary component
class NFTErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <CardContainer isMinted={false}>
          <NFTImageContainer>
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "#ff3b30",
                fontSize: "0.9rem",
              }}
            >
              Error loading NFT data
            </div>
          </NFTImageContainer>
        </CardContainer>
      );
    }

    return this.props.children;
  }
}

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

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  margin-bottom: 40px;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 2rem;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 1s ease-out;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin: 0 0 2rem;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 1s ease-out 0.2s backwards;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 36px;
  margin-top: 40px;
  padding: 0 24px;
  min-height: 600px; // Ensure consistent height during pagination

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
  border-radius: 16px;
  overflow: hidden;
  background: rgba(25, 25, 25, 0.98);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
`;

const MintButton = styled.button<StyledProps & { isMinted: boolean }>`
  background: ${(props) => {
    if (props.isMinted) {
      return "linear-gradient(135deg, #666 0%, #444 100%)";
    }
    if (props.disabled) {
      return "linear-gradient(135deg, #666 0%, #444 100%)";
    }
    return "linear-gradient(135deg, #4caf50 0%, #45a049 100%)";
  }};
  color: ${(props) => (props.isMinted ? "#999" : "white")};
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
    transform: ${(props) => (props.isMinted ? "none" : "translateY(-2px)")};
    background: ${(props) =>
      props.isMinted
        ? "linear-gradient(135deg, #666 0%, #444 100%)"
        : "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)"};
    box-shadow: ${(props) =>
      props.isMinted
        ? "0 4px 12px rgba(0, 0, 0, 0.2)"
        : "0 6px 16px rgba(76, 175, 80, 0.4)"};

    &::after {
      opacity: ${(props) => (props.isMinted ? 0 : 1)};
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
  background: rgba(25, 25, 25, 0.99);
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${pulse} 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
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

const ModalButton = styled.button<StyledProps>`
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

// Update the IPFSNFTCard component
const IPFSNFTCard: React.FC<NFTCardProps> = ({ metadata, isMinted }) => {
  if (!metadata || !metadata.id) {
    return (
      <CardContainer isMinted={false}>
        <NFTImageContainer>
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
              color: "#a0a0a0",
              fontSize: "0.9rem",
            }}
          >
            Loading NFT data...
          </div>
        </NFTImageContainer>
      </CardContainer>
    );
  }

  // Use the image URL from metadata if available, otherwise construct it
  const ipfsImageUrl =
    metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ||
    `https://ipfs.io/ipfs/${IMAGE_IPFS_CID}/image_${metadata.id}.svg`;

  return (
    <CardContainer isMinted={isMinted}>
      <NFTImageContainer>
        <img
          src={ipfsImageUrl}
          alt={`NFT #${metadata.id}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: isMinted ? "grayscale(100%)" : "none",
            padding: "1rem",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.parentElement!.innerHTML = `
              <div style="padding: 1rem; text-align: center; color: #a0a0a0;">
                Image not available
              </div>
            `;
          }}
        />
        {isMinted && <MintedOverlay>Minted</MintedOverlay>}
      </NFTImageContainer>
    </CardContainer>
  );
};

// Update styled components for simpler card
const CardContainer = styled.div<{ isMinted: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: ${(props) =>
    props.isMinted ? "rgba(128, 128, 128, 0.3)" : "rgba(25, 25, 25, 0.98)"};
  backdrop-filter: blur(8px);
  border: 1px solid
    ${(props) =>
      props.isMinted
        ? "rgba(128, 128, 128, 0.35)"
        : "rgba(255, 255, 255, 0.15)"};
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border-color: ${(props) =>
      props.isMinted
        ? "rgba(128, 128, 128, 0.5)"
        : "rgba(255, 255, 255, 0.25)"};
  }
`;

const NFTImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MintedOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 2;
`;

// Add new styled component for mint button wrapper
const MintButtonWrapper = styled.div`
  padding: 1rem;
  background: rgba(25, 25, 25, 0.98);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

// Add back necessary styled components
const LoadingMessage = styled.div`
  text-align: center;
  color: #e0e0e0;
  font-size: 1.2rem;
  margin: 40px 0;
  animation: ${pulse} 1.5s infinite;
`;

const ErrorMessage = styled.div`
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 0.9rem;
  text-align: center;
  max-width: 400px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 40px 0;
  flex-wrap: wrap;
  padding: 0 20px;
`;

const PaginationButton = styled.button<{ "data-active"?: boolean }>`
  background: ${(props) =>
    props["data-active"]
      ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) => (props["data-active"] ? "white" : "#e0e0e0")};
  border: 1px solid
    ${(props) =>
      props["data-active"]
        ? "rgba(76, 175, 80, 0.3)"
        : "rgba(255, 255, 255, 0.1)"};
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props["data-active"] ? "none" : "translateY(-2px)"};
    background: ${(props) =>
      props["data-active"]
        ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
        : "rgba(255, 255, 255, 0.15)"};
    border-color: ${(props) =>
      props["data-active"]
        ? "rgba(76, 175, 80, 0.4)"
        : "rgba(255, 255, 255, 0.2)"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 1s ease-out 0.4s backwards;
  width: 100%;
  max-width: 400px;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(25, 25, 25, 0.98);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(30, 30, 30, 0.99);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const WalletAddress = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  word-break: break-all;
  text-align: center;
`;

const WalletStatus = styled.div`
  font-size: 0.9rem;
  color: #4caf50;
  font-weight: 600;
`;

const ConnectButton = styled.button<StyledProps>`
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #666 0%, #444 100%)"
      : "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 12px 40px rgba(76, 175, 80, 0.4);
  }
`;

const DisconnectButton = styled.button`
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
    border-color: rgba(255, 59, 48, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Gallery: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    error: walletError,
  } = useWallet();
  const { contract } = useContract();
  const [mintingNFTId, setMintingNFTId] = useState<number | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [nfts, setNFTs] = useState<NFTMetadata[]>([]);
  const [mintError, setMintError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize NFT data with IPFS paths
  useEffect(() => {
    const initialNFTs: NFTMetadata[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Limited NFT #${i + 1}`,
      description: "Exclusive NFT from a limited collection of 100 avatars.",
      image: `ipfs://${IPFS_CID}/image_${i + 1}.svg`,
      price: "0.01",
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Edition", value: `${i + 1}/100` },
      ],
    }));
    setNFTs(initialNFTs);
  }, []);

  // Load NFT metadata from IPFS
  useEffect(() => {
    const loadNFTMetadata = async () => {
      if (nfts.length === 0) return;

      setIsLoading(true);
      try {
        const updatedNFTs = await Promise.all(
          nfts.map(async (nft) => {
            try {
              // Fetch metadata from IPFS
              const response = await fetch(
                `https://ipfs.io/ipfs/${IPFS_CID}/metadata_${nft.id}.json`
              );

              // If metadata exists, use it
              if (response.ok) {
                const metadata = await response.json();
                return {
                  ...nft,
                  name: metadata.name || nft.name,
                  description: metadata.description || nft.description,
                  image: metadata.image || nft.image,
                  attributes: metadata.attributes || nft.attributes,
                };
              }

              // If metadata doesn't exist (404), use fallback data
              console.log(`Using fallback metadata for NFT #${nft.id}`);
              return {
                ...nft,
                name: `Limited NFT #${nft.id}`,
                description:
                  "Exclusive NFT from a limited collection of 100 avatars.",
                image: `ipfs://${IPFS_CID}/image_${nft.id}.svg`,
                price: "0.01",
                attributes: [
                  { trait_type: "Rarity", value: "Common" },
                  { trait_type: "Edition", value: `${nft.id}/100` },
                ],
              };
            } catch (error) {
              // Keep the initial IPFS data if fetch fails
              console.log(
                `Error loading NFT #${nft.id} from IPFS, using fallback:`,
                error
              );
              return nft;
            }
          })
        );
        setNFTs(updatedNFTs);
      } catch (error) {
        console.error("Error loading NFT metadata from IPFS:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTMetadata();
  }, [nfts.length]);

  // Load minted status immediately, regardless of wallet connection
  useEffect(() => {
    const loadMintedStatus = async () => {
      if (!contract) {
        try {
          const provider = new ethers.JsonRpcProvider(
            import.meta.env.VITE_RPC_URL
          );
          const readOnlyContract = new ethers.Contract(
            import.meta.env.VITE_CONTRACT_ADDRESS,
            CONTRACT_ABI,
            provider
          );

          setIsLoading(true);
          setMintError(null);
          const minted = new Set<number>();

          try {
            const checkPromises = nfts.map(async (nft) => {
              try {
                const owner = await readOnlyContract.ownerOf(nft.id);
                if (owner !== ethers.ZeroAddress) {
                  minted.add(nft.id);
                }
              } catch (error: unknown) {
                const contractError = error as ContractError;
                // Handle nonexistent token error gracefully
                if (
                  contractError?.code === "CALL_EXCEPTION" ||
                  contractError?.message?.includes("ERC721NonexistentToken") ||
                  contractError?.message?.includes("execution reverted")
                ) {
                  // Token doesn't exist yet, which is fine
                  console.log(`NFT #${nft.id} not minted yet`);
                } else {
                  // Log other errors
                  console.error(`Error checking NFT #${nft.id}:`, error);
                }
              }
            });

            await Promise.all(checkPromises);
            setMintedNFTs(Array.from(minted));
          } catch (error) {
            console.error("Error loading minted status:", error);
            setMintError("Failed to load NFT status. Please refresh the page.");
          } finally {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error creating read-only provider:", error);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setMintError(null);
      const minted = new Set<number>();

      try {
        const checkPromises = nfts.map(async (nft) => {
          try {
            const owner = await contract.ownerOf(nft.id);
            if (owner !== ethers.ZeroAddress) {
              minted.add(nft.id);
            }
          } catch (error: unknown) {
            const contractError = error as ContractError;
            // Handle nonexistent token error gracefully
            if (
              contractError?.code === "CALL_EXCEPTION" ||
              contractError?.message?.includes("ERC721NonexistentToken") ||
              contractError?.message?.includes("execution reverted")
            ) {
              // Token doesn't exist yet, which is fine
              console.log(`NFT #${nft.id} not minted yet`);
            } else {
              // Log other errors
              console.error(`Error checking NFT #${nft.id}:`, error);
            }
          }
        });

        await Promise.all(checkPromises);
        setMintedNFTs(Array.from(minted));
      } catch (error) {
        console.error("Error loading minted status:", error);
        setMintError("Failed to load NFT status. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMintedStatus();
  }, [contract, nfts]);

  // Auto-show mint modal if mint=true in URL
  useEffect(() => {
    if (searchParams.get("mint") === "true" && nfts.length > 0) {
      setSelectedNFT(1);
    }
  }, [searchParams, nfts]);

  // Calculate total pages when NFTs are loaded
  useEffect(() => {
    setTotalPages(Math.ceil(nfts.length / ITEMS_PER_PAGE));
  }, [nfts.length]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return nfts.slice(startIndex, endIndex);
  };

  // Handle page change with proper type assertion
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of gallery with proper type assertion
    const galleryContent = document.querySelector(
      ".gallery-content"
    ) as HTMLElement;
    if (galleryContent) {
      window.scrollTo({
        top: galleryContent.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleMint = async (tokenId: number) => {
    if (!contract || !address) {
      setMintError("Please connect your wallet first.");
      return;
    }

    if (mintingNFTId !== null) {
      setMintError("Please wait for the current mint to complete.");
      return;
    }

    const isMinted = mintedNFTs.includes(tokenId);
    if (isMinted) {
      setMintError("This NFT has already been minted.");
      return;
    }

    setMintingNFTId(tokenId);
    setMintError(null);
    try {
      const tokenURI = `ipfs://${IPFS_CID}/metadata_${tokenId}.json`;
      const tx = await contract.mintNFT(address, tokenURI);
      console.log("Minting tx:", tx.hash);

      // Wait for transaction with timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), 60000)
        ),
      ]);

      if (receipt && receipt.status === 1) {
        setMintedNFTs((prev) => [...prev, tokenId]);
        setSelectedNFT(null);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Minting error:", error);
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          setMintError("Transaction was rejected. Please try again.");
        } else if (error.message.includes("insufficient funds")) {
          setMintError(
            "Insufficient funds for minting. Please add ETH to your wallet."
          );
        } else if (error.message.includes("Transaction timeout")) {
          setMintError(
            "Transaction timed out. Please check your wallet for the transaction status."
          );
        } else {
          setMintError(`Minting failed: ${error.message}`);
        }
      } else {
        setMintError("Minting failed. Please try again.");
      }
    } finally {
      setMintingNFTId(null);
    }
  };

  return (
    <>
      <Navigation />
      <GalleryContainer>
        <GalleryContent className="gallery-content">
          <HeroSection>
            <HeroContent>
              <HeroTitle>Limited NFT Collection</HeroTitle>
              <HeroSubtitle>
                Mint your unique digital art piece from our exclusive collection
              </HeroSubtitle>
              <WalletSection>
                {isConnected ? (
                  <WalletInfo>
                    <WalletAddress>{address}</WalletAddress>
                    <WalletStatus>Connected</WalletStatus>
                    <DisconnectButton onClick={disconnect}>
                      Disconnect Wallet
                    </DisconnectButton>
                  </WalletInfo>
                ) : (
                  <ConnectButton onClick={connect} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect Wallet to Mint"}
                  </ConnectButton>
                )}
                {walletError && <ErrorMessage>{walletError}</ErrorMessage>}
              </WalletSection>
            </HeroContent>
          </HeroSection>

          {isLoading ? (
            <LoadingMessage>Loading NFTs...</LoadingMessage>
          ) : (
            <>
              <GalleryGrid>
                {getCurrentPageItems().map((nft) => (
                  <AnimatedNFTCard
                    key={nft.id}
                    style={
                      {
                        "--index": nft.id % 12,
                        opacity: mintedNFTs.includes(nft.id) ? 0.7 : 1,
                      } as React.CSSProperties
                    }
                  >
                    <NFTErrorBoundary>
                      <IPFSNFTCard
                        metadata={nft}
                        isMinted={mintedNFTs.includes(nft.id)}
                      />
                    </NFTErrorBoundary>
                    <MintButtonWrapper>
                      <MintButton
                        onClick={() => handleMint(nft.id)}
                        disabled={
                          mintingNFTId !== null || mintedNFTs.includes(nft.id)
                        }
                        isMinted={mintedNFTs.includes(nft.id)}
                      >
                        {mintedNFTs.includes(nft.id)
                          ? "Minted"
                          : mintingNFTId === nft.id
                          ? "Minting..."
                          : "Mint NFT"}
                      </MintButton>
                    </MintButtonWrapper>
                  </AnimatedNFTCard>
                ))}
              </GalleryGrid>

              <PaginationContainer>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationButton
                      key={page}
                      onClick={() => handlePageChange(page)}
                      data-active={currentPage === page}
                    >
                      {page}
                    </PaginationButton>
                  )
                )}

                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </PaginationButton>
              </PaginationContainer>
            </>
          )}
        </GalleryContent>

        {selectedNFT && !mintedNFTs.includes(selectedNFT) && !isLoading && (
          <MintModal>
            <ModalContent>
              <ModalTitle>Mint NFT #{selectedNFT}</ModalTitle>
              <ModalText>
                Are you sure you want to mint this NFT? This action cannot be
                undone.
              </ModalText>
              {mintError && <ErrorMessage>{mintError}</ErrorMessage>}
              <ModalButtons>
                <ModalButton
                  onClick={() => handleMint(selectedNFT)}
                  disabled={mintingNFTId !== null}
                >
                  {mintingNFTId === selectedNFT ? "Minting..." : "Confirm Mint"}
                </ModalButton>
                <ModalButton
                  secondary
                  onClick={() => {
                    setSelectedNFT(null);
                    setMintError(null);
                  }}
                >
                  Cancel
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </MintModal>
        )}
      </GalleryContainer>
    </>
  );
};

export default Gallery;
