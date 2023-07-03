import './App.css';


import Navigation from './Navbar';
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
import { useState } from 'react'
import MarketplaceAbi from './contractsData/NFTFactory.json'
import MarketplaceAddress from './contractsData/NFTFactory-address.json'
import NFTAbi from './contractsData/NFT.json'
import NFTAddress from './contractsData/NFT-address.json'
import Home from './Home.js'  
import Create from './Create.js'
import Transactions from './Transactions'
import ListedItems from './ListedItem'
import MyPurchases from './Purchases'
import { Spinner } from 'react-bootstrap'

// import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { ethers } from "ethers";



function App(){
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(true)
    const [nft, setNFT] = useState({})
    const [nftFactory, setnftFactory] = useState({})   

    
    //function to connect to the blockchain
    const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/iJy3n5ft1bCKj7dnb0cX08cptMtj-2Rz");
    loadContracts(signer)

    }

    const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setnftFactory(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
    }

    return (
        <BrowserRouter>
          <div className="App">
            <>
              <Navigation web3Handler={web3Handler} account={account} />
            </>
            <div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                  <Spinner animation="border" style={{ display: 'flex' }} />
                  <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={
                    <Home nftFactory={nftFactory} nft={nft} />
                  } />
                  <Route path="/create" element={
                    <Create nftFactory={nftFactory} nft={nft} />
                  } />
                  <Route path="/my-listed-items" element={
                    <ListedItems nftFactory={nftFactory} nft={nft} account={account}  />
                  } />
                  <Route path="/my-purchases" element={
                    <MyPurchases nftFactory={nftFactory} nft={nft} account={account} />
                  } />
                  <Route path="/my-transactions" element={
                    <Transactions  />
                  } />
                </Routes>
              )}
            </div>
          </div>
        </BrowserRouter>
    
      );
    
}

export default App