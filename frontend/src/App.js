import './App.css';
import VisualPage from "./pages/VisualPage";
import PrimerPage from "./pages/PrimerPage";
import LampPage from "./pages/LampPage";
import PrimerEditPage from "./pages/PrimerEditPage";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import React from 'react';

function changeTabColor(evt) {
  var i, navlinks;
  navlinks = document.getElementsByClassName("nav-link");
  for (i = 0; i < navlinks.length; i++) {
    navlinks[i].className = navlinks[i].className.replace(" active", "");
  }
  evt.currentTarget.className += " active";
}

const NavBar = () => {
    const linkStyle = {
        padding: '10px', 
        fontSize: '20px',
        transition: 'box-shadow 0.3s ease', 
    };
    return (
      <nav style={{ 
          backgroundColor: '#ffffff', 
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 20px', 
          boxShadow: '0 6px 2px -2px rgba(0,0,0,.2)'
      }}>
        <h1 style={{ 
            fontSize: '2rem', 
            color: '#0f3663', 
            marginBottom: '0', 
            flexShrink: 0 
        }}>
          GenoGraphix
        </h1>
        <div style={{
            display: 'flex', 
            justifyContent: 'flex-end', 
        }}>
            <Link to="/home" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Home Page</Link>
            <Link to="/visual-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Visual Page</Link>
            <Link to="/primer-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Primer Page</Link>
            <Link to="/primer-edit-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">Primer Edit Page</Link>
            <Link to="/lamp-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link" onclick="changeTabColor(event)">LAMP Page</Link>
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
              <Route path="/visual-page" element={<VisualPage/>} />
              <Route path="/primer-page" element={<PrimerPage/>} />
              <Route path="/primer-edit-page" element={<PrimerEditPage/>} />
              <Route path="/lamp-page" element={<LampPage/>} />
              <Route path="*" element={<HomePage/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
