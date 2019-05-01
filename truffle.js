var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "twelve word mnemonic...";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6500000
    },
    rinkeby: {
        provider: function () {
          return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/<api_key>");
            },
            network_id: 1
        }
  }
};