import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Video from '../../assets/video1.mp4'

function Home() {
  

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
      
          <div className="banner-options">
            <div className="banner-content">

              

              <div className="banner-item">
                <h3>PDF to Text</h3>
                <p>Extract text from your PDF files effortlessly.</p>
                <button className="glow-on-hover">
                  <Link to="/pdf-to-text" style={{ textDecoration: 'none', color: 'white' }}>Convert Now</Link>
                </button>
              </div>

              <div className="banner-item">
                <h3>PDF to JPG</h3>
                <p>Convert your PDF documents into high-quality images.</p>
                <button className="glow-on-hover">
                  <Link to="/pdf-to-jpg" style={{ textDecoration: 'none', color: 'white' }}>Convert Now</Link>
                </button>
              </div>
              <div className="banner-item">
                <h3>PDF to DOCX</h3>
                <p>Turn your PDF files into editable Word documents.</p>
                <button className="glow-on-hover">
                  <Link to="/pdf-to-docx" style={{ textDecoration: 'none', color: 'white' }}>Convert Now</Link>
                </button>
              </div>
              <div className="banner-item">
                <h3>Ask AI About PDF</h3>
                <p>Get quick answers to questions related to your PDFs using AI.</p>
                <button className="glow-on-hover">
                  <Link to="/ask-ai" style={{ textDecoration: 'none', color: 'white' }}>Ask AI</Link>
                </button>
              </div>
            </div>

            <div className='video-section'>
                <div >
                  <video src={Video} autoPlay loop muted playsInline height="auto" />
                </div>
                <h2 style={{color:'rgb(200, 300, 300)', fontSize:'2rem', fontWeight:'bold', textAlign:'center', marginTop:'1rem'}}>Preview</h2>
              </div>

            

          </div>
          

        

            {/* <button className="glow-on-hover" onClick={handleClearFile}>Clear File</button> */}
          
      </div>

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
