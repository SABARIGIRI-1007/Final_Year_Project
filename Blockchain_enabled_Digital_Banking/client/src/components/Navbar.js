import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo showText={true} size="small" />
          </Link>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            color="inherit"
            sx={{ 
              fontWeight: location.pathname === '/' ? 700 : 400,
              borderBottom: location.pathname === '/' ? '2px solid' : 'none',
              borderRadius: '4px 4px 0 0',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/transactions" 
            color="inherit"
            sx={{ 
              fontWeight: location.pathname === '/transactions' ? 700 : 400,
              borderBottom: location.pathname === '/transactions' ? '2px solid' : 'none',
              borderRadius: '4px 4px 0 0',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Transactions
          </Button>

          {currentUser && (
            <>
              <Box 
                sx={{ 
                  px: 2,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 500 }}>
                  {currentUser.name || currentUser.email}
                </Typography>
              </Box>
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'transform 0.2s'
                }}
              >
                <Logout />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
