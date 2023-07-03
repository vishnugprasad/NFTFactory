import React from "react";
import { useQuery, gql } from "@apollo/client";
import Table from "react-bootstrap/Table";
import "./App.css"

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    boughts(orderBy: tokenId){
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
      price
      buyer
      seller
    }

    offereds(orderBy: tokenId){
      tokenId
      blockNumber
      blockTimestamp
      transactionHash
      seller
    }
  }
`;
export const Transactions = () => {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'network-only', // Doesn't check cache before making a network request
  } );
  console.log("################## data ", data);
  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Something went wrong.</div>;
  }
  return (
    <div style={{display:"flex", flexDirection: "column", gap : "10px", margin: "10px"}} className="table">
        <div style={{fontWeight:"bold", textAlign: "center"}}>BOUGHT</div>
      <Table striped bordered hover variant="dark" responsive >
        <thead>
          <tr>
            <th>tokenId</th>
            <th>blockNumber</th>
            <th>blockTimestamp</th>
            <th>transactionHash</th>
            <th>buyer</th>
            <th>seller</th>
          </tr>
        </thead>
        <tbody>
        {data.boughts.map((item)=>{
            return(<tr>
                <td>{item.tokenId}</td>
                <td>{item.blockNumber}</td>
                <td>{item.blockTimestamp}</td>
                <td style={{width:"25px"}}>{item.transactionHash}</td>           
                <td>{item.buyer}</td>
                <td>{item.seller}</td>
                
            </tr>)

            
        })}
          {/* <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr> */}
        </tbody>
      </Table>


          <div style={{fontWeight:"bold", textAlign: "center"}}>OFFERED</div>
      <Table responsive striped bordered hover variant="dark" style={{height:"45vh"}} className="table">
        
        <thead>
          <tr>
            <th style={{width: "5%"}}>tokenId</th>
            <th>blockNumber</th>
            <th>blockTimestamp</th>
            <th>transactionHash</th>                       
            <th>seller</th>      
          </tr>
        </thead>
        <tbody>
        {data.offereds.map((item)=>{
            return(<tr>
                <td>{item.tokenId}</td>
                <td>{item.blockNumber}</td>
                <td>{item.blockTimestamp}</td>
                <td>{item.transactionHash}</td>
                <td>{item.seller}</td>
            </tr>)

            
        })}
          {/* <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr> */}
        </tbody>
      </Table>
    </div>
  );
};

export default Transactions;
