const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/6fb50027e87d49e0889b97a5fba78722"
        ),
      network_id: "*",
      gas: 4000000
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "https://kovan.infura.io/v3/6fb50027e87d49e0889b97a5fba78722"
        ),
      network_id: "*",
      gas: 4000000
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/6fb50027e87d49e0889b97a5fba78722"
        ),
      network_id: "*",
      gas: 4000000
    }
  }
};
