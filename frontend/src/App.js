import './App.css';
import VisualPage from "./components/VisualPage";
import PrimerPage from "./components/PrimerPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import HomePage from "./components/HomePage";
import React from 'react';


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
            color: '#665682', 
            marginBottom: '0', 
            flexShrink: 0 
        }}>
          GenoGraphix
        </h1>
        <div style={{
            display: 'flex', 
            justifyContent: 'flex-end', 
        }}>
            <Link to="/home" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link">Home Page</Link>
            <Link to="/visual-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link">Visual Page</Link>
            <Link to="/primer-page" style={{ color: 'black', textDecoration: 'none', ...linkStyle }} className="nav-link">Primer Page</Link>
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
              <Route path="*" element={<HomePage/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
