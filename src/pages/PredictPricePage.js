import React from 'react';
import { Box } from '@mui/material';
import PredictPriceForm from '../components/PredictPriceForm';
import Footer from '../components/Footer';

function PredictPricePage() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flex="1" display="flex" justifyContent="space-between" p={2}>
        <Box flex={3}>
          <iframe
            src="https://public.tableau.com/app/profile/aditya.chaudhari7770/viz/UnderConstructionProperties/Sheet1?publish=yes"
            width="100%"
            height="600"
            style={{ border: 'none' }}
          />
        </Box>
        <Box flex={1} pl={2}>
          <PredictPriceForm />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default PredictPricePage;
