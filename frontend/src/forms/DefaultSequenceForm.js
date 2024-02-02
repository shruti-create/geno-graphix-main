
import React, { useState } from 'react';

const DefaultSequenceForm = ({ onValueChange }) => {
    const [selectedGene, setSelectedGene] = useState('gene1');
    const [openVisual, setOpenVisual] = useState(false);
  
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
                <h2 style={{ fontSize: '1rem', color: '#665682', marginBottom: '10px' }}>Select Default Sequence</h2>
                    {defaultGenes.map((gene) => (
                        <button
                            key={gene}
                            onClick={() => handleGeneChange(gene.toLowerCase())}
                            style={{
                                marginRight: '10px',
                                backgroundColor: selectedGene  === gene.toLowerCase() ? '#665682' : 'transparent',
                                color: selectedGene === gene.toLowerCase() ? 'white' : '#665682',
                                border: '1px solid #665682',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                marginBottom: '10px'
                            }}
                    >
                        {gene}
                    </button>
                ))} 
                <div style={{ marginTop: '10px'}}>
                    <button style={{
                        backgroundColor: '#665682',
                        color: 'white',
                        border: '1px solid #665682',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}>Submit</button>
                </div>
            </form>
        </div>
    );
};

export default DefaultSequenceForm;
