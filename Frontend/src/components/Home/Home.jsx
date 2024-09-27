import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import './Home.css';

function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [device, setDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  }, []);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText(''); // Clear previous text
      setError(''); // Clear previous errors
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const extractText = async (url) => {
  setLoading(true); // Start loading
  setError(''); // Clear previous errors

  try {
    const pdf = await pdfjsLib.getDocument({ url }).promise;
    let text = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let pageText = content.items.map(item => item.str).join(' ');

      // Add some basic formatting for readability
      pageText = formatText(pageText);
      text += pageText + '\n';
    }

    setExtractedText(text);
  } catch (error) {
    console.error('Error extracting text: ', error);
    setError('Failed to extract text. Please check if the PDF is valid and try again.');
  } finally {
    setLoading(false); // Stop loading
  }
};

// Simple formatter function
const formatText = (text) => {
  // Trim extra spaces and add line breaks at double spaces or periods.
  return text
    .replace(/\s{2,}/g, '\n') // Break paragraphs on two or more spaces
    .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n') // Add line breaks after sentences
    .trim();
};


  const handleExtractText = () => {
    if (!pdfFile) {
      alert('Please upload a PDF file first.');
      return;
    }

    const fr = new FileReader();
    fr.readAsDataURL(pdfFile);
    fr.onload = function () {
      const result = fr.result;
      extractText(result);
    };
  };

  const handleSaveTextAsFile = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'extracted_text.txt';
    link.click();
  };

  const handleClearText = () => {
    setExtractedText('');
    setPdfFile(null);
    setDevice(false);
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
        <div className="hero-banner">
          <h2>Effortlessly Summarize Your PDFs</h2>
          <p>Upload your PDF and get a concise summary using cutting-edge AI technology.</p>

          <div className="drag_drop">
            {device ? (
              <input
                type="file"
                className="file-input"
                accept="application/pdf"
                onChange={handlePdfUpload}
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

          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          {extractedText && 
            <section className="extracted-text-section">
              <h3>Extracted Text:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {extractedText}
              </pre>
              
              <button className='glow-on-hover' onClick={handleClearText} disabled={loading}>
                Clear Text
              </button>
            </section>
            }
            {!extractedText ? (
                    <button className="glow-on-hover" onClick={handleExtractText} disabled={loading}>
                      Extract Text
                    </button>
                  ) : (
                    // <button className='hero-button' onClick={handleSaveTextAsFile} disabled={loading}>
                    //   Download
                    // </button>
                    <button class="glow-on-hover" onClick={handleSaveTextAsFile} disabled={loading} type="button">Download</button>

                  )}

          
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
