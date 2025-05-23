/** @format */

import React from 'react';
import styled from 'styled-components';

interface NFTMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFTCardProps {
  id: number;
  metadata: NFTMetadata;
}

const NFTCard: React.FC<NFTCardProps> = ({ metadata }) => {
  return (
    <CardContainer>
      <NFTImageContainer>
        <img
          src={metadata.image}
          alt={metadata.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </NFTImageContainer>
      <NFTInfo>
        <NFTName>{metadata.name}</NFTName>
        <NFTDescription>{metadata.description}</NFTDescription>
        <NFTAttributes>
          {metadata.attributes.map((attr, index) => (
            <NFTAttribute key={index}>
              <AttributeLabel>{attr.trait_type}:</AttributeLabel>
              <AttributeValue>{attr.value}</AttributeValue>
            </NFTAttribute>
          ))}
        </NFTAttributes>
        <NFTPrice>Price: {metadata.price} ETH</NFTPrice>
      </NFTInfo>
    </CardContainer>
  );
};

export default NFTCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const NFTImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
`;

const NFTInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NFTName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const NFTDescription = styled.p`
  font-size: 0.9rem;
  color: #e0e0e0;
  margin: 0;
  line-height: 1.4;
`;

const NFTAttributes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

const NFTAttribute = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const AttributeLabel = styled.span`
  color: #a0a0a0;
`;

const AttributeValue = styled.span`
  color: #ffffff;
  font-weight: 500;
`;

const NFTPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #4caf50;
  margin-top: 8px;
`;
