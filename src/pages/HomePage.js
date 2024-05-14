import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({ isAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {/* Other content */}
    </div>
  );
}

export default HomePage;
