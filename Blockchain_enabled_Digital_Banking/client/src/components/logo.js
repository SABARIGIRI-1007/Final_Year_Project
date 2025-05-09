import React from 'react';
import { Box, Typography } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';

const Logo = ({ size = 'medium', showText = true }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 28, text: '1.1rem', padding: '6px' };
      case 'large':
        return { icon: 56, text: '2rem', padding: '12px' };
      default: // medium
        return { icon: 36, text: '1.5rem', padding: '8px' };
    }
  };

  const dimensions = getSize();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          borderRadius: '14px',
          padding: dimensions.padding,
          boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
            opacity: 0.5,
            animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'scale(1.15)',
              opacity: 0,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 0.5,
            },
          },
        }}
      >
        <AccountBalanceWallet
          sx={{
            fontSize: dimensions.icon,
            color: '#fff',
            position: 'relative',
            zIndex: 1,
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(-3px)',
              },
            },
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontSize: dimensions.text,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateX(2px)',
            },
          }}
        >
          Digital Bank
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 
