import React from "react";
import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About GenoGraphix</h1>
                <p>
                    Explore how GenoGraphix is transforming genetic analysis and diagnostics
                    through innovative tools and accessible design.
                </p>
            </div>
            
            <div className="about-section">
                <h2>Background</h2>
                <p>
                    Genetic amplification is crucial for producing multiple copies of a genomic
      sequence, enabling detailed study and applications such as disease diagnosis and
                    genetic research. The process involves primers, short nucleotide sequences
                    targeting a specific DNA region for amplification. While Polymerase Chain
                    Reaction (PCR) is the gold standard, it requires controlled temperature cycles,
                    making it resource-intensive. In contrast, Loop-Mediated Isothermal
                    Amplification (LAMP) operates at a constant temperature, making it more
                    efficient, especially for low-resource settings or at-home diagnostics.  
                    Despite its advantages, the process of designing effective primers for LAMP 
                    can be challenging, with issues like self-amplification or primer dimers impacting 
                    reliability.
                </p>
            </div>
            
            <div className="mission-container">
                <div className="mission-header">
                    <h2>Our Mission</h2>
                    <p>
                        LAMP holds significant promise for rapid, on-site diagnostics due to its constant
                        temperature operation. However, challenges such as primer self-amplification and
                        primer dimers—where primers amplify themselves or bind to each other instead of the
                        target DNA—reduce its reliability. Moreover, existing tools for selecting LAMP primers
                        are often outdated and difficult to navigate.
                    </p>
                    <p>
                        GenoGraphix aims to address these challenges by developing a web-based application that
                        enhances primer design, minimizes issues like self-amplification and primer dimers, and
                        improves usability and reliability. Our platform is designed for both research and
                        at-home diagnostics.
                    </p>
                </div>
            </div>


        </div>
    );
}

export default AboutPage;
