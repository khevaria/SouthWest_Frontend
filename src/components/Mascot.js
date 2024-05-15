import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

function Mascot({ highlightedProperties, onPropertyClick }) {
  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      bgcolor="white"
      boxShadow={3}
      p={2}
      borderRadius="8px"
      width="300px"
    >
      <Typography variant="h6" gutterBottom>Mascot</Typography>
      <List>
        {highlightedProperties.map((property) => (
          <ListItem
            button
            key={property.id}
            onClick={() => onPropertyClick(property)}
          >
            <ListItemText
              primary={`Property ID: ${property.id}`}
              secondary={`Builder: ${property.Builder}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Mascot;
