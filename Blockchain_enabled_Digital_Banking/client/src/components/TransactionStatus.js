import { Alert, Snackbar, CircularProgress, IconButton, Typography, Link, Box } from '@mui/material';
import { keyframes } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect, useRef } from 'react';
import { soundEffects } from '../utils/sounds';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const TransactionStatus = ({ status, onClose }) => {
  const isPending = status.status === 'pending';
  const isSuccess = status.status === 'success';
  const isError = status.status === 'error';
  const txHash = status.hash;
  const prevStatus = useRef(status.status);

  useEffect(() => {
    if (status.status !== prevStatus.current) {
      switch (status.status) {
        case 'pending':
          soundEffects.playSound('PENDING');
          break;
        case 'success':
          soundEffects.playSound('SUCCESS');
          break;
        case 'error':
          soundEffects.playSound('ERROR');
          break;
        default:
          break;
      }
      prevStatus.current = status.status;
    }
  }, [status.status]);

  return (
    <Snackbar
      open={status.status !== 'idle'}
      autoHideDuration={isPending ? null : 10000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: '344px',
          animation: `${slideIn} 0.5s ease-out`
        }
      }}
    >
      <Alert
        icon={false}
        severity={isSuccess ? 'success' : isError ? 'error' : 'info'}
        sx={{
          width: '100%',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          bgcolor: theme => isSuccess 
            ? theme.palette.success.light
            : isError 
              ? theme.palette.error.light
              : theme.palette.info.light,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            animation: `${fadeIn} 0.3s ease-out`
          }}
        >
          <Box sx={{ position: 'relative', mr: 2, display: 'flex' }}>
            {isPending && (
              <CircularProgress
                size={24}
                sx={{
                  animation: `${fadeIn} 0.3s ease-out`,
                  color: 'info.main'
                }}
              />
            )}
            {isSuccess && (
              <CheckCircleIcon
                sx={{
                  fontSize: 24,
                  color: 'success.main',
                  animation: `${pulse} 0.5s ease-out`,
                }}
              />
            )}
            {isError && (
              <ErrorIcon
                sx={{
                  fontSize: 24,
                  color: 'error.main',
                  animation: `${pulse} 0.5s ease-out`,
                }}
              />
            )}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                animation: `${fadeIn} 0.3s ease-out`,
                color: theme => isError ? theme.palette.error.main : 'inherit'
              }}
            >
              {status.message}
            </Typography>
            
            {txHash && (
              <Box
                sx={{
                  mt: 0.5,
                  animation: `${fadeIn} 0.3s ease-out`,
                  transition: 'all 0.2s ease'
                }}
              >
                <Link
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener"
                  variant="body2"
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      transform: 'translateX(2px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  View on Etherscan: {txHash.slice(0, 8)}...{txHash.slice(-6)}
                </Link>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  Block: {status.blockNumber || 'Pending'}
                </Typography>
              </Box>
            )}
          </Box>
          
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              ml: 1,
              alignSelf: 'flex-start',
              opacity: 0.7,
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 1,
                transform: 'scale(1.1)',
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TransactionStatus;
