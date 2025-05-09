import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { WALLET_TYPES } from '../../utils/constants';
import Logo from '../Logo';

const Login = () => {
  const { connectWallet, error, networkError, loading } = useAuth();
  const navigate = useNavigate();

  const handleConnect = async (walletType) => {
    const result = await connectWallet(walletType);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Logo size="large" />
        </Box>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Connect Your Wallet
          </Typography>
          {(error || networkError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {networkError || error}
            </Alert>
          )}
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Connect your wallet to access the Digital Bank
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleConnect(WALLET_TYPES.METAMASK)}
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: '#F6851B',
                '&:hover': {
                  backgroundColor: '#E2761B',
                },
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  <img 
                    src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
                    alt="MetaMask" 
                    style={{ height: '24px' }}
                  />
                  Connect with MetaMask
                </>
              )}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                More options coming soon
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              disabled={true}
              sx={{
                py: 1.5,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Connect with WalletConnect
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 
