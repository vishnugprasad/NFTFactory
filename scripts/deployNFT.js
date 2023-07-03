
const hre = require("hardhat");


async function main() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const nftFactory = await NFTFactory.deploy(1);
  await nft.deployed();

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const tokenCount = await nft.createToken(deployer.address);
  
   
  const address1 = nft.address;
  const address2 = nftFactory.address;

  console.log("NFT deployed to:", address1);
  console.log("NFTFactory contract address", address2);
  await saveFrontendFiles(nftFactory , "NFTFactory");
  await saveFrontendFiles(nft , "NFT");
}

async function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/ui/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const address = contract.address
  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });