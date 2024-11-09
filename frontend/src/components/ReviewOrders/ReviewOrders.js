import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewOrders.css'; // Import the CSS file for styling

function ReviewOrders() {
  const [orders, setOrders] = useState([]);

  // Define fetchOrders function
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    console.log('Current Token:', token); // Log the current token

    try {
      const response = await axios.get('http://localhost:5000/review-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched orders:', response.data); // Log the fetched orders
      setOrders(response.data);
    } catch (error) {
      alert('Error fetching orders: ' + error.message);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call fetchOrders on component mount
  }, []);

  const handleAcceptOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/accept-order/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Order accepted successfully');
      fetchOrders(); // Refetch orders after accepting
    } catch (error) {
      alert('Error accepting order: ' + error.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/reject-order/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Order rejected successfully');
      fetchOrders(); // Refetch orders after rejecting
    } catch (error) {
      alert('Error rejecting order: ' + error.message);
    }
  };

  // Filter orders to display only those with pending status
  const filteredOrders = orders.filter(order => order.status === 'Pending');

  return (
    <div className="review-orders-container">
      <h2>Review Orders</h2>
      {filteredOrders.length === 0 ? (
        <p>No pending orders to review.</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <h4>Order ID: {order._id}</h4>
            <p>Customer: {order.userId.username}</p> {/* Assuming userId holds user info */}
            <p>Phone Number:{order.phoneNumber}</p>
            <p>Service Name: {order.serviceName || 'Unknown Service'}</p> {/* Display service name */}
            <p>Area: {order.area || 'N/A'} sq ft</p> {/* Display area */}
            <p>Special Requests: {order.specialRequests || 'None'}</p> {/* Display special requests */}
            <div className="button-container">
              <button className="accept-button" onClick={() => handleAcceptOrder(order._id)}>Accept Order</button>
              <button className="reject-button" onClick={() => handleRejectOrder(order._id)}>Reject Order</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewOrders;
