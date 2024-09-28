import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Successfully logged in");
        navigate('/summarize'); // Redirect to the summarize page
      } else {
        setError(response.data.error); // Update with specific error message
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-content">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Optional: Add required attribute
              />
            </div>
            <div className="btns">
              <button className="btn" type="submit">
                Login
              </button>
              <button className="btn" type="button" onClick={handleRegisterClick}>
                Register
              </button>
            </div>
          </form>
          <div className="social-login">
            <p>Or login with:</p>
            <FaGoogle size={30} />
            <FaFacebook size={30} />
            <FaTwitter size={30} />
          </div>
        </div>
        <div className="form-image"></div>
      </div>
    </div>
  );
}

export default Login;
