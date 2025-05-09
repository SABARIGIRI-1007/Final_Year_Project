import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import BankInterface from './components/BankInterface';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return null; // Or a loading spinner
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="App">
        {currentUser && <Navbar />}
        <Routes>
          <Route path="/login" element={
            !currentUser ? <Login /> : <Navigate to="/" />
          } />
          <Route path="/" element={
            <PrivateRoute>
              <BankInterface />
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <BankInterface />
            </PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute>
              <BankInterface />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
