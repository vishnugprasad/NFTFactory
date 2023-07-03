const { expect } = require("chai");
const { ethers } = require("hardhat");


//this will converts ether into wei

const toWei = (num) => {
  // console.log(":::::::::::::::::",ethers);
  return ethers.utils.parseEther(num.toString());
};
const fromWei = (num) => ethers.formatEther(num);

describe("NFTFactory", async function () {
  let deployer, addr1, addr2, nft, nftFactory, NFT, NFTFactory;
  let feePercent = 1;
  let URI = "sample URI";
  beforeEach(async function () {
    // Get the ContractFactories and Signers here.
    const NFT = await ethers.getContractFactory("NFT");
    const NFTFactory = await ethers.getContractFactory("NFTFactory");
    [deployer, addr1, addr2] = await ethers.getSigners();

    // To deploy our contracts
    nft = await NFT.deploy();
    nftFactory = await NFTFactory.deploy(feePercent);
  });

  describe("Deployment", function () {
    it("Should track name and symbol of the nft collection", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "DApp NFT";
      const nftSymbol = "DAPP";
      expect(await nft.name()).to.equal(nftName);
      expect(await nft.symbol()).to.equal(nftSymbol);
    });

    it("Should track feeAccount and feePercent of the nft Factory", async function () {
      expect(await nftFactory.feeAccount()).to.equal(deployer.address);
      expect(await nftFactory.feePercent()).to.equal(feePercent);
    });
  });

  describe("Minting NFTs", function () {
    it("Should track each minted NFT", async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // addr2 mints an nft
      await nft.connect(addr2).createToken(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Making nft factory items", function () {
    let nftAddress, nftFactoryAddress;
    let price = 1;
    let result;
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI);
      // addr1 approves nft Factory to spend nft

      nftAddress = nft.address;
      nftFactoryAddress =  nftFactory.address;
      await nft.connect(addr1).setApprovalForAll(nftFactoryAddress, true);
    });

    it("Should track newly created item, transfer NFT from seller to nft Factory and emit Offered event", async function () {
      // addr1 offers their nft at a price of 1 ether
      await expect(nftFactory.connect(addr1).makeItem(nftAddress, 1, toWei(1)))
        .to.emit(nftFactory, "Offered")
        .withArgs(1, nftAddress, 1, toWei(1), addr1.address);
      // Owner of NFT should now be the nftFactory
      expect(await nft.ownerOf(1)).to.equal(nftFactoryAddress);
      // Item count should now equal 1
      expect(await nftFactory.itemCount()).to.equal(1);
      // Get item from items mapping then check fields to ensure they are correct
      const item = await nftFactory.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nftAddress);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(price));
      expect(item.sold).to.equal(false);
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        nftFactory.connect(addr1).makeItem(nftAddress, 1, 0)
      ).to.be.revertedWith("price should be greater than zero");
    });
  });

  describe("Purchasing nft Factory items", function () {
    let price = 0.5;
    let fee = (feePercent / 100) * price;
    let totalPriceInWei;

    beforeEach(async function () {
      nftAddress = nft.address;
      nftFactoryAddress = nftFactory.address;
      
      // addr1 mints an nft
      await nft.connect(addr1).createToken(URI); 
     
      // addr1 approves nft Factory to spend tokens
      await nft.connect(addr1).setApprovalForAll(nftFactoryAddress, true);
      
      // addr1 makes their nft a nft Factory item.
      await nftFactory.connect(addr1).makeItem(nftAddress, 1, toWei(price));
    
    });

    it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
      console.log("sellerInitalETHBal===================", addr1);
      const sellerInitalEthBal =  await ethers.provider.getBalance(addr1);
      console.log("sellerInitalETHBal===================",sellerInitalEthBal);
      const feeAccountInitialEthBal =  await ethers.provider.getBalance(deployer); 
      console.log("feeAccountInitialEthBal===================",feeAccountInitialEthBal);     
      totalPriceInWei = await nftFactory.getTotalPrice(1);
      // addr 2 purchases item.
      await expect(
        nftFactory.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      )
        .to.emit(nftFactory, "Bought")
        .withArgs(
          1,
          nftAddress,
          1,
          toWei(price),
          addr1.address,
          addr2.address
        );
      const sellerFinalEthBal =  await ethers.provider.getBalance(addr1);
      const feeAccountFinalEthBal =  await ethers.provider.getBalance(deployer);
      // Item should be marked as sold
      expect((await nftFactory.items(1)).sold).to.equal(true);
      // Seller should receive payment for the price of the NFT sold.
      expect(+fromWei(sellerFinalEthBal)).to.equal(
        +price + +fromWei(sellerInitalEthBal)
      );
      // feeAccount should receive fee
      expect(+fromWei(feeAccountFinalEthBal)).to.equal(
        +fee + +fromWei(feeAccountInitialEthBal)
      );
      // The buyer should now own the nft
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
        // fails for invalid item ids
        await expect(
          nftFactory.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
        ).to.be.revertedWith("item doesn't exist");
        await expect(
            nftFactory.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
        ).to.be.revertedWith("item doesn't exist");
        // Fails when not enough ether is paid with the transaction. 
        // In this instance, fails when buyer only sends enough ether to cover the price of the nft
        // not the additional market fee.
        await expect(
            nftFactory.connect(addr2).purchaseItem(1, {value: toWei(price)})
        ).to.be.revertedWith("not enough ether to cover item price and market fee"); 
        // addr2 purchases item 1
        await nftFactory.connect(addr2).purchaseItem(1, {value: totalPriceInWei})
        // addr3 tries purchasing item 1 after its been sold 
        
        
        await expect(
            nftFactory.connect(deployer).purchaseItem(1, {value: totalPriceInWei})
        ).to.be.revertedWith("item already sold");
      });
  });
});
