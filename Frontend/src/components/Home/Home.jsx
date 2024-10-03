import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Video from '../../assets/video1.mp4';

function Home() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [device, setDevice] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]); // Store the uploaded file
      setFileUploaded(true);
    } else {
      setFileUploaded(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { file } }); // Pass the file as state to the next route
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="home-nav">
          <h1 className="home-logo">PDF Summarizer</h1>
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
          <div>Google Drive</div>
          <p>or drag and drop here</p>
        </div>
        
        {fileUploaded && (
          <div className="banner-options">
            <div className="banner-content">
              <div className="banner-item">
                <h3>PDF to Text</h3>
                <p>Extract text from your PDF files effortlessly.</p>
                <button className="glow-on-hover" onClick={() => handleNavigation('/pdf-to-text')}>
                  Convert Now
                </button>
              </div>

              <div className="banner-item">
                <h3>PDF to JPG</h3>
                <p>Convert your PDF documents into high-quality images.</p>
                <button className="glow-on-hover" onClick={() => handleNavigation('/pdf-to-jpg')}>
                  Convert Now
                </button>
              </div>

              <div className="banner-item">
                <h3>PDF to DOCX</h3>
                <p>Turn your PDF files into editable Word documents.</p>
                <button className="glow-on-hover" onClick={() => handleNavigation('/pdf-to-docx')}>
                  Convert Now
                </button>
              </div>

              <div className="banner-item">
                <h3>Ask AI About PDF</h3>
                <p>Get quick answers to questions related to your PDFs using AI.</p>
                <button className="glow-on-hover" onClick={() => handleNavigation('/ask-ai')}>
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>Follow these simple steps to make the most out of our PDF summarizer:</p>
        <div className="steps">
          <div className="step-item">Upload your PDF file using the input above.</div>
          <div className="step-item">Choose from the available tools based on your needs.</div>
          <div className="step-item">Click on the corresponding button to start the conversion.</div>
          <div className="step-item">Download the output file or get the summarized content.</div>
        </div>

        <div className="video-section">
          <h3>Watch Our Tutorial</h3>
          <video src={Video} autoPlay loop muted playsInline className="tutorial-video" />
        </div>
      </section>

      <main className="home-content">
        <section className="features">
          <h2>Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Quick Summarization</h3>
              <p>Instantly generate summaries for your PDF documents.</p>
            </div>
            <div className="feature-item">
              <h3>AI-Powered</h3>
              <p>Leverage the power of AI to get accurate and concise summaries.</p>
            </div>
            <div className="feature-item">
              <h3>Easy to Use</h3>
              <p>Simple and intuitive interface for a seamless experience.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2024 PDF Summarizer. All rights reserved.</p>
        <p><Link to="/summarize" className="footer-link">Start Summarizing</Link></p>
      </footer>
    </div>
  );
}

export default Home;
