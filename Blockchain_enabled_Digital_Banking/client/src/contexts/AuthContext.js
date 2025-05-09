import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK, WALLET_TYPES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const checkAndSwitchNetwork = useCallback(async (provider) => {
    try {
      const network = await provider.getNetwork();
      const targetNetwork = SUPPORTED_NETWORKS[DEFAULT_NETWORK];
      const targetChainId = parseInt(targetNetwork.chainId, 16);

      if (network.chainId !== targetChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetwork.chainId }],
          });
          return true;
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [targetNetwork],
              });
              return true;
            } catch (addError) {
              setNetworkError('Failed to add network to wallet');
              return false;
            }
          } else {
            setNetworkError('Failed to switch network');
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      setNetworkError('Failed to detect network');
      return false;
    }
  }, []);

  const connectWallet = useCallback(async (type = WALLET_TYPES.METAMASK) => {
    try {
      setError(null);
      setNetworkError(null);
      setLoading(true);

      let provider;
      switch (type) {
        case WALLET_TYPES.METAMASK:
          if (!window.ethereum) {
            throw new Error('Please install MetaMask to use this application');
          }
          provider = new BrowserProvider(window.ethereum);
          break;
        case WALLET_TYPES.WALLET_CONNECT:
          // WalletConnect implementation will go here
          throw new Error('WalletConnect support coming soon');
        default:
          throw new Error('Unsupported wallet type');
      }

      await provider.send("eth_requestAccounts", []);
      
      const networkValid = await checkAndSwitchNetwork(provider);
      if (!networkValid) {
        throw new Error('Please switch to the correct network');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      
      const user = {
        address,
        balance: formatEther(balance),
        walletType: type
      };

      setCurrentUser(user);
      setWalletType(type);
      return { success: true, user };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [checkAndSwitchNetwork]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const networkValid = await checkAndSwitchNetwork(provider);
            if (!networkValid) return;

            const address = accounts[0].address;
            const balance = await provider.getBalance(address);
            setCurrentUser({
              address,
              balance: formatEther(balance),
              walletType: WALLET_TYPES.METAMASK
            });
            setWalletType(WALLET_TYPES.METAMASK);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setError('Failed to check existing connection');
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        connectWallet(walletType);
      } else {
        logout();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, checkAndSwitchNetwork, walletType]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setWalletType(null);
    setError(null);
    setNetworkError(null);
  }, []);

  const value = {
    currentUser,
    connectWallet,
    logout,
    loading,
    error,
    networkError,
    walletType
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
