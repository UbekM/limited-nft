/** @format */

import React from "react";
import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const HeroBackgroundContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(20, 20, 20, 0.99) 0%,
      rgba(25, 25, 25, 0.98) 50%,
      rgba(76, 175, 80, 0.08) 100%
    );
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(76, 175, 80, 0.1) 0%,
      rgba(33, 150, 243, 0.1) 50%,
      rgba(156, 39, 176, 0.1) 100%
    );
    background-size: 200% 200%;
    animation: ${gradientAnimation} 15s ease infinite;
    z-index: 1;
  }
`;

const FloatingShapes = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.1;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(76, 175, 80, 0.2) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(33, 150, 243, 0.2) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(156, 39, 176, 0.2) 0%,
      transparent 30%
    );
  animation: ${floatAnimation} 10s ease-in-out infinite;
`;

const PatternOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

interface HeroBackgroundProps {
  children: React.ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ children }) => {
  return (
    <HeroBackgroundContainer>
      <FloatingShapes />
      <PatternOverlay />
      {children}
    </HeroBackgroundContainer>
  );
};

export default HeroBackground;
