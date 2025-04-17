// export default AboutPage;
import React from "react";
import "./AboutPage.css";
import primer_input from '../components/primer_input.png';
import primer_map from '../components/primer_map.png';
import primer_edit from '../components/primer_edit.png';

function AboutPage() {
    return (
        <div className="about-page">
            {/* Header Section */}
            <header className="about-header">
                <h1>About GenoGraphix</h1>
                <p>
                    Explore how GenoGraphix is transforming genetic analysis and diagnostics through innovative tools and accessible design.                
                </p>
            </header>

            {/* Understanding Genetic Amplification */}
            <section className="about-section">
                <h2>Background</h2>
                <p>
                    <b>Genetic amplification</b> is a cornerstone of molecular biology, enabling the production of multiple copies of a specific genomic sequence. This process is essential for various applications, including disease diagnosis, genetic research, and biotechnology advancements. Primers—short, single-stranded nucleotide sequences—are critical in targeting specific DNA regions for amplification.
                </p>
                <p>
                    While the <b>Polymerase Chain Reaction (PCR)</b> has long been considered the gold standard for genetic amplification, its reliance on precise temperature cycling makes it resource-intensive and less accessible for low-resource settings. In contrast, <b>Loop-Mediated Isothermal Amplification (LAMP)</b> offers a more efficient alternative, requiring only a constant temperature to achieve amplification. This efficiency makes LAMP particularly suited for rapid diagnostics in remote areas or at-home testing scenarios, bringing cutting-edge molecular biology to a broader audience.
                </p>
            </section>

        

            {/* Our Mission Section */}
            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    At GenoGraphix, we recognize the transformative potential of LAMP for democratizing molecular diagnostics. By enabling rapid, on-site DNA amplification at a constant temperature, LAMP has revolutionized the possibilities for fieldwork, resource-limited settings, and home-based healthcare. However, the technique is not without challenges.
                </p>
                <p>
                    Key issues like <b>primer self-amplification</b>-where primers amplify themselves—and <b>primer dimer formation</b>, where primers bind to each other instead of the target DNA, can compromise the accuracy and efficiency of the LAMP process. These problems make it critical to optimize primer design to ensure reliability and precision in genetic amplification workflows
                </p>
                <p>
                    GenoGraphix was created to bridge these gaps. Our platform offers an innovative, web-based application designed specifically to simplify and enhance primer design for LAMP. With tools to detect and minimize common pitfalls like self-amplification and dimers, GenoGraphix empowers users to achieve accurate and dependable results, whether they are conducting high-level research or performing at-home diagnostics.
                </p>
            </section>

            <section className="about-section">
                <h2>Our Audience</h2>
                <p>
                    GenoGraphix is a versatile platform for researchers, educators, and at-home users. It simplifies primer optimization with interactive tools to visualize, analyze, and modify primers, making LAMP technology more accessible and reliable.
                     Whether designing primers, teaching molecular biology, or exploring diagnostics, GenoGraphix empowers users to advance genetic amplification with precision and ease.                
                </p>
            </section>

            {/* Features Section */}
            <section className="about-section">
                <h2>Features</h2>
                <ul>
                    <li><strong>Sequence and Primer Input:</strong> Input full genomic sequences and customize individual primers (F1c, F2, F3, B1c, B2, B3).</li>
                    <li><strong>Primer Map Visualization:</strong> Visualizes primer alignment, highlighting overlaps, mismatches, and unintended interactions.</li>
                    <li><strong>Primer Editing Panel:</strong> Enables quick modification and debugging of primers with real-time updates.</li>
                    <li><strong>Run LAMP Simulation:</strong> Simulate primer performance and identify potential issues before experimentation.</li>
                    <li><strong>Save and Download:</strong> Save optimized primer sequences for future use or integration into workflows.</li>
                </ul>
            </section>

            {/* Primer Edit Page Details */}
            <section className="about-section">
                <h2>Primer Edit Page</h2>
                <p>
                    The Primer Edit/Debug Tool is a specialized web-based application designed to streamline and enhance the process of designing,
                    editing, and debugging primers for Loop-Mediated Isothermal Amplification (LAMP). Whether you are a researcher, scientist, or
                    student, this tool provides an intuitive interface for inputting full genomic sequences and specific primer sequences to ensure
                    accuracy and reliability in genetic amplification workflows.
                </p>

                <h3>Sequence and Primer Input</h3>

                <div className="image-container">
                    <img src={primer_input} alt="Description of image" />
                </div>
            
                <p>
                    Users can input the complete genomic sequence to analyze and design primers with precision. The tool supports individual primer sequences for key LAMP primers, such as F1c, F2, F3, B1c, B2, and B3. This allows users to customize and adjust each primer sequence as needed.
                </p>

                <p>
                    <b>Sample Primers:</b> For users unfamiliar with the LAMP process or new to primer design, a "Sample Primers" feature offers pre-set sequences for exploration and learning.
                </p>

                <h3>Debugging Capabilities:</h3>
                <p>
                 A "Debug Primer" function is provided to identify and resolve potential issues, such as self-amplifications or dimer formations, enhancing the reliability of the designed primers.                </p>
               

              


                <h3>Primer Map Visualization</h3>

                <div className="image-container2">
                    <img src={primer_map} alt="Description of image" />
                </div>

                <p>
                    Once the primer sequences are entered, the Primer Debugging Feature generates a Primer Map, offering an interactive visualization of how each primer aligns with the full genomic sequence. This feature helps users identify overlaps, mismatches, or unintended interactions, ensuring the designed primers are efficient and reliable.

                </p>
                <h3>Interactive Map</h3>
                <p>
                    The map visually represents the primer alignment along the sequence, allowing users to click and edit primers directly from the map view.
                </p>

                <h3>Error Detection</h3>
                <p>
                It highlights potential issues such as overlapping primers, incorrect placements, or sequences prone to self-amplification.
                </p>
                

                <h3>Primer Editing Panel</h3>
                <p>
                    The Primer Editing Panel allows quick modifications to individual primer sequences. Each primer is displayed with its label,
                    current sequence, and an "Edit" button for making adjustments. This ensures precision and efficiency when debugging problematic
                    primer sequences.
                </p>

                <h3>Run LAMP Simulation</h3>
                <p>
                    The tool allows users to simulate the LAMP reaction with the inputted or edited primers. The Run Simulation feature evaluates
                    how well the primers amplify the target DNA under real-world conditions. This simulation validates primer compatibility,
                    identifies unintended reactions (e.g., primer dimers or self-amplification), and offers a preview of expected results.
                </p>

                <h3>Save and Download</h3>
                <p>
                    After debugging and verifying primers, users can easily save and download the updated sequences for future experimentation
                    or integration into workflows.
                </p>

                <div className="image-container">
                    <img src={primer_edit} alt="Description of image" />
                </div>

                <p>
                    When you select a specific primer for editing, the Edit Primer Feature provides an intuitive interface to adjust and refine primer sequences.
                     This page is designed to help users ensure that their primer sequences are optimized for reliable performance in Loop-Mediated Isothermal Amplification (LAMP) reactions.
                </p>

                <h3>Primer Visualization</h3>
                <p>
                    The primer sequence is visually represented with a color-coded map, allowing users to see individual nucleotides and their positions.
                    Color Codes: Red: Adenine, Blue: Thymine, Green: Cytosine, Yellow: Guanine
                </p>

                <h3>Primer Editing</h3>
                <p>
                    Users can add or delete specific nucleotides at chosen positions within the primer sequence
                </p>
                <p> <b>Add Character:</b> Input a nucleotide (A, T, G, C) and specify its position to insert it into the sequence. </p>
                <p> <b>Delete Character:</b> Remove incorrect or unnecessary nucleotides from the sequence.  </p>

                <h3>Real-Time Recommendations:</h3>
                <p>The Recommendations Panel analyzes the current primer sequence to identify potential issues such as loop formation, mismatches, and dimerization risks. If no problems are found, it directs users to the primer map for further details.</p>
                <h4>GC Content Optimization</h4>
                    <p>GC content refers to the proportion of guanine (G) and cytosine (C) bases in a primer sequence. These bases form stronger bonds than adenine (A) and thymine (T), contributing to the stability of the DNA duplex.
                    </p>
                    <p>Example Feedback: "GC content is below the optimal range: Add 1 GC base."</p>
                    <p>Why it matters: If the GC content is too low, the primer may not bind effectively to the target sequence, reducing amplification efficiency. The panel suggests adding GC bases to improve primer stability and binding affinity.</p>
                <h4>Structural Feedback</h4>
                    <p>The panel provides insights into potential structural issues like:</p>
                    <p>Formation of loops: These can occur due to incorrect nucleotide pairing within the primer, leading to inefficiencies.</p>
                    <p>Secondary structures: Such as hairpins or dimers, which can reduce the primer's effectiveness in targeting the desired DNA region.
                    </p>
                    <p>Recommendations often direct users to the visual map on the right for a detailed representation of these structures, making it easier to locate and resolve issues.</p>
                <h4>Actionable Suggestions</h4>
                <p>
                The Recommendations Panel not only identifies issues like loop formation, mismatches, and dimerization risks in the primer sequence but also provides actionable solutions. For example, it may suggest adding specific bases (e.g., "Add 1 GC base"), adjusting the sequence length, or reviewing the primer's placement within the target sequence. If no issues are detected, users are directed to the primer map for further details.</p>
                <h4>Real Time Updates</h4>
                <p>The Recommendations Panel not only identifies issues like loop formation, mismatches, and dimerization risks in the primer sequence but also provides actionable solutions. For example, it may suggest adding specific bases (e.g., "Add 1 GC base"), adjusting the sequence length, or reviewing the primer's placement within the target sequence. If no issues are detected, users are directed to the primer map for further details.</p>

                <h3>Structural Insights:</h3>
                <p>On the right-hand side, the Primer Map visualizes the primer structure, showcasing potential loops, bonds, and areas that require attention. 
                    This feature aids in detecting secondary structures that might affect the amplification process.
                    The panel provides the "why" behind the problem, while the map shows the "where."
                </p>
               
                <h3>Streamlined Workflow</h3>
                <p>After refining the primer, users can save their changes or navigate back to the main tool to continue debugging and optimizing other primers.</p>
                
                <h2>About the Team</h2>
                <p>
                    This tool was created by students Shruti Bhamidipati, Vinuthna Maradana, and Uliyaah Dionisio from the 2024 Early Research Scholars Program at the University of California, San Diego. 
                    Contact us with any inquiries at shruti.bhamidipati@gmail.com, vinu.maradana@gmail.com
                 </p>

            </section>

            {/* Footer */}
            <footer className="about-footer">
                <button className="back-button" onClick={() => window.history.back()}>
                    Back to Home
                </button>
            </footer>
        </div>
    );
}

export default AboutPage;
