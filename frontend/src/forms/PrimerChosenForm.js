import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrimerShowPage(inputtedSequence) {
    const [forwardPrimers, setForwardPrimers] = useState([]);
    const [reversePrimers, setReversePrimers] = useState([]);

    const fetchManipulatedSequence = async () => {
        try {
            console.log(inputtedSequence);
            const response = await axios.post('http://127.0.0.1:5000/primer', {
                sequence: inputtedSequence
            });
            setForwardPrimers(response.data.allPrimers[0]);
            setReversePrimers(response.data.allPrimers[1]);
        } catch (error) {
            console.error('Error fetching manipulated sequence', error);
        }
    };

    React.useEffect(() => {
        if (inputtedSequence) fetchManipulatedSequence();
    }, [inputtedSequence]);
    console.log("Forward "+ forwardPrimers)

    return (
        <div>
            <p style={{ fontSize: '1.2rem', color: 'black', margin: '20px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                Forward Primers: {forwardPrimers.join(', ')}
                <br/>
                Reverse Primers: {reversePrimers.join(', ')}
            </p>
        </div>
    );
};

export default PrimerShowPage;
