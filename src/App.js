import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import PredictPricePage from './pages/PredictPricePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';

const theme = createTheme();

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin") {
      setIsAdmin(true);
      setModalOpen(false);
    } else {
      alert("Incorrect username or password!");
      setIsAdmin(false);
      setModalOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar onAdminLoginClick={() => setModalOpen(true)} isAdmin={isAdmin} />
        <AdminLoginModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          handleLogin={handleLogin}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/predict-price" element={<PredictPricePage />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate replace to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
