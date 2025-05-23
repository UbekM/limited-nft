import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LimitedNFTModule = buildModule("LimitedNFTModule", (m) => {
  const limitedNFT = m.contract("LimitedNFT", ["LimitedNFT", "LNFT"]);
  return { limitedNFT };
});

export default LimitedNFTModule;
