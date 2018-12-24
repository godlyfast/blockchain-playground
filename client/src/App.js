import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

import TodoList from './components/TodoList'

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, val: 0, todos: [], todoContract: null, newTodo: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();


      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      // Get the value from the contract to prove it worked.
      const response = await instance.get();

      instance.DataWillChange().on('data', e => {
        this.setState({storageValue: e.returnValues.newData})
      })

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, storageValue: response.toNumber()});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  setVal = async () => {
    const { accounts, contract, val } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(val, { from: accounts[0] });
  };

  render() {
    if (!this.state.web3) {
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

        <div>The stored value is: {this.state.storageValue}</div>

        <input onChange={(event) => {
          this.setState({val:event.target.value})
        }} type="text"/> <button onClick={this.setVal}>SAVE</button>

        <TodoList/>

      </div>
    );
  }
}

export default App;
