import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ onAdminLoginClick, isAdmin }) => {
  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Halifax Housing Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button href="/" color="inherit">
            Home
          </Button>
          <Button href="#find-apartment" color="inherit">
            Find an Apartment
          </Button>
          <Button href="/predict-price" color="inherit">
            Price Prediction Tool
          </Button>
          <Button href="#perks" color="inherit">
            Perks
          </Button>
          <Button href="#contact-us" color="inherit">
            Contact Us
          </Button>
          {!isAdmin && (
            <Button color="secondary" variant="outlined" onClick={onAdminLoginClick}>
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
