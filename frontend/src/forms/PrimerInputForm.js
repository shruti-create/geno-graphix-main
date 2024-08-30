import React, { useState } from 'react';
import './PrimerSequenceInputForm.css';

const PrimerInputForm = ({ onValueChange, handleSequence }) => {
  const [fullSequence, setFullSequence] = useState('');
  const [primers, setPrimers] = useState([
    { name: 'F1c', sequence: '' },
    { name: 'F2', sequence: '' },
    { name: 'F3', sequence: '' },
    { name: 'B1c', sequence: '' },
    { name: 'B2', sequence: '' },
    { name: 'B3', sequence: '' },
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
    <div className="form-container">
      <h2>Primer Edit/Debug Tool</h2>
      <p className="form-description">Input your full sequence and sequences for each LAMP primer.</p>
      <form onSubmit={handleSubmit} className="primer-form">
        <div className="input-group">
          <label htmlFor="full-sequence">Full Sequence</label>
          <textarea
            id="full-sequence"
            value={fullSequence}
            onChange={handleFullSequenceChange}
            placeholder="Enter the full DNA sequence here"
            className="textarea-input"
          />
        </div>
        <div className="primers-container">
          {primers.map((primer, index) => (
            <div key={primer.name} className="input-group primer-column">
              <label htmlFor={`primer-${primer.name}`}>{primer.name}</label>
              <input
                id={`primer-${primer.name}`}
                type="text"
                value={primer.sequence}
                onChange={(e) => handlePrimerChange(index, e.target.value)}
                placeholder={`Enter ${primer.name} sequence`}
                className="text-input"
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button type="submit" className="generate-button">Debug Primer</button>
        </div>
        
        {!isValid && (
          <div className="error-message">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default PrimerInputForm;
