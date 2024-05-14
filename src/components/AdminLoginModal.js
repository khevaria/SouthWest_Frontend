import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AdminLoginModal({ open, handleClose, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle login submission
  const submitLogin = () => {
    handleLogin(username, password);
    setUsername('');  // Reset username field
    setPassword('');  // Reset password field
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Admin Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={submitLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminLoginModal;
