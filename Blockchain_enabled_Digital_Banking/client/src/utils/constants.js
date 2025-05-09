export const SUPPORTED_NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  }
};

export const DEFAULT_NETWORK = 'sepolia';

export const WALLET_TYPES = {
  METAMASK: 'MetaMask',
  WALLET_CONNECT: 'WalletConnect'
}; 
