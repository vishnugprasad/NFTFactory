import { useState, useEffect } from 'react'
// import { formatEther } from "ethers"
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import axios from "axios"

const Home = ({ nftFactory, nft }) => {
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const loadNFTFactoryItems = async () => {
      // Load all unsold items
      const itemCount = await nftFactory.itemCount()
      console.log("item count ====>", itemCount);
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await nftFactory.items(i)
        if (!item.sold) {
          // get uri url from nft contract
          const uri = await nft.tokenURI(item.tokenId)
          // use uri to fetch the nft metadata stored on ipfs 
          const response = await axios.get(uri,  {headers: {
            'Accept': 'text/plain'
          }})
          const metadata = JSON.parse(Object.keys(response.data)[0])
          // get total price of item (item price + fee)
          const totalPrice = await nftFactory.getTotalPrice(item.itemId)
          // Add item to items array
          items.push({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          })
        }
      }
      setLoading(false)
      setItems(items)
    }
  
    const buyMarketItem = async (item) => {
      await (await nftFactory.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
      loadNFTFactoryItems()
    }
  
    useEffect(() => {
      loadNFTFactoryItems()
    }, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
    return (
      <div className="flex justify-center">
        {items.length > 0 ?
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {items.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                          Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
            </main>
          )}
      </div>
    );
  }
  export default Home