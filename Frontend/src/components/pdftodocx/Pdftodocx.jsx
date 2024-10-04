import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pdftodocx.css';

function Pdftodocx({ file }) { // Accept file as a prop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    // Trigger conversion if file is passed as a prop
    if (file) {
      handleConvertPdfToDocx(file);
    }
  }, [file]); // Dependency on file prop

  const handleConvertPdfToDocx = async (pdfFile) => {
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
            'x-api-key': "182423189", // Use your actual API key here
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
        <p>Converting your PDF file to DOCX format...</p>

        <div className="summerize-hero-banner">
          {loading && <div className="loading"><p>Converting...</p></div>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </header>

      {downloadUrl && (
        <a href={downloadUrl} className="glow-on-hover" download>
          Download DOCX
        </a>
      )}

    </div>
  );
}

export default Pdftodocx;
