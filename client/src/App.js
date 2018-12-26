import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

import TodoList from "./components/TodoList";
import SimpleStorage from "./components/SimpleStorage";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    err: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      this.setState({err: error});
      console.log(error);
    }
  };

  render() {
    const { web3, accounts, err } = this.state;
    if (err) {
      return <div>OH NO! There was an Error while trying communicate to blockchain <br /> ERR MESSAGE: "{err.message}" <br /> Please ensure you have metamask plugin installed and enabled <br /> If you don't have one you cat install it <a href="https://metamask.io/">here</a></div>
    }
    if (!web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h2>Smart Contract Examples</h2>

        <SimpleStorage web3={web3} accounts={accounts} />
        <TodoList web3={web3} accounts={accounts} />
      </div>
    );
  }
}

export default App;
