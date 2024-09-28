import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login/Login.css';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send a POST request to the backend /register endpoint
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });

      // Handle successful registration
      if (response.status === 201) {
        console.log("Registered successfully");
        navigate('/login'); // Redirect to login page
      } else {
        setError(response.data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-content">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="btns">
              <button type="submit" className="btn">
                Register
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="form-image"></div>
      </div>
    </div>
  );
}

export default Register;
