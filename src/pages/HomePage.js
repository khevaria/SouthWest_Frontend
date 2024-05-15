import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Slider, TextField, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import data from '../data/updated_test_data_with_builder.json';

// Custom icon for the markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const areas = ["Southend Halifax", "Central Halifax", "Clayton Park", "Rockingham", "Larry Uteck"];

function HomePage({ isAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    price: [0, 5000],
    rooms: '',
    bathrooms: '',
    area: ''
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSliderChange = (event, newValue) => {
    setFilters({
      ...filters,
      price: newValue
    });
  };

  useEffect(() => {
    let filtered = data;

    if (filters.rooms) {
      filtered = filtered.filter(property => property.Rooms === parseInt(filters.rooms));
    }
    
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.Number_of_Bathrooms === parseFloat(filters.bathrooms));
    }
    
    if (filters.area) {
      filtered = filtered.filter(property => property.area === filters.area);
    }
    
    filtered = filtered.filter(property => property.Price >= filters.price[0] && property.Price <= filters.price[1]);

    setFilteredData(filtered);
  }, [filters]);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box display="flex" justifyContent="space-between" p={2} flexGrow={1}>
        <Box flex={3}>
          <MapContainer center={[44.651070, -63.582687]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredData.map(property => (
              <Marker key={property.id} position={[property.Latitude, property.Longitude]} icon={customIcon}>
                <Popup>
                  <div>
                    <h2>{`Property ID: ${property.id}`}</h2>
                    <p>{`Price: ${property.Price} CAD`}</p>
                    <p>{`Rooms: ${property.Rooms}`}</p>
                    <p>{`Bathrooms: ${property.Number_of_Bathrooms}`}</p>
                    <p>{`Area: ${property.area}`}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
        <Box flex={1} pl={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Filters</Typography>
            <FormControl fullWidth>
              <Typography variant="body2">Rent</Typography>
              <Slider
                value={filters.price}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={100}
                marks={[
                  { value: 0, label: '0' },
                  { value: 5000, label: '5000' }
                ]}
                name="price"
                sx={{
                  '& .MuiSlider-thumb': {
                    color: '#1976D2', // Blue color
                  },
                  '& .MuiSlider-track': {
                    color: '#1976D2', // Blue color
                  },
                  '& .MuiSlider-rail': {
                    color: '#D3D3D3',
                  },
                  '& .MuiSlider-markLabel': {
                    color: '#1976D2', // Blue color
                  },
                  marginBottom: '16px' // Add space below the slider to match other inputs
                }}
              />
            </FormControl>
            <TextField
              label="Number of Rooms"
              name="rooms"
              type="number"
              value={filters.rooms}
              onChange={handleFilterChange}
              fullWidth
            />
            <TextField
              label="Number of Bathrooms"
              name="bathrooms"
              type="number"
              step="0.5"
              value={filters.bathrooms}
              onChange={handleFilterChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Area</InputLabel>
              <Select
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
              >
                {areas.map(area => (
                  <MenuItem key={area} value={area}>{area}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
