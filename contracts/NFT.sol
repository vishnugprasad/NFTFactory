// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    constructor() ERC721("DApp NFT", "DAPP"){}
    // function mint(string memory _tokenURI) external returns(uint) {

    //     console.log("here in NFT sol");
    //     tokenCount ++;
    //     _safeMint(msg.sender, tokenCount);
    //     _setTokenURI(tokenCount, _tokenURI);
    //     return(tokenCount);
    // }
        // function createToken(address to, string memory tokenURI) public payable returns (uint){
        // // require(_tokenIdCounter.current() <= (MAX_SUPPLY - ownerAmount), "I'm sorry we reached the cap"); // Check owner reserve
        // // require(balanceOf(msg.sender) == 0, "Max Mint per wallet reached"); // Check mint limit
        // uint256 newTokenId = tokenCount.current();
        // tokenCount.increment();
        // _safeMint(to, newTokenId);
        // _setTokenURI(newTokenId, tokenURI);
        // return newTokenId;
        // }


    function createToken(string memory tokenURI) public payable returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        tokenCount ++;
        uint256 newTokenId = tokenCount;

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        

        return newTokenId;
    }

    
}