import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import Summarize from './components/Summerize/Summerize.jsx';
import Home from './components/Home/Home.jsx';
import Pdftojpg from './components/pdftojpg/Pdftojpg.jsx';
import Pdftodocx from './components/pdftodocx/Pdftodocx.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pdf-to-text" element={<Summarize />} />
        <Route path="/pdf-to-jpg" element={<Pdftojpg/>} />
        <Route path="/pdf-to-docx" element={<Pdftodocx/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
