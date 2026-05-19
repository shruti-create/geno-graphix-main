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
        padding: '0 20px',
        fontSize: '16px',
        transition: 'box-shadow 0.3s ease',
        display: 'flex',
        alignItems: 'center',
    };
    return (
      <nav style={{
        backgroundColor: '#0f3663',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '52px',
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="GenoGraphix Logo" style={{ height: '32px' }} />
          <h1 style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              margin: '0',
              fontWeight: '600',
          }}>
            GenoGraphix
          </h1>
        </div>
        <div style={{ display: 'flex', height: '100%' }}>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link">Home</Link>
            <Link to="/about-page" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link">About GenoGraphix</Link>
            <Link to="/primer-edit-page" style={{ color: 'white', textDecoration: 'none', ...linkStyle }} className="nav-link">Primer Editor</Link>
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
