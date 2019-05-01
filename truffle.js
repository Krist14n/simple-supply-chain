var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "bunker life deny record denial donor chase artwork jungle know kangaroo admit";

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
          return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/a5ce75cde96247a8a49c38e62c17d9c0");
            },
            network_id: 1
        }
  }
};