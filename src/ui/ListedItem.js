import { useState, useEffect } from 'react'
// import { formatEther } from "ethers"
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'
import axios from "axios"
function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function ListedItems({ nftFactory, nft, account }) {
  console.log("INSIDE THE LISTEDITEM FUNCTION");
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    console.log("inside load listed item ===>>");
    const itemCount = await nftFactory.itemCount()
    console.log("item count",itemCount );
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await nftFactory.items(indx)
      console.log("items ====>", i.seller);
      if (i.seller.toLowerCase() === account) {
        console.log(i.tokenId);
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        console.log("URI", uri);
        // use uri to fetch the nft metadata stored on ipfs 
       
        const response = await axios.get(uri,  {headers: {
          'Accept': 'text/plain'
        }})
        const metadata = JSON.parse(Object.keys(response.data)[0])
        console.log("metadata", metadata);
        console.log("response ########", response.data);
        // get total price of item (item price + fee)
        const totalPrice = await nftFactory.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  console.log("listed item ==>", listedItems);
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}

