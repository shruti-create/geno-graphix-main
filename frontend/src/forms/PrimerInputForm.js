import React, { useState } from 'react';
import "./PrimerSequenceInputForm.css";

const PrimerInputForm = ({ onValueChange, handleSequence }) => {
  const [fullSequence, setFullSequence] = useState('');
  const [primers, setPrimers] = useState([
    { name: 'F1c', sequence: '' },
    { name: 'F2', sequence: '' },
    { name: 'F3', sequence: '' },
    { name: 'B1c', sequence: '' },
    { name: 'B2', sequence: '' },
    { name: 'B3', sequence: '' }, 
    { name: 'LF', sequence: '' }, 
    { name: 'LB', sequence: '' }
  ]);
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFullSequenceChange = (e) => {
    setFullSequence(e.target.value);
  };

  const handlePrimerChange = (index, sequence) => {
    const updatedPrimers = primers.map((primer, idx) => {
      if (idx === index) {
        return { ...primer, sequence };
      }
      return primer;
    });
    setPrimers(updatedPrimers);
  };

  const validateInput = () => {
    if (!fullSequence.trim() && !primers.some(p => p.sequence.trim())) {
      setErrorMessage('Please enter a full sequence or primer sequences.');
      return false;
    }

    const validChar = /^[aAcCgGtTuU]+$/;
    const cleanedFullSequence = fullSequence.replace(/\s/g, '');
    if (fullSequence && !validChar.test(cleanedFullSequence)) {
      setErrorMessage('Invalid characters in the full sequence.');
      return false;
    }

    for (let primer of primers) {
      const cleanedInput = primer.sequence.replace(/\s/g, '');
      if (!validChar.test(cleanedInput)) {
        setErrorMessage(`Invalid characters in ${primer.name} sequence.`);
        return false;
      }
      if (cleanedInput.length < 5) {
        setErrorMessage(`${primer.name} sequence length must be at least 5.`);
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidInput = validateInput();
    if (isValidInput) {
      console.log('Submitted full sequence:', fullSequence);
      console.log('Submitted primers:', primers);
      setValid(true);
      onValueChange(true);
      handleSequence(fullSequence, primers);
    } else {
      setValid(false);
    }
  };

  return (
    <div>
      <h2>Primer Edit/Debug Tool</h2>
      <p>Input your full sequence and/or sequences for each LAMP primer.</p>
      <form onSubmit={handleSubmit}>
        <div className='input-container'>
          <label>Full Sequence</label><br/><br/>
          <textarea
            value={fullSequence}
            onChange={handleFullSequenceChange}
            placeholder="Enter the full DNA sequence here"
            style = {{width: "53%", height: "15vh"}}
          />
        </div>
        {primers.map((primer, index) => (
          <div key={primer.name} className='input-container'>
            <br/><label>{primer.name}</label>
            <input
              type="text"
              value={primer.sequence}
              onChange={(e) => handlePrimerChange(index, e.target.value)}
              placeholder={`Enter ${primer.name} sequence`}
              style = {{width: "50%", height:"2vh"}}
            />
          </div>
        ))}
        <div className='button-container'>
          <button className='generate-button'>Debug Primer</button>
        </div>
        
        {!isValid && (
          <div className='error-message'>{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default PrimerInputForm;
