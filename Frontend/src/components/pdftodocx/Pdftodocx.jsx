import React, { useState } from 'react';
import axios from 'axios';
import './Pdftodocx.css';

function Pdftodocx() {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleConvertPdfToDocx = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post(
        'https://api.pdf.co/v1/pdf/convert/to/docx',
        formData,
        {
          headers: {
            'x-api-key': 'YOUR_API_KEY_HERE', // Replace with your API key
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setDownloadUrl(response.data.url);
      setLoading(false);
    } catch (error) {
      setError('Failed to convert PDF to DOCX.');
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
            {loading && <div className="loading"><p></p></div>}

            {error && <p className="error-message">{error}</p>}
            {!loading && (
              <div
                onClick={handleConvertPdfToDocx}
                className="convert-button glow-on-hover"
              >
                Convert to DOCX
              </div>
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
