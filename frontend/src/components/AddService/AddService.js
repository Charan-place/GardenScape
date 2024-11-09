import React, { useState } from 'react';
import axios from 'axios';
import './AddService.css';

function AddService() {
  const [serviceName, setServiceName] = useState('');
  const [actionOne, setActionOne] = useState('');
  const [actionTwo, setActionTwo] = useState('');
  const [image, setImage] = useState(null);
  const [cost, setCost] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('serviceName', serviceName);
    formData.append('actionOne', actionOne);
    formData.append('actionTwo', actionTwo);
    formData.append('image', image);
    formData.append('cost', cost);

    const token = localStorage.getItem('token'); // Get token from localStorage

    try {
      const response = await axios.post('http://localhost:5000/add-service', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
      setMessage('Service added successfully!');
    } catch (error) {
      console.error(error); // Log the error for debugging
      setMessage('Error adding service. Please try again.');
    }
  };

  return (
    <div className="add-services-container">
      <h2>Add New Service</h2>
      <form onSubmit={handleSubmit} className="add-service-form">
        <div className="form-group">
          <label>Service Name:</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Action 1:</label>
          <input
            type="text"
            value={actionOne}
            onChange={(e) => setActionOne(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Action 2:</label>
          <input
            type="text"
            value={actionTwo}
            onChange={(e) => setActionTwo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Service Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label>Cost:</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add Service
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddService;
