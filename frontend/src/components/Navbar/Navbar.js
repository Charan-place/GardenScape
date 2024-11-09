import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected to named import
import './Navbar.css';

function Navbar({ onLogout }) { 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = null;

  // Decode token if it exists
  if (token) {
    const decodedToken = jwtDecode(token); 
    userRole = decodedToken.role; // Extract the role from the token
  }

  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); 
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav className="navbar">
      <h2>Gardening App</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/packages">Packages</Link>
        </li>

        {/* Show "Add Services" and "Review Orders" only for Admins */}
        {isAuthenticated && userRole === 'admin' && (
          <>
            <li>
              <Link to="/add-service">Add Services</Link>
            </li>
            <li>
              <Link to="/review-orders">Review Orders</Link>
            </li>
          </>
        )}

        {/* Show "My Orders" for authenticated non-admin users */}
        {isAuthenticated && userRole !== 'admin' && (
          <li>
            <Link to="/my-orders">My Orders</Link>
          </li>
        )}

        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
