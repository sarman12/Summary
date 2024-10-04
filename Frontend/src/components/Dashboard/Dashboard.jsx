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
    console.log('Stored Username:', storedUserName); // Debug log
    setUserName(storedUserName);

    if (storedUserName !== 'Guest') {
        fetch(`/user/${storedUserName}`)
            .then(response => {
                console.log('Response:', response); // Log the response to inspect it
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Attempt to parse as JSON
            })
            .then(data => {
                if (data.uploadedFiles) {
                    setUploadedHistory(data.uploadedFiles);
                }
            })
            .catch(err => console.error('Error fetching user history:', err));
    }
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

  const saveToHistory = (fileName) => {
    const newFile = { fileName, fileContent: '' }; // For now, just passing an empty fileContent
    fetch('http://localhost:5000/saveFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: userName,  // Ensure userName is defined
            fileName,
            fileContent: newFile.fileContent,
        }),
    })
    .then(response => {
        console.log('Response:', response); // Log the response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data:', data); // Log the data returned from the server
        if (data.message === 'File saved successfully') {
        const newEntry = { fileName, date: new Date().toISOString().split('T')[0] };
        setUploadedHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newEntry];
            console.log('Updated History:', updatedHistory); // Debug log
            return updatedHistory;
        });
    }

    })
    .catch(err => console.error('Error saving file:', err));
};



  const selectTool = (tool) => {
    setCurrentTool(tool);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className={`dashboard ${showProfile ? 'shift-left' : ''}`}>
      <div className="content">
        <section className="head">
          <div className="profile">
            <h2>Welcome to the dashboard, {userName}</h2>
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
