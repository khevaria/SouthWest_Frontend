import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Slider, TextField, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Mascot from '../components/Mascot';
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

// Highlighted icon for the markers (using the provided custom icon and increased size)
const highlightedIcon = new L.Icon({
  iconUrl: '/highlighted-icon.png', // Make sure this path is correct
  iconSize: [35, 56], // Increased size
  iconAnchor: [17, 56],
  popupAnchor: [1, -34]
});

const areas = ["Southend Halifax", "Central Halifax", "Clayton Park", "Rockingham", "Larry Uteck"];

const MapCenterZoom = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

function HomePage({ isAdmin }) {
  const navigate = useNavigate();
  const markerRefs = useRef({});  // Using a ref to store references to markers

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
  const [highlightedProperties, setHighlightedProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([44.651070, -63.582687]);
  const [mapZoom, setMapZoom] = useState(12);

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

  const handleMarkerClick = (clickedProperty) => {
    const southwestProperties = filteredData.filter(property =>
      property.Builder.toLowerCase() === "southwest properties" &&
      property.area === clickedProperty.area &&
      property.id !== clickedProperty.id
    );

    // Calculate distances and sort
    southwestProperties.sort((a, b) => {
      const distanceA = Math.sqrt(
        Math.pow(a.Latitude - clickedProperty.Latitude, 2) +
        Math.pow(a.Longitude - clickedProperty.Longitude, 2)
      );
      const distanceB = Math.sqrt(
        Math.pow(b.Latitude - clickedProperty.Latitude, 2) +
        Math.pow(b.Longitude - clickedProperty.Longitude, 2)
      );
      return distanceA - distanceB;
    });

    // Highlight the top 3 properties
    setHighlightedProperties(southwestProperties.slice(0, 3));
    setMapCenter([clickedProperty.Latitude, clickedProperty.Longitude]);
    setMapZoom(14); // Zoom in when a marker is clicked
  };

  const handlePopupClose = () => {
    setMapZoom(13); // Zoom out when the popup is closed
  };

  const handlePropertyClickFromMascot = (property) => {
    setMapCenter([property.Latitude, property.Longitude]);
    setMapZoom(14);
    if (markerRefs.current[property.id]) {
      markerRefs.current[property.id].openPopup();  // Open the popup programmatically
    }
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
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
            <MapCenterZoom center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredData.map(property => {
              const isHighlighted = highlightedProperties.some(highlightedProperty => highlightedProperty.id === property.id);
              return (
                <Marker
                  key={property.id}
                  position={[property.Latitude, property.Longitude]}
                  icon={isHighlighted ? highlightedIcon : customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(property)
                  }}
                  className={isHighlighted ? 'highlighted-marker' : ''}
                  ref={(el) => {
                    if (el) {
                      markerRefs.current[property.id] = el;
                    }
                  }}
                >
                  <Popup eventHandlers={{ remove: handlePopupClose }}>
                    <div>
                      <h2>{`Property ID: ${property.id}`}</h2>
                      <p>{`Price: ${property.Price} CAD`}</p>
                      <p>{`Rooms: ${property.Rooms}`}</p>
                      <p>{`Bathrooms: ${property.Number_of_Bathrooms}`}</p>
                      <p>{`Area: ${property.area}`}</p>
                      <p>{`Builder: ${property.Builder}`}</p>
                      {isHighlighted && <p style={{ color: '#8B0000', fontWeight: 'bold' }}>{`Highlighted Property`}</p>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
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
      <Mascot
        highlightedProperties={highlightedProperties}
        onPropertyClick={handlePropertyClickFromMascot}
      />
    </Box>
  );
}

export default HomePage;
