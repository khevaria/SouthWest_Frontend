import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, FormGroup, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function PredictPriceForm() {
  const [formData, setFormData] = useState({
    rooms: '',
    bathrooms: '',
    denIncluded: false,
    parkingIncluded: false,
    heatIncluded: false,
    electricityIncluded: false,
    dogsAllowed: false,
    catsAllowed: false,
    address: '',
    postalCode: '',
    dateInFuture: '',
    size: ''
  });

  const [touched, setTouched] = useState({
    rooms: false,
    bathrooms: false,
    address: false,
    postalCode: false,
    dateInFuture: false,
    size: false
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(updatedFormData);
    setTouched({
      ...touched,
      [name]: true
    });

    validateForm(updatedFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you would typically send formData to the backend and receive the predicted price.
    // For design purposes, we'll mock this with a static value.
    setPredictedPrice('1500 CAD');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateField = (name, value) => {
    if (name === 'postalCode') {
      const canadaPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
      return canadaPostalRegex.test(value);
    }
    if (name === 'dateInFuture') {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }
    if (name === 'rooms') {
      return Number(value) > 0 && Number.isInteger(Number(value));
    }
    if (name === 'bathrooms') {
      return Number(value) > 0 && (Number(value) * 2) % 1 === 0;
    }
    if (name === 'size') {
      return !isNaN(value) && Number(value) > 0;
    }
    return true;
  };

  const validateForm = (data) => {
    const isValid = Object.keys(data).every(key => {
      return key in touched ? validateField(key, data[key]) : true;
    });
    setIsFormValid(isValid);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Number of Rooms"
            name="rooms"
            type="number"
            value={formData.rooms}
            onChange={handleChange}
            error={touched.rooms && !validateField('rooms', formData.rooms)}
            helperText={touched.rooms && !validateField('rooms', formData.rooms) ? "Number of rooms must be a positive integer" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Number of Bathrooms"
            name="bathrooms"
            type="number"
            step="0.5"
            value={formData.bathrooms}
            onChange={handleChange}
            error={touched.bathrooms && !validateField('bathrooms', formData.bathrooms)}
            helperText={touched.bathrooms && !validateField('bathrooms', formData.bathrooms) ? "Number of bathrooms must be in increments of 0.5" : ""}
          />
        </Grid>
      </Grid>
      <FormGroup row>
        <FormControlLabel control={<Checkbox checked={formData.denIncluded} onChange={handleChange} name="denIncluded" />} label="Den Included" />
        <FormControlLabel control={<Checkbox checked={formData.parkingIncluded} onChange={handleChange} name="parkingIncluded" />} label="Parking Included" />
        <FormControlLabel control={<Checkbox checked={formData.heatIncluded} onChange={handleChange} name="heatIncluded" />} label="Heat Included" />
        <FormControlLabel control={<Checkbox checked={formData.electricityIncluded} onChange={handleChange} name="electricityIncluded" />} label="Electricity Included" />
        <FormControlLabel control={<Checkbox checked={formData.dogsAllowed} onChange={handleChange} name="dogsAllowed" />} label="Dogs Allowed" />
        <FormControlLabel control={<Checkbox checked={formData.catsAllowed} onChange={handleChange} name="catsAllowed" />} label="Cats Allowed" />
      </FormGroup>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        inputProps={{ maxLength: 100 }}
        error={touched.address && !validateField('address', formData.address)}
        helperText={touched.address && !validateField('address', formData.address) ? "Address can be up to 100 characters long" : ""}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Postal Code"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        error={touched.postalCode && !validateField('postalCode', formData.postalCode)}
        helperText={touched.postalCode && !validateField('postalCode', formData.postalCode) ? "Invalid Canadian postal code" : ""}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Date in Future"
        name="dateInFuture"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.dateInFuture}
        onChange={handleChange}
        error={touched.dateInFuture && !validateField('dateInFuture', formData.dateInFuture)}
        helperText={touched.dateInFuture && !validateField('dateInFuture', formData.dateInFuture) ? "Date must be in the future" : ""}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Size in Square Feet"
        name="size"
        type="number"
        value={formData.size}
        onChange={handleChange}
        error={touched.size && !validateField('size', formData.size)}
        helperText={touched.size && !validateField('size', formData.size) ? "Size must be a positive number" : ""}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isFormValid}
      >
        Predict Price
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Predicted Price
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5">The predicted price is 1500 CAD</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PredictPriceForm;
