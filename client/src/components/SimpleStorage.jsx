import React, { Component } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";

export default class SimpleStorage extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    val: 0
  };
  async componentDidMount() {
    const { web3, accounts } = this.props;

    // Get the contract instance.
    const Contract = truffleContract(SimpleStorageContract);
    Contract.setProvider(web3.currentProvider);
    const instance = await Contract.deployed();
    // Get the value from the contract to prove it worked.
    const response = await instance.get();

    instance.DataWillChange().on("data", e => {
      this.setState({ storageValue: e.returnValues.newData });
    });

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({
      web3,
      accounts,
      contract: instance,
      storageValue: response.toNumber()
    });
  }
  setVal = async () => {
    const { accounts, contract, val } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(val, { from: accounts[0] });
  };
  render() {
    return (
      <div>
        <h3>SIMPLE INT STORAGE</h3>
        <div>The stored value is: {this.state.storageValue}</div>
        <input
          onChange={event => {
            this.setState({ val: event.target.value });
          }}
          type="text"
        />{" "}
        <button onClick={this.setVal}>SAVE</button>
      </div>
    );
  }
}
