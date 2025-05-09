// TransactionHistory.js (Enhanced UI)
import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography,
  Link,
  Chip
} from '@mui/material';
import { 
  ArrowDownward, 
  ArrowUpward, 
  SwapHoriz,
  AccountBalanceWallet 
} from '@mui/icons-material';
import { ethers } from 'ethers';
import { formatDistanceToNow } from 'date-fns';

const TransactionItem = ({ tx }) => {
  const isDeposit = tx.from === ethers.ZeroAddress;
  const isWithdrawal = tx.to === ethers.ZeroAddress;
  const amount = parseFloat(tx.amount).toFixed(4);
  const type = isDeposit ? 'Deposit' : isWithdrawal ? 'Withdrawal' : 'Transfer';

  // Format the timestamp
  const formatDate = (timestamp) => {
    try {
      if (!(timestamp instanceof Date) || isNaN(timestamp)) {
        console.error('Invalid timestamp:', timestamp);
        return 'Invalid date';
      }
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <ListItem 
      sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        '&:hover': { backgroundColor: 'action.hover' },
        transition: 'background-color 0.2s'
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{
          bgcolor: isDeposit ? '#4caf5022' : isWithdrawal ? '#d32f2f22' : '#2196f322',
          color: isDeposit ? '#4caf50' : isWithdrawal ? '#d32f2f' : '#2196f3'
        }}>
          {isDeposit ? <ArrowDownward /> : isWithdrawal ? <ArrowUpward /> : <SwapHoriz />}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            <span style={{ color: isDeposit ? '#4caf50' : isWithdrawal ? '#d32f2f' : 'inherit' }}>
              {amount} ETH
            </span>
            {!isDeposit && !isWithdrawal && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                to {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
              </Typography>
            )}
          </Typography>
        }
        secondary={
          <div style={{ marginTop: 4 }}>
            <Chip
              label={type}
              size="small"
              sx={{
                backgroundColor: isDeposit ? '#4caf501a' : isWithdrawal ? '#d32f2f1a' : '#2196f31a',
                color: isDeposit ? '#4caf50' : isWithdrawal ? '#d32f2f' : '#2196f3',
                mr: 1
              }}
            />
            <Link
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener"
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              View on Etherscan
            </Link>
            <Typography 
              variant="caption" 
              display="block" 
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {formatDate(tx.timestamp)}
            </Typography>
          </div>
        }
      />
    </ListItem>
  );
};

const TransactionHistory = ({ transactions }) => {
  console.log('TransactionHistory received transactions:', transactions);
  
  if (!transactions || !transactions.length) {
    console.log('No transactions to display');
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
        <AccountBalanceWallet sx={{ 
          fontSize: 50, 
          color: 'text.disabled', 
          mb: 2,
          animation: 'pulse 2s infinite'
        }} />
        <Typography variant="h6" color="text.secondary">
          No transactions yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Perform your first transaction to see it here
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ 
      p: 2, 
      bgcolor: 'background.paper',
      borderRadius: 2,
      maxHeight: '60vh',
      overflow: 'auto'
    }}>
      <Typography variant="h6" sx={{ 
        p: 2, 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'background.paper', 
        zIndex: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        Transaction History
      </Typography>
      <List sx={{ p: 0 }}>
        {transactions.map((tx, index) => (
          <TransactionItem key={`${tx.hash}-${index}`} tx={tx} />
        ))}
      </List>
    </Paper>
  );
};

export default TransactionHistory;
