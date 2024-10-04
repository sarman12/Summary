import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
import './Pdftojpg.css';

function Pdftojpg({ file }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!file) {
      navigate('/dashboard');
    } else {
      handleConvertPdfToJpg();
    }
  }, [file, navigate]);

  const handleConvertPdfToJpg = async () => {
    if (!file) return;

    setLoading(true);
    setImages([]);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

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
    <div className="pdf-to-jpg-container">
      <header className="pdf-header">
        <h2 className="pdf-title">Convert Your PDFs to JPG</h2>

        <div className="pdf-hero-banner">
          {loading && <div className="loading-indicator"><p></p></div>}
          {error && <p className="error-message">{error}</p>}

          {!loading && images.length > 0 && (
            <section className="image-conversion-section">
              <h3 className="converted-title">Converted JPGs:</h3>
              <div className="image-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Page ${index + 1}`} className="converted-image" />
                    <button className="download-button glow-on-hover" onClick={() => handleDownloadImage(image, index)}>
                      Download JPG
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </header>
    </div>
  );
}

export default Pdftojpg;
