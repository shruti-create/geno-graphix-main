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
                    <h1 className="subtitle">A free interactive tool to explore, visualize and analyze genetic data.</h1>
                </div>
            </div>
            
            {/* <p className="description2">
                Provides insights into both DNA and RNA sequences, primer construction, and more. Explore the world of genetics with GenoGraphix, and delve into a user-friendly interface that simplifies complex genetic information for researchers and enthusiasts alike.
            </p> */}
        
            <p className="description">
                Why Choose GenoGraphix?
            </p>

        
            <div className="advantages-container">
                <div className="advantage">
                    <h3>Comprehensive Analysis</h3>
                    <p>Get detailed insights into DNA and RNA sequences with our advanced tools.</p>
                </div>
                <div className="advantage">
                    <h3>Easy Primer Design</h3>
                    <p>Optimize primer design with our intuitive and user-friendly interface.</p>
                </div>
                <div className="advantage">
                    <h3>Efficient Visualization</h3>
                    <p>Visualize complex genetic data effortlessly with interactive graphics.</p>
                </div>
                <div className="advantage">
                    <h3>Accessible for All</h3>
                    <p>Whether you're a researcher or enthusiast, our tool is designed for ease of use.</p>
                </div>
            </div>

            <p className="description">
                Explore
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
