/** @format */

import { Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Navigation from "../components/Navigation";
import PlaceholderImage from "../components/PlaceholderImage";

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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

interface SectionProps {
  bgColor?: string;
}

// Base styled components
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  color: #333;
  min-width: 100vw;
  padding-top: 80px; // Account for fixed navbar
  overflow-x: hidden;
`;

const SectionContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("/images/hero-bg.jpg") center/cover;
  opacity: 0.1;
  z-index: 0;
`;

const HeroContent = styled(SectionContent)`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #fff 0%, #a8a8a8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  max-width: 800px;
  margin: 0 auto 2rem;
  color: #e0e0e0;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: inline-block;
`;

const PrimaryButtonLink = styled(StyledLink)`
  padding: 1.25rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  min-width: 200px;

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
`;

const SecondaryButtonLink = styled(PrimaryButtonLink)`
  background: transparent;
  border: 2px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);

  @media (max-width: 1024px) {
    padding: 2rem;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
    max-width: 400px;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #e0e0e0;
`;

const Section = styled.section<SectionProps>`
  padding: 6rem 0;
  background-color: ${(props) => props.bgColor || "white"};

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const FeaturedSection = styled(Section)`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeaturedCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
  aspect-ratio: 1;

  &:hover {
    transform: translateY(-8px);
  }
`;

const FeaturedInfo = styled.div`
  padding: 1.5rem;
  background: #ffffff;
  backdrop-filter: blur(10px);
`;

const FeaturedName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FeaturedPrice = styled.div`
  font-size: 1.1rem;
  color: #4caf50;
  font-weight: 600;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureItem = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`;

const FeatureText = styled.p`
  color: #666;
  line-height: 1.5;
`;

const RoadmapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const RoadmapItem = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #4caf50;
  }
`;

const RoadmapPhase = styled.div`
  font-size: 0.9rem;
  color: #4caf50;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const RoadmapTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const RoadmapText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 8rem 2rem;
  text-align: center;

  @media (max-width: 1200px) {
    padding: 6rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const CTATitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: 2rem;
  font-weight: 700;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Animated components
const AnimatedHeroTitle = styled(HeroTitle)`
  animation: ${fadeIn} 1s ease-out;
`;

const AnimatedHeroSubtitle = styled(HeroSubtitle)`
  animation: ${fadeIn} 1s ease-out 0.2s backwards;
`;

const AnimatedButtonLink = styled(PrimaryButtonLink)<{ secondary?: boolean }>`
  animation: ${fadeIn} 1s ease-out 0.4s backwards;
  ${(props) =>
    props.secondary &&
    `
    background: transparent;
    border: 2px solid white;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const AnimatedStatItem = styled(StatItem)`
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.2s);
`;

const AnimatedSectionTitle = styled(SectionTitle)`
  animation: ${fadeIn} 1s ease-out;
`;

const AnimatedFeaturedCard = styled(FeaturedCard)`
  animation: ${fadeIn} 1s ease-out;
  animation-delay: calc(var(--index) * 0.1s);
  &:hover {
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

const Home: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <>
      <Navigation />
      <HomeContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroBackground>
            <PlaceholderImage
              width="100%"
              height="100%"
              text="NFT Collection"
              gradient="linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            />
          </HeroBackground>
          <HeroContent>
            <AnimatedHeroTitle>
              Welcome to the Limited NFT Collection
            </AnimatedHeroTitle>
            <AnimatedHeroSubtitle>
              Discover, mint, and own one-of-a-kind digital assets. Only 100
              will ever exist.
            </AnimatedHeroSubtitle>
            <HeroButtons>
              <AnimatedButtonLink to="/gallery">
                Explore the Gallery
              </AnimatedButtonLink>
              <AnimatedButtonLink to="/gallery?mint=true" secondary>
                Mint Now
              </AnimatedButtonLink>
            </HeroButtons>
            <StatsContainer>
              <AnimatedStatItem style={{ "--index": 0 } as React.CSSProperties}>
                <StatNumber>100</StatNumber>
                <StatLabel>Total NFTs</StatLabel>
              </AnimatedStatItem>
              <AnimatedStatItem style={{ "--index": 1 } as React.CSSProperties}>
                <StatNumber>24/7</StatNumber>
                <StatLabel>Minting Open</StatLabel>
              </AnimatedStatItem>
              <AnimatedStatItem style={{ "--index": 2 } as React.CSSProperties}>
                <StatNumber>∞</StatNumber>
                <StatLabel>IPFS Storage</StatLabel>
              </AnimatedStatItem>
            </StatsContainer>
          </HeroContent>
        </HeroSection>

        {/* Featured NFTs Section */}
        <FeaturedSection>
          <SectionContent>
            <AnimatedSectionTitle>Featured NFTs</AnimatedSectionTitle>
            <FeaturedGrid>
              <AnimatedFeaturedCard
                style={{ "--index": 0 } as React.CSSProperties}
              >
                <PlaceholderImage
                  text="Cosmic Dreams #1"
                  gradient="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                />
                <FeaturedInfo>
                  <FeaturedName>Cosmic Dreams #1</FeaturedName>
                  <FeaturedPrice>0.1 ETH</FeaturedPrice>
                </FeaturedInfo>
              </AnimatedFeaturedCard>
              <AnimatedFeaturedCard
                style={{ "--index": 1 } as React.CSSProperties}
              >
                <PlaceholderImage
                  text="Digital Waves #42"
                  gradient="linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                />
                <FeaturedInfo>
                  <FeaturedName>Digital Waves #42</FeaturedName>
                  <FeaturedPrice>0.15 ETH</FeaturedPrice>
                </FeaturedInfo>
              </AnimatedFeaturedCard>
              <AnimatedFeaturedCard
                style={{ "--index": 2 } as React.CSSProperties}
              >
                <PlaceholderImage
                  text="Neon Nights #77"
                  gradient="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
                />
                <FeaturedInfo>
                  <FeaturedName>Neon Nights #77</FeaturedName>
                  <FeaturedPrice>0.12 ETH</FeaturedPrice>
                </FeaturedInfo>
              </AnimatedFeaturedCard>
            </FeaturedGrid>
          </SectionContent>
        </FeaturedSection>

        {/* Features Section */}
        <Section bgColor="linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)">
          <SectionContent>
            <SectionTitle style={{ color: "white" }}>
              Why Choose Our NFTs?
            </SectionTitle>
            <FeaturesGrid>
              <FeatureItem>
                <FeatureIcon>✅</FeatureIcon>
                <FeatureTitle>True Ownership</FeatureTitle>
                <FeatureText>
                  Full ownership rights on the Ethereum blockchain
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🎁</FeatureIcon>
                <FeatureTitle>Early Access</FeatureTitle>
                <FeatureText>
                  Priority access to future drops and collections
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🌐</FeatureIcon>
                <FeatureTitle>IPFS Hosted</FeatureTitle>
                <FeatureText>
                  Decentralized storage for maximum reliability
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🚀</FeatureIcon>
                <FeatureTitle>Community Benefits</FeatureTitle>
                <FeatureText>
                  Exclusive access to community events and rewards
                </FeatureText>
              </FeatureItem>
            </FeaturesGrid>
          </SectionContent>
        </Section>

        {/* Roadmap Section */}
        <Section>
          <SectionContent>
            <SectionTitle>Roadmap</SectionTitle>
            <RoadmapContainer>
              <RoadmapItem>
                <RoadmapPhase>Phase 1</RoadmapPhase>
                <RoadmapTitle>Launch</RoadmapTitle>
                <RoadmapText>
                  Initial NFT collection release and community building
                </RoadmapText>
              </RoadmapItem>
              <RoadmapItem>
                <RoadmapPhase>Phase 2</RoadmapPhase>
                <RoadmapTitle>Utility</RoadmapTitle>
                <RoadmapText>
                  Implementation of holder benefits and rewards
                </RoadmapText>
              </RoadmapItem>
              <RoadmapItem>
                <RoadmapPhase>Phase 3</RoadmapPhase>
                <RoadmapTitle>Expansion</RoadmapTitle>
                <RoadmapText>
                  New collections and partnerships announcement
                </RoadmapText>
              </RoadmapItem>
            </RoadmapContainer>
          </SectionContent>
        </Section>

        {/* CTA Section */}
        <CTASection>
          <SectionContent>
            <CTATitle>Only 100 NFTs. Get Yours Before They're Gone.</CTATitle>
            <CTAButtons>
              <PrimaryButtonLink to="/gallery">View Gallery</PrimaryButtonLink>
              <SecondaryButtonLink to="/gallery?mint=true">
                Mint Now
              </SecondaryButtonLink>
            </CTAButtons>
          </SectionContent>
        </CTASection>
      </HomeContainer>
    </>
  );
};

export default Home;
