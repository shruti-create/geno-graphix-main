# GenoGraphix 

### Explore how GenoGraphix is transforming genetic analysis and diagnostics through innovative tools and accessible design.

## Background 

Genetic amplification is crucial for producing multiple copies of a genomic sequence, enabling detailed study and applications such as disease diagnosis and genetic research. The process involves primers, short nucleotide sequences targeting a specific DNA region for amplification. While Polymerase Chain Reaction (PCR) is the gold standard, it requires controlled temperature cycles, making it resource-intensive. In contrast, Loop-Mediated Isothermal Amplification (LAMP) operates at a constant temperature, making it more efficient, especially for low-resource settings or at-home diagnostics. Despite its advantages, the process of designing effective primers for LAMP can be challenging, with issues like self-amplification or primer dimers impacting reliability.

## Our Mission

LAMP holds significant promise for rapid, on-site diagnostics due to its constant temperature operation. However, challenges such as primer self-amplification and primer dimers—where primers amplify themselves or bind to each other instead of the target DNA—reduce its reliability. Moreover, existing tools for selecting LAMP primers are often outdated and difficult to navigate.

GenoGraphix aims to address these challenges by developing a web-based application that enhances primer design, minimizes issues like self-amplification and primer dimers, and improves usability and reliability. Our platform is designed for both research and at-home diagnostics.

## Features

### Interactive Primer Mapping

GenoGraphix provides a visual representation of primer placement on the target sequence, allowing users to assess primer coverage and alignment. This ensures even distribution of primers, minimizing non-specific amplification risks. 

### Primer Set Validation and Debugging

Unlike conventional tools that evaluate primers individually, GenoGraphix simulates the collective behavior of all six primers. This is crucial for LAMP, where unintended cross-interactions between primers can compromise reaction reliability. By detecting and flagging these issues early, GenoGraphix helps researchers prevent experimental failures and improve diagnostic accuracy.

### Real-Time Feedback and Recommendations

GenoGraphix provides dynamic feedback as users adjust their primers. For example, if a primer’s GC content is too high, the system suggests modifications to improve specificity while maintaining binding efficiency. This iterative improvement process reduces the need for trial-and-error synthesis, streamlining primer optimization.


## Open a Local Instance of GenoGraphix

cd frontend \
npm i --legacy-peer-deps \
cd .. \
cd backend \
pip install flask_cors \
cd .. \
bash start.sh 

The script will run the app in development mode. 
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Open the Hosted Site

If you would like to test out the size, use this link to view it in your browser: [https://shruti-create.github.io/geno-graphix-main/](https://shruti-create.github.io/geno-graphix-main/). 
If the backend services are initially not working, please wait 2 minutes. For any other issues/concerns with the link, please contact us. 

## Contact Us

Shruti Bhamidipati - shbhamidipati@ucsd.edu
\\
Uliyaah Dionisio - udionisio@ucsd.edu
\\
Vinuthna Maradana - vmaradana@ucsd.edu

