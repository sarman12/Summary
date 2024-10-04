import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Video from '../../assets/video1.mp4';

function Home() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [device, setDevice] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setLoggedIn(true);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileUploaded(true);
    } else {
      setFileUploaded(false);
    }
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/pdf-to-text');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <h1 className="home-logo">PDF Tools</h1>
          <div className="home-nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        </nav>
      </header>

      <div className="hero-banner">
        <h2>Effortlessly Work with Your PDFs</h2>
        <p>Choose from a variety of tools to handle your PDF files quickly and easily.</p>
        <div className="summerize-drag_drop">
          {device ? (
            <input
              type="file"
              className="file-input"
              accept="application/pdf"
              onChange={handleFileChange}
              aria-label="Upload PDF file"
            />
          ) : (
            <div className="select-device" onClick={() => setDevice(true)} aria-label="Select PDF file from device">
              Select from Device
            </div>
          )}
          <p>or drag and drop here</p>
        </div>

        {fileUploaded && (
          <button className="get-started-button" onClick={handleGetStarted}>
            Get Started
          </button>
        )}
      </div>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-item">1. Upload your PDF file.</div>
          <div className="step-item">2. Choose your tool.</div>
          <div className="step-item">3. Click "Get Started".</div>
          <div className="step-item">4. Download your results.</div>
        </div>

        <div className="video-section">
          <h3>Watch Our Tutorial</h3>
          <video src={Video} autoPlay loop muted playsInline className="tutorial-video" />
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2024 PDF Tools. All rights reserved.</p>
        <p><Link to="/summarize" className="footer-link">Start Summarizing</Link></p>
      </footer>
    </div>
  );
}

export default Home;
