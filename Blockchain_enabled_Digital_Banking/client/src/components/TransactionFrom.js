import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import {
  AccountBalance,
  Send,
  CallMade,
} from '@mui/icons-material';

const TransactionForm = ({ onDeposit, onWithdraw, onTransfer }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setAmount('');
    setRecipient('');
    setError('');
  };

  const validateAmount = (value) => {
    if (!value || value <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    return true;
  };

  const validateAddress = (address) => {
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateAmount(amount)) return;

    try {
      switch (activeTab) {
        case 0: // Deposit
          onDeposit(amount);
          break;
        case 1: // Withdraw
          onWithdraw(amount);
          break;
        case 2: // Transfer
          if (!validateAddress(recipient)) return;
          onTransfer(recipient, amount);
          break;
        default:
          break;
      }
      setAmount('');
      setRecipient('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            minHeight: '64px',
            fontSize: '1rem',
          },
        }}
      >
        <Tab
          icon={<AccountBalance />}
          label="Deposit"
          iconPosition="start"
        />
        <Tab
          icon={<CallMade />}
          label="Withdraw"
          iconPosition="start"
        />
        <Tab
          icon={<Send />}
          label="Transfer"
          iconPosition="start"
        />
      </Tabs>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {activeTab === 0 && 'Amount to Deposit'}
            {activeTab === 1 && 'Amount to Withdraw'}
            {activeTab === 2 && 'Amount to Transfer'}
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">ETH</InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {activeTab === 2 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Recipient Address
              </Typography>
              <TextField
                fullWidth
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{
            height: 56,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          {activeTab === 0 && 'Deposit ETH'}
          {activeTab === 1 && 'Withdraw ETH'}
          {activeTab === 2 && 'Transfer ETH'}
        </Button>
      </form>
    </Box>
  );
};

export default TransactionForm;
