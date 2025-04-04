import './App.css';
import PrimerEditPage from "./pages/PrimerEditPage";
import AboutPage from "./pages/AboutPage"
import logo from './circle_dna_strands_transparent.png';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import React from 'react';


const NavBar = () => {
    const linkStyle = {
        padding: '20px', 
        fontSize: '20px',
        transition: 'box-shadow 0.3s ease', 
    };
    return (
      <nav style={{ 
        backgroundColor: '#0f3663', 
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px 5px 5px 5px', 
        boxShadow: '0 6px 2px -2px rgba(0,0,0,.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000, 
      }}>
        <img src={logo} alt="GenoGraphix Logo" style={{ position: 'absolute', height: '4vh', top: '1vh', marginLeft: '0vw' }} />
        <h1 style={{ 
            fontSize: '1.2rem', 
            color: '#ffffff', 
            marginBottom: '0', 
            flexShrink: 0, 
            top: '0vh',
            marginLeft: '4vw'
        }}>
          GenoGraphix
        </h1>
        <div style={{
            display: 'flex', 
            justifyContent: 'flex-end', 
        }}>
          
            <Link to="/home" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Home</Link>
            <Link to="/about-page" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">About GenoGraphix </Link>
            <Link to="/primer-edit-page" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Primer Editor</Link>

        </div>
      </nav>
    );
}  

function App() {
  return (
    <div>
      <Router>
          <NavBar />
          <Routes>
              <Route path="/home" element={<HomePage/>}/>
              <Route path="/primer-edit-page" element={<PrimerEditPage/>} />
              <Route path="/about-page" element={<AboutPage/>} />

              <Route path="*" element={<HomePage/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
