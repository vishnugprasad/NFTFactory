require("@nomiclabs/hardhat-waffle");
require(dotenv).config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/iJy3n5ft1bCKj7dnb0cX08cptMtj-2Rz",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};



