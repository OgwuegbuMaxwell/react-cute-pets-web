import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
const LogoImage = process.env.PUBLIC_URL + '/logo88.png';
const BASE_URL = 'http://localhost:8000/';

function SignInModal({ open, handleClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // Example breakpoint for mobile devices

  const style = {
    position: 'absolute',
    top: isMobile ? '20%' : '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    maxHeight: isMobile ? '80%' : 'auto',
  };


  const resetFields = () => {
    setUsername('');
    setPassword('');
  };


  const handleSubmit = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError('');

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(BASE_URL + 'auth/login', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        resetFields() ;
        handleClose(); 
      } else {
        throw new Error(data.message || 'An unknown error occurred');
      }
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setError('');
        handleClose();
      }}
      aria-labelledby="sign-in-modal-title"
      aria-describedby="sign-in-modal-description"
    >
      <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
        {/* Image Section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <img src={LogoImage} alt="Logo" style={{ maxWidth: '100px', height: 'auto' }} />
        </Box>
        <Typography id="sign-in-modal-title" variant="h6" component="h2">
          Sign In
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>
    </Modal>
  );
}

export default SignInModal;
