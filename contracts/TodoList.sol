pragma solidity 0.5.0;

contract TodoList {
  struct Todo {
    string text;
    bool removed;
  }
  Todo[] public todos;
  event added(string text);
  event removed(uint id);

  function addTodo(string memory text) public {
    todos.push(Todo(text, false));
    emit added(text);
  }

  function removeTodo(uint id) public {
    todos[id].removed = true;
    emit removed(id);
  }

  function numTodos() public view returns (uint) {
      return todos.length;
  }
}
