import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'
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
        <div className="hero-banner">
          <h2>Effortlessly Summarize Your PDFs</h2>
          <p>Upload your PDF and get a concise summary using cutting-edge AI technology.</p>
          <Link to="/summarize" className="hero-button">Get Started</Link>
        </div>
      </header>
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
