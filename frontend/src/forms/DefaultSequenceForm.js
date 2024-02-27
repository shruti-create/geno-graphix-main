import React, { useState } from 'react';
import './DefaultSequenceForm.css';

// DefaultSequenceForm component allows users to select a default gene sequence.
// Users can choose from a list of default genes and generate the corresponding sequence
const DefaultSequenceForm = ({ onValueChange }) => {
    const [selectedGene, setSelectedGene] = useState('gene1');
  
    // Handles changes in the selected gene
    const handleGeneChange = (gene) => {
      setSelectedGene(gene);
      console.log('Selected default gene:', gene);
    };
  
    // Handles form submission
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const defaultGenes = ['TYROBP', 'FCER1G'];
    
    // JSX for rendering the component
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">Select Default Sequence</h2>
                    {defaultGenes.map((gene) => (
                        <button
                            key={gene}
                            onClick={() => handleGeneChange(gene.toLowerCase())}
                            className={`gene-button ${
                                selectedGene === gene.toLowerCase() ? 'selected' : ''
                            }`}
                    >
                        {gene}
                    </button>
                ))} 
                <div style={{ marginTop: '10px'}}>
                    <button className='generate-button'>Generate</button>
                </div>
            </form>
        </div>
    );
};

export default DefaultSequenceForm;
