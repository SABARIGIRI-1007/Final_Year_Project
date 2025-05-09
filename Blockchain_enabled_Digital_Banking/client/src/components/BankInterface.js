import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Dashboard from './Dashboard';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import TransactionStatus from './TransactionStatus';
import TransactionAnalytics from './TransactionAnalytics';
import BankABI from '../contracts/Bank.json';
import { Container, Paper, Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Contract address from deployment
const CONTRACT_ADDRESS = "Your contract address";

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const BankInterface = () => {
  const [bankContract, setBankContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState('');
  const [stats, setStats] = useState({ 
    transactions: 0, 
    volume: '0' 
  });
  const [txStatus, setTxStatus] = useState({
    status: 'idle',
    message: '',
    hash: ''
  });

  // Memoized data fetching functions
  const updateBalances = useCallback(async (contract) => {
    if (!contract || !account) return;
    try {
      console.log('Updating balance for account:', account);
      const userBalance = await contract.balances(account);
      console.log('Raw balance:', userBalance.toString());
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error('Balance update failed:', error);
      setBalance('0');
    }
  }, [account]);

  const loadTransactions = useCallback(async (contract) => {
    if (!contract) return;
    try {
      console.log('Loading transactions...');
      const filter = contract.filters.TransactionRecorded();
      console.log('Transaction filter:', filter);
      
      const txEvents = await contract.queryFilter(filter);
      console.log('Found transactions:', txEvents);
      
      const formattedTx = await Promise.all(txEvents.map(async event => {
        console.log('Processing event:', event);
        console.log('Event args:', event.args);
        console.log('Event topics:', event.topics);
        
        // Get the block for timestamp
        const block = await event.getBlock();
        console.log('Block:', block);
        
        return {
          from: event.args.from,
          to: event.args.to,
          amount: ethers.formatEther(event.args.amount),
          timestamp: new Date(block.timestamp * 1000),
          hash: event.transactionHash
        };
      }));
      
      console.log('Formatted transactions:', formattedTx);
      setTransactions(formattedTx.reverse());
    } catch (error) {
      console.error('Transaction history load failed:', error);
      console.error('Error stack:', error.stack);
      setTransactions([]);
    }
  }, []);

  const loadStats = useCallback(async (contract) => {
    if (!contract) return;
    try {
      const filter = contract.filters.TransactionRecorded();
      const txEvents = await contract.queryFilter(filter);
      const totalVolume = txEvents.reduce((acc, event) => {
        return acc + ethers.toBigInt(event.args.amount);
      }, ethers.toBigInt(0));
      
      setStats({
        transactions: txEvents.length,
        volume: ethers.formatEther(totalVolume)
      });
    } catch (error) {
      console.error('Stats load failed:', error);
      console.error('Error stack:', error.stack);
    }
  }, []);

  // Real-time transaction listener
  useEffect(() => {
    if (!bankContract) return;

    const handleNewTransaction = async (from, to, amount, timestamp, event) => {
      // The event object is actually the first argument in v6 of ethers
      const eventObj = from; // 'from' is actually the event object
      console.log('New transaction event received:', eventObj);
      
      try {
        const block = await eventObj.getBlock();
        console.log('Transaction block:', block);
        
        const formattedTx = {
          from: eventObj.args[0],
          to: eventObj.args[1],
          amount: ethers.formatEther(eventObj.args[2]),
          timestamp: new Date(Number(eventObj.args[3]) * 1000),
          hash: eventObj.transactionHash
        };
        console.log('Formatted new transaction:', formattedTx);

        setTransactions(prev => {
          const newTransactions = [formattedTx, ...prev];
          console.log('Updated transactions:', newTransactions);
          return newTransactions;
        });
        
        setStats(prev => ({
          ...prev,
          transactions: prev.transactions + 1,
          volume: (parseFloat(prev.volume) + parseFloat(formattedTx.amount)).toFixed(4)
        }));
      } catch (error) {
        console.error('Error processing new transaction:', error);
        console.error('Error stack:', error.stack);
      }
    };

    console.log('Setting up transaction listener...');
    const filter = bankContract.filters.TransactionRecorded();
    console.log('Event filter:', filter);
    bankContract.on(filter, handleNewTransaction);

    return () => {
      console.log('Cleaning up transaction listener...');
      bankContract.off(filter, handleNewTransaction);
    };
  }, [bankContract]);

  // Initialize contract and load data
  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const network = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('Current network:', network);
          
          if (network !== '0xaa36a7') {
            console.log('Switching to Sepolia network...');
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }]
            });
          }

          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Connected account:', accounts[0]);
          
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          console.log('Initializing contract at address:', CONTRACT_ADDRESS);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            BankABI.abi,
            signer
          );
          
          // Verify contract
          try {
            const code = await provider.getCode(CONTRACT_ADDRESS);
            if (code === '0x') {
              throw new Error('No contract deployed at this address');
            }
            console.log('Contract verified at address');
          } catch (error) {
            console.error('Contract verification failed:', error);
            throw error;
          }
          
          setAccount(accounts[0]);
          setBankContract(contract);
          
          // Load initial data
          console.log('Loading initial data...');
          await Promise.all([
            updateBalances(contract),
            loadTransactions(contract),
            loadStats(contract)
          ]);
          console.log('Initial data loaded');

          // Event listeners
          const handleAccountsChanged = async (accounts) => {
            setAccount(accounts[0] || '');
            if (accounts[0]) {
              await Promise.all([
                updateBalances(contract),
                loadTransactions(contract),
                loadStats(contract)
              ]);
            } else {
              setBalance('0');
              setTransactions([]);
              setStats({ transactions: 0, volume: '0' });
            }
          };

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', () => window.location.reload());

          return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', () => window.location.reload());
          };
        } catch (error) {
          console.error('Initialization error:', error);
          setTxStatus({
            status: 'error',
            message: error.message || 'Initialization failed',
            hash: ''
          });
        }
      }
    };

    initialize();
  }, [updateBalances, loadTransactions, loadStats]);

  // Handle transactions
  const handleTransaction = async (action, args = [], overrides = {}) => {
    if (!bankContract) return;
    
    try {
      setTxStatus({
        status: 'pending',
        message: 'Confirm transaction in MetaMask...',
        hash: ''
      });

      const estimatedGas = await bankContract[action].estimateGas(...args, overrides);
      const feeData = await bankContract.runner.provider.getFeeData();
      
      const tx = await bankContract[action](...args, {
        ...overrides,
        gasLimit: estimatedGas * 120n / 100n,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      });

      setTxStatus({
        status: 'pending',
        message: 'Transaction submitted...',
        hash: tx.hash
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Immediate balance update and reload transactions
        await Promise.all([
          updateBalances(bankContract),
          loadTransactions(bankContract),
          loadStats(bankContract)
        ]);
        
        setTxStatus({
          status: 'success',
          message: 'Transaction confirmed!',
          hash: tx.hash
        });
      } else {
        setTxStatus({
          status: 'error',
          message: 'Transaction failed',
          hash: tx.hash
        });
      }
    } catch (error) {
      const errorMessage = error.reason || error.data?.message || error.message || 'Unknown error';
      setTxStatus({
        status: 'error',
        message: errorMessage,
        hash: error.transactionHash || ''
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  BLOCK BANK
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  A Decentralized Banking Solution
                </Typography>
              </Box>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Connected Account
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}
                </Typography>
              </Paper>
            </Box>
          </Paper>

          <TransactionStatus status={txStatus} />

          <Box sx={{ mb: 4 }}>
            <Dashboard 
              balance={balance}
              stats={stats}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <TransactionAnalytics transactions={transactions} />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '350px 1fr' },
              gap: 3,
            }}
          >
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: 'background.paper',
                }}
              >
                <TransactionForm
                  onDeposit={(amount) => handleTransaction('deposit', [], { value: ethers.parseEther(amount) })}
                  onWithdraw={(amount) => handleTransaction('withdraw', [ethers.parseEther(amount)])}
                  onTransfer={(to, amount) => handleTransaction('transfer', [to, ethers.parseEther(amount)])}
                />
              </Paper>
            </Box>
            
            <Box>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: 'background.paper',
                }}
              >
                <TransactionHistory transactions={transactions} />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default BankInterface;
