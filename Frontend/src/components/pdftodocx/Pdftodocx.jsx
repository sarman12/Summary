import React, { useState } from 'react';
import axios from 'axios';
import './Pdftodocx.css';
// Import environment variables for API keys
import ConvertAPI from 'convertapi';

function Pdftodocx() {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(''); // Clear any previous error
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleConvertPdfToDocx = async () => {
    if (!pdfFile) {
      setError('No PDF file selected.');
      return;
    }
    setLoading(true);
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post(
        'https://v2.convertapi.com/convert/pdf/to/docx',
        formData,
        {
          headers: {
            'x-api-key': 
            "182423189", // Use environment variable
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Validate response and URL
      if (response.data && response.data.url) {
        setDownloadUrl(response.data.url);
      } else {
        throw new Error('Conversion failed, no URL found in response.');
      }
    } catch (error) {
      setError('Failed to convert PDF to DOCX: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarize-container">
      <header className="summarize-header">
        <h2>Convert PDF to DOCX</h2>
        <p>Upload your PDF file and convert it to a DOCX format effortlessly!</p>

        <div className="summerize-hero-banner">
          <div className="summerize-drag_drop">
            <input
              type="file"
              className="file-input"
              accept="application/pdf"
              onChange={handlePdfUpload}
              aria-label="Upload PDF file"
            />
            {loading && <div className="loading"><p>Converting...</p></div>}
            {error && <p className="error-message">{error}</p>}
            {!loading && (
              <button className="glow-on-hover" onClick={handleConvertPdfToDocx} disabled={loading}>
                Convert to DOCX
              </button>
            )}
          </div>
        </div>
      </header>

      {downloadUrl && (
        <a href={downloadUrl} className="glow-on-hover" download>
          Download DOCX
        </a>
      )}

      <footer className="summarize-footer">
        <p>© 2024 PDF Converter. All rights reserved.</p>
        <a href="#" className="footer-link">Privacy Policy</a>
      </footer>
    </div>
  );
}

export default Pdftodocx;
