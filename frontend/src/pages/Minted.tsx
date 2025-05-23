/** @format */

import styled from "@emotion/styled";
import Navigation from "../components/Navigation";

const MintedContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 100px 20px 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

  @media (max-width: 1024px) {
    padding: 90px 16px 32px;
  }

  @media (max-width: 768px) {
    padding: 80px 12px 24px;
  }

  @media (max-width: 480px) {
    padding: 70px 8px 20px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export default function Minted() {
  return (
    <>
      <Navigation />
      <MintedContainer>
        <ContentWrapper>
          <Title>Your Minted NFTs</Title>
          <Description>
            View and manage your collection of minted NFTs. Each NFT is unique
            and stored securely on the blockchain.
          </Description>
          <EmptyState>
            <p>You haven't minted any NFTs yet.</p>
            <p>Visit the gallery to start your collection!</p>
          </EmptyState>
        </ContentWrapper>
      </MintedContainer>
    </>
  );
}
