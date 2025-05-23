import styled from '@emotion/styled';

interface PlaceholderImageProps {
  width?: string;
  height?: string;
  text?: string;
  gradient?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = '100%',
  height = '300px',
  text = 'NFT Image',
  gradient = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
}) => {
  return (
    <PlaceholderContainer width={width} height={height} gradient={gradient}>
      <PlaceholderText>{text}</PlaceholderText>
    </PlaceholderContainer>
  );
};

const PlaceholderContainer = styled.div<{ width: string; height: string; gradient: string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const PlaceholderText = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

export default PlaceholderImage; 