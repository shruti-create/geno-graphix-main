import React from "react";
import backImage from '../components/genographix-back.png';
import visual from '../components/visual.png';
import edit from '../components/edit.png';
import './HomePage.css';

function HomePage() {
    return (
        <div>
            <div className="background-container">
                <div 
                    className="background-image" 
                    style={{ backgroundImage: `url(${backImage})` }}>
                </div>
                <div className="overlay"></div>
                <div className="content">
                    <h1 className="title">Welcome to GenoGraphix</h1>
                    <h2 className="subtitle">Produced by Boolean Lab at UCSD</h2>
                </div>
            </div>
            <p className="description">
                GenoGraphix is an amazing tool that helps you visualize and analyze genetic data. It provides insights into both DNA and RNA sequences, primer construction, and more. Explore the world of genetics with GenoGraphix, and delve into a user-friendly interface that simplifies complex genetic information for researchers and enthusiasts alike.
            </p>
            <br/>
            <div className="buttons-container">
                <a href={'http://localhost:3000/visual-page'}>
                    <button 
                        className="button visual-button" 
                        style={{ backgroundImage: `url(${visual})` }}>
                        Visual Page
                    </button>
                </a>
                <a href={'http://localhost:3000/primer-edit-page'}>
                    <button 
                        className="button primer-button" 
                        style={{ backgroundImage: `url(${edit})` }}>
                        Primer Editor
                    </button>
                </a>
            </div>
        </div>
    );
};

export default HomePage;
