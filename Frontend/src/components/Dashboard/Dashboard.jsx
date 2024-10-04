import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import Pdftojpg from '../pdftojpg/Pdftojpg.jsx';
import Pdftodocx from '../pdftodocx/Pdftodocx.jsx';
import Askpdf from '../Askpdf/Askpdf.jsx';
import Summarize from '../Summerize/Summerize.jsx';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [device, setDevice] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentTool, setCurrentTool] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const storedUserName = localStorage.getItem('username') || 'Guest';
    setUserName(storedUserName);

    const savedHistory = JSON.parse(localStorage.getItem('uploadedHistory')) || [];
    setUploadedHistory(savedHistory);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUploaded(true);
      saveToHistory(selectedFile.name);
    } else {
      setFileUploaded(false);
    }
  };

  const selectTool = (tool) => {
    setCurrentTool(tool);
  };

  const saveToHistory = (fileName) => {
    const newHistory = [...uploadedHistory, { fileName, date: new Date().toISOString().split('T')[0] }];
    setUploadedHistory(newHistory);
    localStorage.setItem('uploadedHistory', JSON.stringify(newHistory));
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className={`dashboard ${showProfile ? 'shift-left' : ''}`}>
      <div className="content">
        <section className="head">
          <div className="profile">
            <h2>Welcome to the dashboard {userName}</h2>
            <button onClick={toggleProfile} className="profile-button">
              <BiUser className="fa" />
            </button>
          </div>

          <div className="hero-banner">
            <h2>Upload Your PDF</h2>
            <p>Choose from a variety of tools to handle your PDF files quickly and easily.</p>

            <div className="summerize-drag_drop">
              {device ? (
                <input
                  type="file"
                  className="file-input"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  aria-label="Upload PDF file"
                />
              ) : (
                <div className="select-device" onClick={() => setDevice(true)} aria-label="Select PDF file from device">
                  Select from Device
                </div>
              )}
              <div>Google Drive</div>
            </div>

            {fileUploaded && (
              <div className="banner-options">
                <div className="banner-content">
                  <div className="banner-item">
                    <h3>PDF to Text</h3>
                    <p>Extract text from your PDF files effortlessly.</p>
                    <button className="glow-on-hover" onClick={() => selectTool('pdftotxt')}>Convert Now</button>
                  </div>
                  <div className="banner-item">
                    <h3>PDF to JPG</h3>
                    <p>Convert your PDF documents into high-quality images.</p>
                    <button className="glow-on-hover" onClick={() => selectTool('pdftojpg')}>Convert Now</button>
                  </div>
                  <div className="banner-item">
                    <h3>PDF to DOCX</h3>
                    <p>Convert your PDF documents into editable DOCX files.</p>
                    <button className="glow-on-hover" onClick={() => selectTool('pdftodocx')}>Convert Now</button>
                  </div>
                  <div className="banner-item">
                    <h3>Ask AI About PDF</h3>
                    <p>Ask AI questions about your PDF files and get accurate answers.</p>
                    <button className="glow-on-hover" onClick={() => selectTool('askpdf')}>Ask AI</button>
                  </div>
                </div>
              </div>
            )}

            {fileUploaded && currentTool === 'pdftojpg' && <Pdftojpg file={file} />}
            {fileUploaded && currentTool === 'pdftodocx' && <Pdftodocx file={file} />}
            {fileUploaded && currentTool === 'askpdf' && <Askpdf file={file} />}
            {fileUploaded && currentTool === 'pdftotxt' && <Summarize file={file} />}

          </div>
        </section>

        {showProfile && (
          <div className="profile-section">
            <h2>{userName}'s Profile</h2>
            <h3>Uploaded History:</h3>
            <ul>
              {uploadedHistory.map((file, index) => (
                <li key={index}>
                  {file.fileName} - {file.date}
                </li>
              ))}
            </ul>
            <button onClick={toggleProfile} className="close-profile">Close</button>
            <button onClick={() => navigate('/register')} className="close-profile">Log Out</button>
          </div>
        )}

      </div>

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} PDF Toolset. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
