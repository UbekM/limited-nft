/** @format */

const fs = require("fs");
const path = require("path");

const IMAGE_CID = "bafybeiboqfyvwo6fzhjbnudrgfxr565vkz2pgqyencvds33qgfquxbpwmi";
const METADATA_DIR = "./metadata";
const TOTAL_NFTS = 100;

if (!fs.existsSync(METADATA_DIR)) {
  fs.mkdirSync(METADATA_DIR);
}

for (let i = 1; i <= TOTAL_NFTS; i++) {
  const metadata = {
    name: `Limited NFT #${i}`,
    description: "Exclusive NFT from a limited collection of 100 avatars.",
    image: `ipfs://${IMAGE_CID}/image_${i}.svg`,
    attributes: [], // You can add traits here later
  };

  const filePath = path.join(METADATA_DIR, `metadata_${i}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  console.log(`✅ Created ${filePath}`);
}
