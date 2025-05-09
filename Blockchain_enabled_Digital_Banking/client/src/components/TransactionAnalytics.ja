import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  LocalAtm,
  CalendarMonth,
  ShowChart,
  AccountBalance,
} from '@mui/icons-material';

const TransactionAnalytics = ({ transactions }) => {
  const analytics = useMemo(() => {
    if (!transactions.length) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    const weeklyTransactions = transactions.filter(tx => new Date(tx.timestamp * 1000) > oneWeekAgo);
    const monthlyTransactions = transactions.filter(tx => new Date(tx.timestamp * 1000) > oneMonthAgo);
    const previousMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.timestamp * 1000);
      return txDate > twoMonthsAgo && txDate <= oneMonthAgo;
    });

    const depositSum = transactions.reduce((sum, tx) => 
      tx.type === 'deposit' ? sum + parseFloat(tx.amount) : sum, 0);
    const withdrawSum = transactions.reduce((sum, tx) => 
      tx.type === 'withdraw' ? sum + parseFloat(tx.amount) : sum, 0);
    const transferSum = transactions.reduce((sum, tx) => 
      tx.type === 'transfer' ? sum + parseFloat(tx.amount) : sum, 0);

    const totalVolume = depositSum + withdrawSum + transferSum;
    
    const averageTransaction = totalVolume / transactions.length;
    const largestTransaction = Math.max(...transactions.map(tx => parseFloat(tx.amount)));
    
    const transactionsByType = {
      deposit: transactions.filter(tx => tx.type === 'deposit').length,
      withdraw: transactions.filter(tx => tx.type === 'withdraw').length,
      transfer: transactions.filter(tx => tx.type === 'transfer').length,
    };

    const mostFrequentType = Object.entries(transactionsByType)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    // Calculate month-over-month growth
    const monthlyGrowth = previousMonthTransactions.length > 0
      ? ((monthlyTransactions.length - previousMonthTransactions.length) / previousMonthTransactions.length * 100).toFixed(1)
      : 0;

    // Calculate percentages safely
    const calculatePercentage = (value) => {
      if (totalVolume === 0) return '0.0';
      return ((value / totalVolume) * 100).toFixed(1);
    };

    return {
      weeklyCount: weeklyTransactions.length,
      monthlyCount: monthlyTransactions.length,
      monthlyGrowth,
      averageTransaction: averageTransaction.toFixed(4),
      largestTransaction: largestTransaction.toFixed(4),
      transactionsByType,
      totalVolume: totalVolume.toFixed(4),
      mostFrequentType,
      depositPercentage: calculatePercentage(depositSum),
      withdrawPercentage: calculatePercentage(withdrawSum),
      transferPercentage: calculatePercentage(transferSum),
    };
  }, [transactions]);

  if (!analytics) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Transaction Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Transaction Volume Distribution
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Deposits</Typography>
                <Typography variant="body2">{analytics.depositPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(analytics.depositPercentage) || 0} 
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Withdrawals</Typography>
                <Typography variant="body2">{analytics.withdrawPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(analytics.withdrawPercentage) || 0} 
                color="error"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Transfers</Typography>
                <Typography variant="body2">{analytics.transferPercentage}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(analytics.transferPercentage) || 0} 
                color="primary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Key Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Tooltip title="Total transaction volume">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AccountBalance color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Volume
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {analytics.totalVolume} ETH
                      </Typography>
                    </Box>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Average transaction amount">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocalAtm color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Avg. Transaction
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {analytics.averageTransaction} ETH
                      </Typography>
                    </Box>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Monthly transaction count">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CalendarMonth color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Monthly TXs
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {analytics.monthlyCount}
                      </Typography>
                    </Box>
                  </Paper>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Month-over-month transaction growth">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <ShowChart color={parseFloat(analytics.monthlyGrowth) >= 0 ? "success" : "error"} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Monthly Growth
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {analytics.monthlyGrowth}%
                      </Typography>
                    </Box>
                  </Paper>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TransactionAnalytics; 
