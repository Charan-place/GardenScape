import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrders.css'; // Import CSS file for styling

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await axios.get('http://localhost:5000/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is sent with the request
          },
        });

        // Filter to include only pending and accepted orders
        const filteredOrders = response.data.filter(order => 
          order.status === 'Pending' || order.status === 'Accepted'
        );

        const formattedOrders = filteredOrders.map(order => ({
          serviceName: order.serviceName || 'Unknown Service',
          area: order.area || 'N/A', // Assuming 'area' is part of your order schema
          specialRequests: order.specialRequests || 'None', // Assuming 'specialRequests' is part of your order schema
          actionOne: order.actionOne,
          actionTwo: order.actionTwo,
          cost: order.cost,
          status: order.status || 'Pending',
          createdAt: new Date(order.createdAt).toLocaleString(),
        }));

        console.log('Fetched orders:', formattedOrders); // Debugging log

        setOrders(formattedOrders); // Set the orders in state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders(); // Fetch the orders when the component mounts
  }, []); // Empty dependency array means this will run once on component mount

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div className={`order-card ${order.status === 'Accepted' ? 'status-accepted' : order.status === 'Pending' ? 'status-invalid' : ''}`}>
                <h3>Service: {order.serviceName}</h3>
                <p>Area: {order.area} sq ft</p>
                <p>Special Requests: {order.specialRequests}</p>
                <p>Name Of the Service: {order.actionOne}</p>
                <p>Description: {order.actionTwo}</p>
                <p>Cost: ${order.cost}</p>
                <p>Status: {order.status}</p>
                <p>Date: {order.createdAt}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
