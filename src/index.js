import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  
} from "@apollo/client";
import "bootstrap/dist/css/bootstrap.css";
import App from "./ui/App";
// import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/49225/nftfactory_vishnu/version/latest",
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
