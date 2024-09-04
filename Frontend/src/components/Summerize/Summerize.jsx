import React, { useState } from 'react';
// import { pdfjs } from 'pdfjs-dist';
import './Summarize.css';
function Summerize() {
  

  return (
    <div className="summarize-container">
      <div className="summarize-content">
        <h2>Summarize PDF</h2>
        <div className="input-group">
          <label htmlFor="pdf-upload">Upload PDF</label>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        <button  className="summarize-btn">
          Summarize
        </button>
        {summary && (
          <div className="summary-output">
            <h3>Summary</h3>
            {/* <p>{summary}</p> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Summerize;
