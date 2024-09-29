import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import './Askpdf.css'; // Ensure this file exists for styling
import run from '../config/gemini'; // Adjust the path as needed

function Askpdf() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [input, setInput] = useState(''); // Store user query
  const [device, setDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState(''); // Store AI response

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  }, []);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText('');
      setError('');
      handleExtractText(file); // Automatically extract text after upload
    } else {
      alert('Please upload a valid PDF file.');
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

  const handleExtractText = (file) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = function () {
      const result = fr.result;
      extractText(result);
    };
  };

  const handleSend = async () => {
    if (input.trim() === '') {
      alert('Please enter a question to ask.');
      return;
    }
    setLoading(true);
    try {
      const aiResult = await run(input); // Send user input to the AI
      setAiResponse(aiResult); // Update AI response state
    } catch (error) {
      console.error('Error getting AI response: ', error);
      setError('Failed to get response from AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarize-container">
      <header className="summarize-header">
        <h2>Effortlessly Convert Your PDFs to Text</h2>
        <p>Upload your PDF and get a concise summary using cutting-edge technology.</p>

        <div className="summerize-hero-banner">
          <div className="summerize-drag_drop">
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

          {pdfFile && (
            <div className="chat">
              <div className="chat-container">
                <textarea value={extractedText} cols="90" rows="20" readOnly></textarea>
                <div className="input-div">
                  <input
                    type="text"
                    placeholder="Ask AI"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button className="glow-on-hover" onClick={handleSend} disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {pdfFile && (
            <button className="glow-on-hover" onClick={() => setPdfFile(null)}>
              Clear PDF
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        {aiResponse && <p className="ai-response">{aiResponse}</p>}
      </header>

      <footer className="summarize-footer">
        <p>© 2024 PDF Summarizer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Askpdf;
