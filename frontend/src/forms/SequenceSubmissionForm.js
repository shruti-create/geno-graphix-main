import React, {useState} from 'react';
import "./SequenceSubmissionForm.css";


const SequenceSubmissionForm = ({ onValueChange, handleSequence }) => {

  const [inputText, setInputText] = useState('');
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 

  // Option to select the type of sequence removed 
  // const [selectedType, setSelectedType] = useState('dna');

  // const handleTypeChange = (type) => {
  //     setSelectedType(type);
  //     console.log('Selected sequence type:', type);
  // };

    const validateInput = () => {
      const cleanedInput = inputText.replace(/\s/g, '');
      
      var validChar = /^[aAcCgGtTuU]+$/;

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
      handleSequence(inputText);
    } else {
      console.log('Invalid input! Please enter a valid sequence.');
      setValid(false);
      setIsSubmitted(true);
    }
    
  };

  return (
    <div>
    <h2 className='form-title'>Input Sequence</h2>
    <form onSubmit={handleSubmit}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text"
        className='text-area'
      />
      <div className='button-container'>
        <button className='generate-button'>Generate</button>
      </div>
      {!isValid && (
        <div className='error-message'> {errorMessage} </div>
      )}
    </form>
    </div>
  );
};

export default SequenceSubmissionForm;