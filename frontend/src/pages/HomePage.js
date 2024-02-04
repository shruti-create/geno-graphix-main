import React from "react";

function HomePage() {
    return (
        <div>
            <p style={{ fontSize: '1.1rem', color: 'black', margin: '20px'}}>
                GenoGraphix is an amazing tool that helps you visualize and analyze genetic data.
                It provides insights into both DNA and RNA sequences, primer construction, and more.
                Explore the world of genetics with GenoGraphix!
            </p>
            <p style={{ fontSize: '1.1rem', color: 'black', margin: '20px'}}>
                The Visual Page tab shows the Visualization of DNA and RNA sequences with annotations. It also 
                includes some default well-known sequences with visualizations as well. 
                The Primer Page tab shows the primers for different sequences. 
            </p>
            <p style={{ fontSize: '1.1rem', color: 'black', margin: '20px'}}>
                Usage Instructions: 
            </p>
            <ul style={{ fontSize: '1.1rem', color: 'black', margin: '20px'}}>
                <li>Input or upload your genetic sequence for analysis.</li>
                <li>Use the visualization tools to examine sequence features.</li>
                <li>Access the Primer Page to view and design primers.</li>
                <li>Explore default sequences for learning and comparison.</li>
                <li>Contact support for any specific queries or assistance.</li>
            </ul>
        </div>
    );
};

export default HomePage;
