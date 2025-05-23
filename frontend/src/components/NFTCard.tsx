/** @format */

type Props = {
  id: number;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
};

export default function NFTCard({ id, metadata }: Props) {
  return (
    <div
      style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px" }}
    >
      <img
        src={metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
        alt={metadata.name}
        style={{ width: "100%", borderRadius: "6px" }}
      />
      <h3>
        #{id}: {metadata.name}
      </h3>
      <p>{metadata.description}</p>
    </div>
  );
}
