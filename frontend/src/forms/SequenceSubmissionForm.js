import React, {useState} from 'react';
import "./SequenceSubmissionForm.css";

const SequenceSubmissionForm = ({ onValueChange, handleSequence }) => {

  const [inputText, setInputText] = useState('');
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
    setInputText(''); // Reset the inputText when a file is selected
  };

  const validateInput = () => {
    if (!inputText.trim() && !selectedFile) {
      setErrorMessage('Please enter text or upload a file.');
      return false;
    }

    if (selectedFile) {
      const validFiles = ['.fasta', '.fa', '.fas'];
      const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.'));

      if (!validFiles.includes(fileExtension.toLowerCase())) {
        setErrorMessage('Please upload a valid FASTA file.');
        return false;
      }
      return true;
    }

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
      if (selectedFile) {
        // Handle file logic here
        console.log('Submitted file:', selectedFile);
        // Optionally, reset the selected file state
        setSelectedFile(null);
      } else {
        console.log('Submitted text:', inputText);
        setValid(true);
        setErrorMessage(''); 
        setIsSubmitted(true);
        onValueChange(true);
        handleSequence(inputText);
      }
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
          onChange={handleTextChange}
          placeholder="Enter your text"
          className='text-area'
        />
       
        <h2 className='form-title'>Upload a File</h2>
        <div className='file-input-container'>
          <input
              type='file'
              accept='.fasta, .fas, .fa' // Optional: Specify accepted file types
              onChange={handleFileChange}
              className='file-upload'
          />
        </div>
        
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