import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrimerShowPage(inputtedSequence) {
    const [manipulatedSequence, setManipulatedSequence] = useState('');
    const fetchManipulatedSequence = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/primer', {
                sequence: inputtedSequence
            });
            setManipulatedSequence(response.data.manipulatedSequence.input);
        } catch (error) {
            console.error('Error fetching manipulated sequence', error);
        }
    };

    React.useEffect(() => {
        if (inputtedSequence) fetchManipulatedSequence();
    }, [inputtedSequence]);

    return (
        <div>
            <p style={{ fontSize: '1.2rem', color: 'black', margin: '20px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                Manipulated Sequence: {manipulatedSequence}
            </p>
        </div>
    );
};

export default PrimerShowPage;
