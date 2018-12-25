import React, { Component } from "react";
import TodolistContract from "../contracts/TodoList.json";
import truffleContract from "truffle-contract";

export class TodoList extends Component {
  state = {
    web3: null,
    accounts: null,
    todos: [],
    todoContract: null,
    newTodo: null,
    err: null
  };

  componentDidMount = async () => {
    // Get network provider and web3 instance.
    const { web3, accounts } = this.props;

    const TodolistContract_ = truffleContract(TodolistContract);
    TodolistContract_.setProvider(web3.currentProvider);
    try {
      const TodolistContractInstance = await TodolistContract_.deployed();

      this.setState({ web3, accounts, TodolistContractInstance });

      TodolistContractInstance.added().on("data", async e => {
        const newLen = await TodolistContractInstance.numTodos();
        this.setState({
          todos: [
            ...this.state.todos,
            { text: e.returnValues.text, id: newLen.toNumber() - 1 }
          ]
        });
      });

      TodolistContractInstance.removed().on("data", async e => {
        this.setState({
          todos: this.state.todos.filter(
            todo => todo.id !== e.returnValues.id * 1
          )
        });
      });

      await this.getTodos();
    } catch (err) {
      this.setState({ err });
    }
  };

  getTodos = async () => {
    const { TodolistContractInstance } = this.state;
    const todosCount = await TodolistContractInstance.numTodos();

    for (let i = 0; i < todosCount; i++) {
      const todo = await TodolistContractInstance.todos(i);
      console.log(todo, i);
      if (!todo.removed)
        this.setState({ todos: [...this.state.todos, { ...todo, id: i }] });
    }
  };

  addTodo = async () => {
    const { TodolistContractInstance, accounts } = this.state;
    await TodolistContractInstance.addTodo(this.state.newTodo, {
      from: accounts[0]
    });
  };

  removeTodo = async id => {
    const { TodolistContractInstance, accounts, web3 } = this.state;
    await TodolistContractInstance.removeTodo(web3.utils.numberToHex(id), {
      from: accounts[0]
    });
  };

  render() {
    const { err, todos } = this.state;
    return (
      <div>
        <h3>TODOS!!!</h3>
        {err ? (
          err.message
        ) : (
          <div>
            {todos.map((todo, i) => (
              <div key={i}>
                {todo.text} | {todo.id}
                <button onClick={() => this.removeTodo(todo.id)}>x</button>
              </div>
            ))}
            <input onChange={e => this.setState({ newTodo: e.target.value })} />
            <button onClick={this.addTodo}>ADD</button>
          </div>
        )}
      </div>
    );
  }
}

export default TodoList;
