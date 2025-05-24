/** @format */

import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useState } from "react";

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/" onClick={closeMobileMenu}>Limited NFT</Logo>
        <NavLinks>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/gallery">Mint</NavLink>
        </NavLinks>
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={isMobileMenuOpen ? "open" : ""}></span>
          <span className={isMobileMenuOpen ? "open" : ""}></span>
          <span className={isMobileMenuOpen ? "open" : ""}></span>
        </MobileMenuButton>
      </NavContainer>
      <MobileMenu className={isMobileMenuOpen ? "open" : ""}>
        <MobileNavLink to="/gallery" onClick={closeMobileMenu}>Gallery</MobileNavLink>
        <MobileNavLink to="/gallery" onClick={closeMobileMenu}>Mint</MobileNavLink>
      </MobileMenu>
      {isMobileMenuOpen && <Overlay onClick={closeMobileMenu} />}
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, #fff 0%, #a8a8a8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 1001;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    transform-origin: center;

    &.open {
      &:first-of-type {
        transform: translateY(8px) rotate(45deg);
      }
      &:nth-of-type(2) {
        opacity: 0;
      }
      &:last-of-type {
        transform: translateY(-8px) rotate(-45deg);
      }
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: -100%;
  width: 250px;
  height: 100vh;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  padding: 80px 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: right 0.3s ease;
  z-index: 1000;
  border-left: 1px solid rgba(255, 255, 255, 0.1);

  &.open {
    right: 0;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.2rem;
  padding: 0.5rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export default Navigation;
