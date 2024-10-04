import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import './Summarize.css';

function Summarize({ file }) { // Accept file as a prop
  const [extractedText, setExtractedText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [device, setDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    // If the file prop is passed, process the PDF immediately
    if (file) {
      setDevice(true);
      handleExtractText(file);
    }
  }, [file]);

  const handlePdfUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setExtractedText('');
      setTypedText('');
      setError('');
      handleExtractText(uploadedFile); // Automatically extract text on valid upload
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const extractText = async (url) => {
    setLoading(true);
    setError('');

    try {
      const pdf = await pdfjsLib.getDocument({ url }).promise;
      let text = '';
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        let pageText = content.items.map(item => item.str).join(' ');

        pageText = pageText.replace(/\b\w+\.jpe?g\b/gi, '');
        pageText = pageText.replace(/[^a-zA-Z0-9\s\-+*/%=().,]/g, '');

        pageText = formatText(pageText);
        text += pageText + '\n';
      }

      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text: ', error);
      setError('Failed to extract text. Please check if the PDF is valid and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\s{2,}/g, '\n')
      .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n')
      .trim();
  };

  const handleExtractText = (pdfFile) => {
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

  useEffect(() => {
    if (extractedText) {
      let currentText = '';
      let index = 0;
      const typingSpeed = 30;
      const typingInterval = setInterval(() => {
        currentText += extractedText[index];
        setTypedText(currentText);
        index++;
        if (index >= extractedText.length) {
          clearInterval(typingInterval);
        }
      }, typingSpeed);
      return () => clearInterval(typingInterval);
    }
  }, [extractedText]);

  const handleSaveTextAsFile = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'extracted_text.txt';
    link.click();
  };

  const handleClearText = () => {
    setExtractedText('');
    setTypedText('');
    setDevice(false);
  };

  return (
    <div className="summarize-container">
      <header className="summarize-header">
        <h2>Effortlessly Convert Your PDFs to Text</h2>
        <p>Upload your PDF and get a concise summary using cutting-edge AI technology.</p>

        <div className="summerize-hero-banner">
          

          {loading && <div className="loading"><p>Extracting...</p></div>}
          {error && <p className="error-message">{error}</p>}

          {!loading && extractedText && (
            <section className="extracted-text-section">
              <h3>Extracted Text:</h3>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {typedText}
              </pre>
            </section>
          )}

          {!loading && !extractedText ? (
            <button className="glow-on-hover" onClick={() => handleExtractText(pdfFile)} disabled={loading}>
              Extract Text
            </button>
          ) : (
            !loading && (
              <div style={{ display: 'flex', gap: '10px', margin: 'auto', justifyContent: 'center', marginTop: '20px' }}>
                <button className='btn' onClick={handleSaveTextAsFile} disabled={loading} type="button">
                  Download
                </button>
              </div>
            )
          )}
        </div>
      </header>

    </div>
  );
}

export default Summarize;
