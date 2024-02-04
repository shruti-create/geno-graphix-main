import React, { useState } from 'react';
import './DefaultSequenceForm.css';

const DefaultSequenceForm = ({ onValueChange }) => {
    const [selectedGene, setSelectedGene] = useState('gene1');
  
    const handleGeneChange = (gene) => {
      setSelectedGene(gene);
      console.log('Selected default gene:', gene);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const defaultGenes = ['TYROBP', 'FCER1G'];

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
