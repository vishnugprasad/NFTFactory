import { useState, useEffect } from 'react'
import { ethers } from "ethers";
import axios from "axios"
// import { formatEther, JsonRpcProvider, Contract, BrowserProvider } from "ethers";
import { Row, Col, Card } from 'react-bootstrap'


export default function Purchases({ nftFactory, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    console.log("==========window========",window);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner()
  // const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/iJy3n5ft1bCKj7dnb0cX08cptMtj-2Rz");
  // const contract = new ethers.Contract(NFTFactoryAddress.address, NFTFactoryAbi.abi, provider);
  const bought =  nftFactory.filters.Bought(null,null,null,null,null,account)
  const result = await nftFactory.queryFilter(bought);
    // Fetch purchased items from nftFactory by quering Offered events with the buyer set as the user

    
    // const offered = nftFactory.filters.Offered(null,null,null,null,null)
    // const results = await nftFactory.queryFilter(bought)
    // const items = []
  
    // for (let i = 0; i < nftFactory.items.length; i++) {
    //     let itemId = i;
    //     const itemName = nftFactory.items[itemId];
    //     items.push(itemName)
  
        
    //   }
    // console.log("+++++++++++++ printing items++++++++++++++++++++",bought, offered);

    
      
    //   const results = await nftFactory.getNFTs("getNFTs",filter);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(result.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await axios.get(uri,  {headers: {
        'Accept': 'text/plain'
      }})
      const metadata = JSON.parse(Object.keys(response.data)[0])
      // get total price of item (item price + fee)
      const totalPrice = await nftFactory.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}