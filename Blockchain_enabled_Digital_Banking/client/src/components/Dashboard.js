import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { AccountBalance, SwapHoriz, TrendingUp } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      background: `linear-gradient(45deg, ${color} 30%, ${color}99 90%)`,
      color: 'white',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
);

const Dashboard = ({ balance, stats }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Account Balance"
          value={`${balance} ETH`}
          icon={<AccountBalance sx={{ fontSize: 32 }} />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Transactions"
          value={stats.transactions}
          icon={<SwapHoriz sx={{ fontSize: 32 }} />}
          color="#9c27b0"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Volume"
          value={`${stats.volume} ETH`}
          icon={<TrendingUp sx={{ fontSize: 32 }} />}
          color="#4caf50"
        />
      </Grid>
    </Grid>
  );
};

// Updated PropTypes
Dashboard.propTypes = {
  balance: PropTypes.string,
  stats: PropTypes.shape({
    transactions: PropTypes.number,
    volume: PropTypes.string
  })
};

// Updated defaultProps
Dashboard.defaultProps = {
  balance: '0',
  stats: {
    transactions: 0,
    volume: '0'
  }
};

export default Dashboard;
