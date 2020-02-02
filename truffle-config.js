const HDWalletProvider = require('truffle-hdwallet-provider')
module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider("4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7", "http://localhost:8545");
      },
      network_id: "58342",
    }
  },
  compilers: {
    solc: {
      version: "0.6.2",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
