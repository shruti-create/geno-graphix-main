import React from "react";

// HomePage component to display introductory information and usage instructions
function HomePage() {
    return (
        <div>
            <h1 style={{fontSize: '3.3rem', color: 'black', textAlign: 'center', marginTop: '50px'}}>Welcome to GenoGraphix</h1>
            <p style={{ fontSize: '1.3rem', color: 'black', marginLeft: '10vw', marginRight: '10vw', marginTop: '50px'}}>
                GenoGraphix is an amazing tool that helps you visualize and analyze genetic data. It provides insights into both DNA and RNA sequences, primer construction, and more. Explore the world of genetics with GenoGraphix, and delve into a user-friendly interface that simplifies complex genetic information for researchers and enthusiasts alike.
            </p>
            <p style={{ fontSize: '1.3rem', color: 'black', marginLeft: '10vw', marginRight: '10vw'}}>
                The Visual Page tab shows the Visualization of DNA and RNA sequences with annotations. It also includes some default well-known sequences with visualizations as well. This tab offers interactive features allowing users to manipulate and explore these sequences in real-time, enhancing their understanding of genetic structures. The Primer Page tab showcases primers for different sequences, providing essential tools for genetic experimentation and research.
            </p>

            {/* <p style={{ fontSize: '1.1rem', color: 'black', marginLeft: '200px', marginRight: '200px', marginTop: '100px'}}>
                GenoGraphix is an amazing tool that helps you visualize and analyze genetic data.
                It provides insights into both DNA and RNA sequences, primer construction, and more.
                Explore the world of genetics with GenoGraphix!
            </p>
            <p style={{ fontSize: '1.1rem', color: 'black', marginLeft: '200px', marginRight: '200px'}}>
                The Visual Page tab shows the Visualization of DNA and RNA sequences with annotations. It also 
                includes some default well-known sequences with visualizations as well. 
                The Primer Page tab shows the primers for different sequences. 
            </p> */}
            <p style={{ fontSize: '1.3rem', color: 'black', marginLeft: '10vw', marginRight: '10vw'}}>
                Usage Instructions: 
            </p>
            <ul style={{ fontSize: '1.3rem', color: 'black', marginLeft: '10vw', marginRight: '10vw', marginBottom: '50px'}}>
                <li>Input or upload your genetic sequence for analysis.</li>
                <li>Use the visualization tools to examine sequence features.</li>
                <li>Access the Primer Page to view and design primers.</li>
                <li>Explore default sequences for learning and comparison.</li>
                <li>Contact support for any specific queries or assistance.</li>
            </ul>
            <button style={{ fontSize: '2.1rem', color: 'black', marginLeft: '10vw', marginRight: '1vw', paddingTop: '150px', paddingBottom: '150px', paddingLeft: '150px', paddingRight: '150px'}}>
                Visual Page
            </button>
            <button style={{ fontSize: '2.1rem', color: 'black', marginLeft: '1vw', marginRight: '1vw', paddingTop: '150px', paddingBottom: '150px', paddingLeft: '150px', paddingRight: '150px'}}>
                Primer Page
            </button>
            <button style={{ fontSize: '2.1rem', color: 'black', marginLeft: '1vw', marginRight: '10vw', paddingTop: '150px', paddingBottom: '150px', paddingLeft: '150px', paddingRight: '150px'}}>
                Primers LOL
            </button>
        </div>
    );
};

export default HomePage;
