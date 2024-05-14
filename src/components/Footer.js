import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        textAlign: 'center'
      }}
    >
      <Typography variant="body1">
        © {new Date().getFullYear()} Halifax Housing Hub. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
