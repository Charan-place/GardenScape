import React, { useState } from 'react';
import './ServiceCard.css'; // Add your CSS for styling
import BookService from './BookService'; // Import your BookService component

function ServiceCard({ service }) {
  const [isBooking, setIsBooking] = useState(false); // State to manage booking form visibility

  const handleBookService = () => {
    setIsBooking(true); // Show the booking form when the button is clicked
  };

  const handleCloseBookingForm = () => {
    setIsBooking(false); // Hide the booking form when closed
  };

  return (
    <div className="service-card">
      <img 
        src={`http://localhost:5000/uploads/${service.image}`} 
        alt={service.serviceName} 
        className="service-image" // Optional: Add a CSS class for styling
      />
      <h3>{service.serviceName}</h3>
      <p>Action 1: {service.actionOne}</p>
      <p>Action 2: {service.actionTwo}</p>
      <p>Cost: ${service.cost}</p>
      <button onClick={handleBookService}>Book Service</button> {/* Button to trigger booking form */}
      {isBooking && (
        <div className="booking-overlay">
          <BookService serviceId={service._id} onClose={handleCloseBookingForm} /> {/* Pass a close handler */}
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
