This is an NFT Factory app.
In which the user can connect his wallet and create his/her own nft and set it for sale on the market.
user can also see and buy other NFTs listed in the market by other users.

To run the UI,
start with  installing the dependencies
```
    npm install
```
To run the App
```
    npm start
```
Connect the wallet make a sale !!!!!

To run the test case
```
npx hardhat test
```

To deploy a new contract

create a .env file and add your private key with the key PRIVATE_KY
```
npx hardhat run --network sepolia scripts/deployNFT.js
```

To connect The Graph 
```
   git submodule init
   git submodule update
  cd nftFactory_vishnu
  ```
edit the dataSources.source.address to the newly created contract address 
Then run the graph build and deploy commands
