import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiUser } from 'react-icons/bi'; // Import BiUser icon
import Pdftojpg from '../pdftojpg/Pdftojpg.jsx';
import Pdftodocx from '../pdftodocx/Pdftodocx.jsx';
import Askpdf from '../Askpdf/Askpdf.jsx';
import Summarize from '../Summerize/Summerize.jsx';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [device, setDevice] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const [pdftojpg, setPdftojpg] = useState(false);
  const [pdftodocx, setPdftodocx] = useState(false);
  const [askpdf, setAskpdf] = useState(false);
  const [pdftotxt, setPdftotxt] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [uploadedHistory, setUploadedHistory] = useState([]);
  const [userName, setUserName] = useState('John Doe');

  useEffect(() => {
    if (location.state && location.state.file) {
      setFile(location.state.file);
      setFileUploaded(true);
      saveToHistory(location.state.file.name); 
    }
    const savedHistory = JSON.parse(localStorage.getItem('uploadedHistory')) || [];
    setUploadedHistory(savedHistory);
  }, [location.state]);

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

  const handlepdftodocx = () => {
    setPdftodocx(true);
    setPdftojpg(false);
    setAskpdf(false);
    setPdftotxt(false);
  };

  const handlepdftojpg = () => {
    setPdftojpg(true);
    setPdftodocx(false);
    setAskpdf(false);
    setPdftotxt(false);
  };

  const handleaskpdf = () => {
    setAskpdf(true);
    setPdftodocx(false);
    setPdftojpg(false);
    setPdftotxt(false);
  };

  const handlepdftotxt = () => {
    setPdftotxt(true);
    setPdftojpg(false);
    setPdftodocx(false);
    setAskpdf(false);
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
    <div className="dashboard">
        <section className="head">
            <div className="profile">
                <h2>Welcome to the dashboard {userName}</h2>
                <button onClick={toggleProfile} className="profile-button">
                <BiUser className="fa" />
                </button>
            </div>

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

            <div className="hero-banner">
            <h2>Upload Your Pdf</h2>
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
                    <button className="glow-on-hover" onClick={handlepdftotxt}>
                    Convert Now
                    </button>
                </div>

                <div className="banner-item">
                    <h3>PDF to JPG</h3>
                    <p>Convert your PDF documents into high-quality images.</p>
                    <button className="glow-on-hover" onClick={handlepdftojpg}>
                    Convert Now
                    </button>
                </div>

                <div className="banner-item">
                    <h3>PDF to DOCX</h3>
                    <p>Turn your PDF files into editable Word documents.</p>
                    <button className="glow-on-hover" onClick={handlepdftodocx}>
                    Convert Now
                    </button>
                </div>

                <div className="banner-item">
                    <h3>Ask AI About PDF</h3>
                    <p>Get quick answers to questions related to your PDFs using AI.</p>
                    <button className="glow-on-hover" onClick={handleaskpdf}>
                    Ask AI
                    </button>
                </div>
                </div>
            </div>
            )}

            {fileUploaded && pdftojpg && <Pdftojpg file={file} />}
            {fileUploaded && pdftodocx && <Pdftodocx file={file} />}
            {fileUploaded && askpdf && <Askpdf file={file} />}
            {fileUploaded && pdftotxt && <Summarize file={file} />}
            </div>
        </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} PDF Tools. All rights reserved.</p>
        <p>
          Contact us at <a href="mailto:support@pdftools.com">support@pdftools.com</a>
        </p>
        <p>
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
