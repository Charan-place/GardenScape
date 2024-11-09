// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function BookService({ serviceId }) {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [area, setArea] = useState('');
//   const [specialRequests, setSpecialRequests] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false); // New loading state

//   useEffect(() => {
//     const userEmail = localStorage.getItem('userEmail');
//     if (userEmail) {
//       setEmail(userEmail);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');

//     if (!phoneNumber || !area) {
//       setMessage('Please fill in all required fields.');
//       return;
//     }

//     setLoading(true); // Start loading state
//     setMessage(''); // Clear previous messages

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/request-service',
//         {
//           serviceId,
//           phoneNumber,
//           email,
//           area,
//           specialRequests,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include token in headers
//           },
//         }
//       );

//       setMessage('Service booked successfully!');
//       setPhoneNumber('');
//       setArea('');
//       setSpecialRequests('');
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.status === 403) {
//         setMessage('You are not authorized. Please log in again.');
//       } else {
//         setMessage('Error booking service. Please try again.');
//       }
//     } finally {
//       setLoading(false); // End loading state
//     }
//   };

//   return (
//     <div className="book-service-container">
//       <h2>Book Service</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Phone Number:</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Email:</label>
//           <input type="email" value={email} readOnly />
//         </div>

//         <div>
//           <label>Area (in sq feet):</label>
//           <input
//             type="number"
//             value={area}
//             onChange={(e) => setArea(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Special Requests:</label>
//           <textarea
//             value={specialRequests}
//             onChange={(e) => setSpecialRequests(e.target.value)}
//           />
//         </div>

//         {/* Show loading spinner when submitting */}
//         {loading && <div className="loading-spinner"></div>}
        
//         <button type="submit" disabled={loading}> {/* Disable button during loading */}
//           {loading ? 'Booking...' : 'Book Service'}
//         </button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default BookService;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';

function BookService({ serviceId }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate(); // Hook to handle redirection

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login page
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [navigate]); // Add navigate as a dependency

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!phoneNumber || !area) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true); // Start loading state
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post(
        'http://localhost:5000/request-service',
        {
          serviceId,
          phoneNumber,
          email,
          area,
          specialRequests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      setMessage('Service booked successfully!');
      setPhoneNumber('');
      setArea('');
      setSpecialRequests('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        setMessage('You are not authorized. Please log in again.');
        localStorage.removeItem('token'); // Remove invalid token
        navigate('/login'); // Redirect to login page
      } else {
        setMessage('Error booking service. Please try again.');
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="book-service-container">
      <h2>Book Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly />
        </div>

        <div>
          <label>Area (in sq feet):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Special Requests:</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>

        {/* Show loading spinner when submitting */}
        {loading && <div className="loading-spinner"></div>}
        
        <button type="submit" disabled={loading}> {/* Disable button during loading */}
          {loading ? 'Booking...' : 'Book Service'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookService;
