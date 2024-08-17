import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
const LogoImage = process.env.PUBLIC_URL + '/logo88.png';
const BASE_URL = 'http://localhost:8000/';

function SignUpModal({ open, handleClose, onSignUp }) {  // Added onSignUp prop
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL + 'user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {

        // log user in after successful sign up
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
          const signInRes = await fetch(BASE_URL + 'auth/login', {
            method: 'POST',
            body: formData
          });
          const signIndata = await signInRes.json();
          if (signInRes.ok) {
          resetFields();
          handleClose(); // Close the modal on successful registration and successful sign in
          }
          if (onSignUp) {
            onSignUp(signIndata); // Trigger the onSignUp callback if provided
          }
        } catch (error) {
          setError(error.message);
          console.error('Unable to sign in after successful sign up:', error);
        } finally {
          setLoading(false);
        }

      } else {
        throw new Error(data.message || 'An unknown error occurred');
      }
    } catch (error) {
      setError(error.message);
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setError('');
        resetFields();
        handleClose();
      }}
      aria-labelledby="sign-up-modal-title"
      aria-describedby="sign-up-modal-description"
    >
      <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <img src={LogoImage} alt="Logo" style={{ maxWidth: '100px', height: 'auto' }} />
        </Box>
        
        <Typography id="sign-up-modal-title" variant="h6" component="h2">
          Sign Up
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
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
      </Box>
    </Modal>
  );
}

export default SignUpModal;
