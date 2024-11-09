import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ServicesDisplay.css';
import BookService from '../BookService/BookService';

function ServicesDisplay() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState(null); // State for selected service ID

  useEffect(() => {    
    setLoading(true);  
    const fetchServices = async () => {
        const token = localStorage.getItem('token');
        console.log('Current Token:', token); // Log token for debugging
      
        try {
          const response = await axios.get('http://localhost:5000/services', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Fetched services:', response.data); // Log the fetched services
          setServices(response.data);
        } catch (error) {
          console.error('Error fetching services:', error); // Log the error
          alert('Error fetching services: ' + error.message);
        }
      };      
      setLoading(false);

    fetchServices();
  }, []); // No dependencies; run on mount

  if (loading) return <p>Loading services...</p>;

  const handleBookService = (serviceId) => {
    setBookingServiceId(serviceId); // Set the selected service ID for booking
  };

  return (
    <div className="services-container">
      {services.map((service) => (
        <div key={service._id} className="service-card">
          <h3>{service.serviceName}</h3>
          <p>{service.actionOne}</p>
          <p>{service.actionTwo}</p>
          <img src={`http://localhost:5000/uploads/${service.image}`} alt={service.serviceName} />
          <p>Cost: ${service.cost}</p>
          <button onClick={() => handleBookService(service._id)}>Book Service</button> {/* Trigger booking */}
          {bookingServiceId === service._id && <BookService serviceId={service._id} />} {/* Conditionally render booking form */}
        </div>
      ))}
    </div>
  );
}

export default ServicesDisplay;
