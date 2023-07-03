require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/iJy3n5ft1bCKj7dnb0cX08cptMtj-2Rz",
      accounts: ["76393c6301e6abc7850e214925bca9c1d4ee871fff8a140dd60b3beb31ea9ac3"],
    },
  },
};



