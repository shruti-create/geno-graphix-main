import React, {useCallback, useState} from 'react';
import "./PrimerSequenceInputForm.css";

// PrimerSequenceForm component for inputting DNA sequence and generating primers.
const PrimerSequenceForm = ({ onValueChange, handleSequence }) => {

  const [inputText, setInputText] = useState('');
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const[fileContent, setFileContent] = useState('');

  // Handles text input change
  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };
 
  // Handles file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
    readFileContent(file);
    setInputText(''); 
  };

  // Reads file content
  const readFileContent = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const lines = fileContent.split('\n');
      const sequence = lines.slice(1).join('');
      setInputText(sequence);
    };

    reader.readAsText(file);
  };

  // Validates input 
  const validateInput = () => {
    if (!inputText.trim() && !selectedFile) {
      setErrorMessage('Please enter text or upload a file.');
      return false;
    }

  
    if (selectedFile) {
      const validFiles = ['.fasta', '.fa', '.fas', '.fna'];
      const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.'));

      if (!validFiles.includes(fileExtension.toLowerCase())) {
        setErrorMessage('Please upload a valid FASTA file.');
        return false;
      }

      setErrorMessage('Valid file received');
      return true;
    }

    const cleanedInput = inputText.replace(/\s/g, '');
    var validChar = /^[aAcCgGtTuU]+$/;

    if (!validChar.test(cleanedInput)) {
      setErrorMessage('Invalid characters in the sequence.');
      return false;
    }

    if (cleanedInput.length <= 25) {
      setErrorMessage('Sequence length must be greater than 25.');
      return false;
    }
    return true;
  };


  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const textToValidate = inputText.trim();
    const isValidInput = validateInput(textToValidate);
    if (isValidInput) {
        console.log('Submitted text:', inputText);
        setValid(true);
        setErrorMessage(''); 
        onValueChange(true);
        handleSequence(inputText);
        setSelectedFile(null);
      }
     else {
      console.log('Invalid input! Please enter a valid sequence.');
      setValid(false);
    }
    
  };

  // JSX for rendering the component
  return (
    <div>
    <h2> Primer Design Tool</h2>
    <p1> Input your sequence or upload a file that contains your sequence. </p1>
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
              accept='.fasta, .fas, .fa, .fna'
              onChange={handleFileChange}
              className='file-upload'
          />
        </div>
        
        <div className='dropdown-container' style= {{paddingTop:'1%', paddingBottom: '1%', width: '200px', height: '30px'}}>
            <select className='primer-dropdown' style={{width: '100%', height: '100%'}}>
                <option value="LAMP">LAMP Primers</option>
                <option value="PCR">PCR Primers</option>
            </select>
        </div>
        
        <div className='button-container'>
          <button className='generate-button'>Generate Primers</button>
        </div>
       
        {!isValid && (
          <div className='error-message'> {errorMessage} </div>
        )}

      </form>
    </div>
  );
};

export default PrimerSequenceForm;