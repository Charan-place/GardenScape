import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import AddService from './components/AddService/AddService';
import ReviewOrders from './components/ReviewOrders/ReviewOrders';
import ServicesDisplay from './components/ServicesDisplay/ServicesDisplay';
import Home from './components/Home'; // Ensure this is created
import BookService from './components/BookService/BookService'; // Import your new booking component
import MyOrders from './components/MyOrders/MyOrders';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if the user is admin
      const user = JSON.parse(atob(token.split('.')[1])); // Decode token payload
      setIsAdmin(user.role === 'admin'); // Assuming your token contains user role
      setUserEmail(user.email); // Assuming your token contains user email
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    setUserEmail(''); // Clear email on logout
    // Redirect to home or perform other actions
  };

  return (
    <Router>
      <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/review-orders" element={<ReviewOrders />} />
        <Route path="/packages" element={<ServicesDisplay />} />
        {/* New route for booking a service */}
        <Route path="/book-service/:serviceId" element={<BookService userEmail={userEmail} />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
