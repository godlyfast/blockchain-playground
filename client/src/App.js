import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TodolistContract from './contracts/TodoList.json';
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, val: 0, todos: [], todoContract: null, newTodo: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      console.log(accounts);

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      // Get the value from the contract to prove it worked.
      const response = await instance.get();

      const TodolistContract_ = truffleContract(TodolistContract);
      TodolistContract_.setProvider(web3.currentProvider);
      const TodolistContractInstance = await TodolistContract_.deployed();

      // await TodolistContractInstance.addTodo("test", {from: accounts[0]});

      const todosCount = await TodolistContractInstance.numTodos();


      for (let i=0; i< todosCount; i++) {
        const todo = await TodolistContractInstance.todos(i);
        console.log(todo, i);
        if (!todo.removed) this.setState({todos: [...this.state.todos, {...todo, id: i}]})
      }

      instance.DataWillChange().on('data', e => {
        this.setState({storageValue: e.returnValues.newData})
      })

      TodolistContractInstance.added().on('data', async e => {
        const newLen = await TodolistContractInstance.numTodos()
        this.setState({todos: [...this.state.todos, {...e.returnValues, id: newLen}]})
      })

      TodolistContractInstance.removed().on('data', async e => {
        console.log(e.returnValues.id);
        this.setState({todos: this.state.todos.filter(todo => todo.id !== e.returnValues.id*1)})
      })

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, storageValue: response.toNumber() , todoContract: TodolistContractInstance});
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

  updateE = async (event) => {
    this.setState({val:event.target.value})
  }

  addTodo = async () => {
    const {todoContract, accounts} = this.state;
    await todoContract.addTodo(this.state.newTodo, {from: accounts[0]})
  }

  removeTodo = async (id) => {
    const {todoContract, accounts, web3} = this.state;
    await todoContract.removeTodo(web3.utils.numberToHex(id), {from: accounts[0]})
  }

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
          a stored value of 5 (by default).
        </p>

        <div>The stored value is: {this.state.storageValue}</div>

        <input onChange={this.updateE} type="text"/> <button onClick={this.setVal}>SAVE</button>

        <h2>TODOS!!!</h2>
        {
          this.state.todos.map(
            (todo, i) => (
              <div key={i}>
                {todo.text}
                <button onClick={() => this.removeTodo(todo.id)}>x</button>
              </div>
            )
          )
        }
        <input onChange={(e) => this.setState({newTodo: e.target.value})}/>
        <button onClick={this.addTodo}>ADD</button>
      </div>
    );
  }
}

export default App;
