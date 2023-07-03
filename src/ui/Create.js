import { useState } from 'react'
// import {  parseEther, BrowserProvider, Contract} from "ethers"
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
import {uploadJSONToIPFS, uploadFileToIPFS} from "../connectIPFS"

const Create = ({ nftFactory, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await uploadFileToIPFS(file)
        console.log("result ::::::::",result)
        setImage(result.pinataURL)
        console.log("IMAGE::::", image);
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const result = await uploadJSONToIPFS(JSON.stringify({image, price, name, description}))
      console.log("CREATE NFT result:::::", result);
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {

    const uri = result.pinataURL
    console.log("mintThenList uri::::", uri);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner()
    // const newNft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    // console.log(newNft.hello());
    const transaction = await nft.createToken(uri)
    await transaction.wait()
    
    // await(await nft.createToken(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve nftFactory to spend nft
    await(await nft.setApprovalForAll(nftFactory.address, true)).wait()
    // add nft to nftFactory
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await nftFactory.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create