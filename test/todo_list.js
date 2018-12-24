const TodoList = artifacts.require("./TodoList.sol");
contract("TodoList", accounts => {
  it("should assert true", async () => {
    const todo_list = await TodoList.deployed();
    assert.isTrue(true);
  });

  it("add todo works", async () => {
    const todo_list = await TodoList.deployed();

    await todo_list.addTodo("test", { from: accounts[0] });

    const numTodos = await todo_list.numTodos();
    const lastTodo = await todo_list.todos(numTodos - 1);

    assert.equal(numTodos, 1, "new num todos is not 1");
    assert.equal(lastTodo.text, "test", "last todo is not test");
  });
});
