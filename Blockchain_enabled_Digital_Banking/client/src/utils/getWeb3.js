import { ethers } from 'ethers';

export const getEthersProvider = async () => {
  // Try Browser Provider (MetaMask etc)
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.BrowserProvider(window.ethereum);
  }

  // Fallback to Infura
  const INFURA_ID = process.env.REACT_APP_INFURA_ID;
  if (INFURA_ID) {
    return new ethers.InfuraProvider('sepolia', INFURA_ID);
  }

  throw new Error('No Ethereum provider found');
};

export const getNetworkInfo = async (provider) => {
  try {
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name,
      isSupported: network.chainId === 11155111 // Sepolia
    };
  } catch (error) {
    return {
      chainId: null,
      name: 'disconnected',
      isSupported: false
    };
  }
};

export const initializeWeb3 = async () => {
  const provider = await getEthersProvider();
  const network = await getNetworkInfo(provider);
  
  if (!network.isSupported) {
    throw new Error(`Unsupported network: ${network.name}`);
  }

  return {
    provider,
    signer: await provider.getSigner(),
    network
  };
};
