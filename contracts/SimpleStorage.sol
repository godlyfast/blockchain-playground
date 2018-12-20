pragma solidity ^0.4.24;

contract SimpleStorage {
  uint storedData;
  event DataWillChange(uint oldData, uint newData);

  function set(uint x) public {
    emit DataWillChange(storedData, x);
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
