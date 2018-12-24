import React, { Component } from 'react';
import getWeb3 from "../utils/getWeb3";
import TodolistContract from '../contracts/TodoList.json'
import truffleContract from "truffle-contract";

export class TodoList extends Component {
  state = { web3: null, accounts: null, todos: [], todoContract: null, newTodo: null };

  async componentDidMount(){

    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    const TodolistContract_ = truffleContract(TodolistContract);
    TodolistContract_.setProvider(web3.currentProvider);
    const TodolistContractInstance = await TodolistContract_.deployed();

    const todosCount = await TodolistContractInstance.numTodos();


    for (let i=0; i< todosCount; i++) {
      const todo = await TodolistContractInstance.todos(i);
      console.log(todo, i);
      if (!todo.removed) this.setState({todos: [...this.state.todos, {...todo, id: i}]})
    }

    TodolistContractInstance.added().on('data', async e => {
      const newLen = await TodolistContractInstance.numTodos()
      this.setState({todos: [...this.state.todos, {text: e.returnValues.text, id: newLen.toNumber()-1}]})
    })

    TodolistContractInstance.removed().on('data', async e => {
      this.setState({todos: this.state.todos.filter(todo => todo.id !== e.returnValues.id*1)})
    })

    this.setState({ web3, accounts, todoContract: TodolistContractInstance});

  }

  addTodo = async () => {
    const {todoContract, accounts} = this.state;
    await todoContract.addTodo(this.state.newTodo, {from: accounts[0]})
  }

  removeTodo = async (id) => {
    const {todoContract, accounts, web3} = this.state;
    console.log('RM TODO', id);
    await todoContract.removeTodo(web3.utils.numberToHex(id), {from: accounts[0]})
  }
  render() {

    return (
      <div>
      <h2>TODOS!!!</h2>
      {
        this.state.todos.map(
          (todo, i) => (
            <div key={i}>
              {todo.text} | {todo.id}
              <button onClick={() => this.removeTodo(todo.id)}>x</button>
            </div>
          )
        )
      }
      <input onChange={(e) => this.setState({newTodo: e.target.value})}/>
      <button onClick={this.addTodo}>ADD</button>
      </div>
    )
  }
}

export default TodoList
