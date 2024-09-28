import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist/build/pdf'; // Import PDF.js for processing PDFs
import 'pdfjs-dist/build/pdf.worker.entry'; // Import PDF.js worker for multi-threading
import './Pdftojpg.css'
function Pdftojpg() {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(null);
  const [device, setDevice] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');        
  const [images, setImages] = useState([]); 
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleConvertPdfToJpg = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setImages([]);

    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfFile);

    reader.onload = async function () {
      const pdfData = new Uint8Array(reader.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const totalPages = pdf.numPages;

        const newImages = [];
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 }); 
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const imageUrl = canvas.toDataURL('image/jpeg');
          newImages.push(imageUrl);
        }

        setImages(newImages);
        setLoading(false);
      } catch (error) {
        setError('Failed to convert PDF to JPG.');
        setLoading(false);
      }
    };
  };

  const handleDownloadImage = (image, index) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `page-${index + 1}.jpg`;
    link.click();
  };

  return (
    <div className="summarize-container">
      <header className="summarize-header">
        <h2>Convert Your PDFs to JPG</h2>

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

          {loading && <div className="loading"><p></p></div>}
          {error && <p className="error-message">{error}</p>}

          {!loading && pdfFile && !images.length && (
            <button className="glow-on-hover" onClick={handleConvertPdfToJpg} disabled={loading}>
              Convert to JPG
            </button>
          )}

          {!loading && images.length > 0 && (
            <section className="extracted-images-section">
              <h3>Converted JPGs:</h3>
              <div className="image-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Page ${index + 1}`} />
                    <button style={{width:'200px'}} className='glow-on-hover' onClick={() => handleDownloadImage(image, index)}>Download JPG</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pdfFile && images.length > 0 && (
            <button className="glow-on-hover" onClick={() => setImages([])}>
              Clear Images
            </button>
          )}
        </div>
      </header>

      <footer className="summarize-footer">
        <p>© 2024 PDF to JPG Converter. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Pdftojpg;
