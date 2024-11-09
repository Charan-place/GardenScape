// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError('');
//     if (!username || !password) {
//       setError('Please enter both username and password.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:5000/login', { username, password });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         navigate('/'); // Redirect to home page after successful login
//       } else {
//         setError('Invalid credentials');
//       }
//     } catch (error) {
//       setError('Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin} disabled={loading}>
//         {loading ? 'Logging in...' : 'Login'}
//       </button>
//       <p>
//         Don't have an account? <a href="/signup">Signup here</a>
//       </p>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setError(''); // Clear previous error messages

    // Check if username and password are provided
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true); // Start loading state
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      // Check if the token is returned in the response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        localStorage.setItem('userEmail', username); // Optional: Store user email if needed
        navigate('/'); // Redirect to home page after successful login
      } else {
        setError('Invalid credentials'); // Set error for invalid credentials
      }
    } catch (error) {
      if (error.response) {
        // Handle errors from the server
        setError(error.response.data || 'Login failed'); // Use server response or default message
      } else {
        // Handle errors not from the server (e.g., network issues)
        setError('Login failed, please try again later.');
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleLogin}> {/* Use form submission */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Signup here</a>
      </p>
    </div>
  );
}

export default Login;
