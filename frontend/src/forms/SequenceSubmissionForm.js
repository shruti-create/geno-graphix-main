import React, {useState} from 'react';

const SequenceSubmissionForm = ({ onValueChange }) => {

  const [inputText, setInputText] = useState('');
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 


  const [selectedType, setSelectedType] = useState('dna');

    const handleTypeChange = (type) => {
        setSelectedType(type);
        console.log('Selected sequence type:', type);
    };

    const validateInput = () => {
      const cleanedInput = inputText.replace(/\s/g, '');
      const rnaChar = /^[aAcCgGuU]+$/;
      const dnaChar = /^[aAcCgGtT]+$/;
      const proChar = /^[aArRnNdDcCeEqQgGiIlLkKmMfFpPsStTwWyYvV]+$/;
      
      var validChar = dnaChar;
      //TODO: use sequence type to set validChar to correct value using if statement
      if (selectedType === 'rna'){ validChar = rnaChar;}
      else if (selectedType === 'pro'){ validChar = proChar;}

      if (!validChar.test(cleanedInput)) {
        setErrorMessage('Invalid characters in the sequence.');
        return false;
      }

      if (cleanedInput.length <= 3) {
        setErrorMessage('Sequence length must be greater than 3.');
        return false;
      }

      if (cleanedInput.length % 2 !== 0) {
        setErrorMessage('Sequence length must be even.');
        return false;
      }

      return true;
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidInput = validateInput();

    if (isValidInput) {
      console.log('Submitted text:', inputText);
      setValid(true);
      setErrorMessage(''); 
      setIsSubmitted(true);
      onValueChange(true);
    } else {
      console.log('Invalid input! Please enter a valid sequence.');
      setValid(false);
      setIsSubmitted(true);
    }
    
  };

  return (
    <div>
      <h2 style={{ fontSize: '1rem', color: '#665682', marginBottom: '10px' }}>Select Sequence Type</h2>
      <button
        onClick={() => handleTypeChange('dna')}
        style={{
            marginRight: '10px',
            backgroundColor: selectedType === 'dna' ? '#665682' : 'transparent',
            color: selectedType === 'dna' ? 'white' : '#665682',
            border: '1px solid #665682',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            marginBottom: '10px'
        }}
    >
        DNA
    </button>
    <button
        onClick={() => handleTypeChange('rna')}
        style={{
            backgroundColor: selectedType === 'rna' ? '#665682' : 'transparent',
            color: selectedType === 'rna' ? 'white' : '#665682',
            border: '1px solid #665682',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            marginBottom: '10px'
        }}
    >
        RNA
    </button>
    
    <h2 style={{ fontSize: '1rem', color: '#665682', marginBottom: '10px' }}>Input Sequence</h2>
    <form onSubmit={handleSubmit}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text"
        style={{
          width: '80%',
          height: '100px',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          fontSize: '1.2rem',
          whiteSpace: 'normal',
        }}
      />
      <div style={{ marginTop: '10px' }}>
        <button
          style={{
            backgroundColor: '#665682',
            color: 'white',
            border: '1px solid #665682',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Submit
        </button>
      </div>
      {!isValid && (
        <div style={{ color: '#801921', marginTop: '5px' }}>
          <b>{errorMessage}</b>
        </div>
      )}
    </form>
    </div>
  );
};

export default SequenceSubmissionForm;