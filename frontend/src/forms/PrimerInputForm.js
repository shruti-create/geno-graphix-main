import React, { useState } from 'react';
import './PrimerSequenceInputForm.css';

const PrimerInputForm = ({ onValueChange, handleSequence }) => {
  const [fullSequence, setFullSequence] = useState('');
  const [primers, setPrimers] = useState([
    { name: 'FIP', sequence: '' },
    { name: 'BIP', sequence: '' },
    { name: 'F3',  sequence: '' },
    { name: 'B3',  sequence: '' },
  ]);
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFullSequenceChange = (e) => setFullSequence(e.target.value);

  const handlePrimerChange = (index, sequence) => {
    setPrimers(primers.map((p, i) => i === index ? { ...p, sequence } : p));
  };

  const validateInput = () => {
    if (!fullSequence.trim() && !primers.some(p => p.sequence.trim())) {
      setErrorMessage('Please enter a full sequence or primer sequences.');
      return false;
    }

    const validChar = /^[aAcCgGtTuU]+$/;
    const cleanedFull = fullSequence.replace(/\s/g, '');
    if (fullSequence && !validChar.test(cleanedFull)) {
      setErrorMessage('Invalid characters in the full sequence.');
      return false;
    }

    for (let primer of primers) {
      const cleaned = primer.sequence.replace(/\s/g, '');
      if (!validChar.test(cleaned)) {
        setErrorMessage(`Invalid characters in ${primer.name} sequence.`);
        return false;
      }
      if (cleaned.length < 5) {
        setErrorMessage(`${primer.name} sequence must be at least 5 characters.`);
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInput()) {
      setValid(true);
      onValueChange(true);
      handleSequence(fullSequence, primers);
    } else {
      setValid(false);
    }
  };

  const handleSamplePrimers = () => {
    setFullSequence("CATACAATGTAACACAAGCTTTCGGCAGACGTGGTCCAGAACAAACCCAAGGAAATTTTGGGGACCAGGAACTAATCAGACAAGGAACTGATTACAAACATTGGCCGCAAATTGCACAATTTGCCCCCAGCGCTTCAGCGTTCTTCGGAATGTCGCGCATTGGCATGGAAGTCACACCTTCGGGAACGTGGTTGACCTACACAGGTGCCATCAAATTGGATGACAAAGATCCAAATTTCAAAGATCAAGTCATTTTGCTGAATAAGCATATTGACGCATACAAAACATTCCCACCAACAGA");
    setPrimers([
      { name: 'FIP', sequence: 'ATTGTGCAATTTGCGGCCAAGGGACCAGGAACTAATCAGA' },
      { name: 'BIP', sequence: 'CGCTTCAGCGTTCTTCGGAACCTGTGTAGGTCAACCAC' },
      { name: 'F3',  sequence: 'CAGAACAAACCCAAGGAAAT' },
      { name: 'B3',  sequence: 'TCTTTGTCATCCAATTTGATGG' },
    ]);
  };

  const subtitles = {
    FIP: 'F1c + F2 — Forward Inner Primer',
    BIP: 'B1c + B2 — Backward Inner Primer',
    F3:  'Forward Outer Primer',
    B3:  'Backward Outer Primer',
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
        <h2 style={{ margin: 0 }}>Primer Edit/Debug Tool</h2>
        <button
          type="button"
          className="generate-button"
          style={{ fontSize: '0.85rem', padding: '5px 12px' }}
          onClick={handleSamplePrimers}
        >
          Try Sample Primers
        </button>
      </div>
      <p className="form-description">
        Enter the full DNA sequence and your four LAMP primer sequences below.
      </p>

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
              <label htmlFor={`primer-${primer.name}`}>
                <span style={{ fontWeight: 600 }}>{primer.name}</span>
                <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px' }}>
                  {subtitles[primer.name]}
                </span>
              </label>
              <input
                id={`primer-${primer.name}`}
                type="text"
                value={primer.sequence}
                onChange={(e) => handlePrimerChange(index, e.target.value)}
                placeholder={`Enter ${primer.name} sequence`}
                className="text-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          ))}
        </div>

        <div className="button-container">
          <button type="submit" className="generate-button">Debug Primers</button>
        </div>

        {!isValid && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default PrimerInputForm;
