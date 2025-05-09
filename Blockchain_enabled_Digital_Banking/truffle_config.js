const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC
        },
        providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
      }),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 1000000000, // 1 Gwei
      confirmations: 2,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "0.8.7",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
