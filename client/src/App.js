import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

import TodoList from "./components/TodoList";
import SimpleStorage from "./components/SimpleStorage";

class App extends Component {
  state = {
    web3: null,
    accounts: null
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
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  render() {
    const { web3, accounts } = this.state;
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value.
        </p>
        <SimpleStorage web3={web3} accounts={accounts} />
        <TodoList web3={web3} accounts={accounts} />
      </div>
    );
  }
}

export default App;
