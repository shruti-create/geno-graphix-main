import React, {useCallback, useState} from 'react';
import "./SequenceSubmissionForm.css";

// SequenceSubmissionForm component for submitting DNA sequences
const SequenceSubmissionForm = ({ onValueChange, handleSequence }) => {
  const [inputText, setInputText] = useState('');
  const [isValid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  // const[fileContent, setFileContent] = useState('');

  // Handles manual text input change
  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  // Handles file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
    readFileContent(file);
    setInputText(''); // Reset the inputText when a file is selected
  };

  // Reads the file content
  const readFileContent = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const lines = fileContent.split('\n');

      // Extract annotations if present
      const extractedAnnotations = extractAnnotations(lines);
      setAnnotations(extractedAnnotations);
      console.log('Extracted Annotations:', extractedAnnotations);

      // Extract the seqeunce without annotations
      const sequenceLines = lines.filter(line => !line.includes('Highlight') && !line.includes('Underline'));
      const sequence = sequenceLines.join('');

      setInputText(sequence);
    };

    reader.readAsText(file);
  };

  // Extract annotations from file content 
  const extractAnnotations = (lines) => {

    // Extracts lines that include the terms 'Highlight' and 'Underline'
    const annotations = lines.filter(line => line.includes('Highlight') || line.includes('Underline'));
    
    // Creates a map with start, end and type of each annotation
    const extractedAnnotations = annotations.map(line => {
      const [start, end, type] = line.split(',').map(Number);
      return { start, end, type };
    });

    return extractedAnnotations;
  }

  // Validates the input or file 
  const validateInput = () => {
    if (!inputText.trim() && !selectedFile) {
      setErrorMessage('Please enter text or upload a file.');
      return false;   }
    
    // If user uploaded a file
    if (selectedFile) {
      const validFiles = ['.fasta', '.fa', '.fas', '.fna', '.txt']; // Valid file types
      const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.'));

      // Check the file's validity
      if (!validFiles.includes(fileExtension.toLowerCase())) {
        setErrorMessage('Please upload a valid file.');
        return false;
      }

      setErrorMessage('Valid file received');
      return true;
    }

    const cleanedInput = inputText.replace(/\s/g, '');
    var validChar = /^[aAcCgGtTuU]+$/;

    // Check if characters in sequence are valid
    if (!validChar.test(cleanedInput)) {
      setErrorMessage('Invalid characters in the sequence.');
      return false;
    }

    // Check if sequence length is valid
    if (cleanedInput.length <= 3) {
      setErrorMessage('Sequence length must be greater than 3.');
      return false;
    }

    return true;
  };

  // Handles form submission
  const handleSubmit = (e) => {
    // Prevents default form submission behavior 
    e.preventDefault();

    // Removes leading and trailing whitespaces
    const textToValidate = inputText.trim();

    // Validates input
    const isValidInput = validateInput(textToValidate);
    if (isValidInput) {
        console.log('Submitted text:', inputText);
        console.log('Saved annotations:', annotations);
        // Sets input validation to true
        setValid(true);
        // Clears any previous error message
        setErrorMessage(''); 
        // Notifies the parent component about the successful submission
        onValueChange(true);
        // handleSequence({ sequence: inputText, annotations });
        handleSequence(inputText);
        setSelectedFile(null);
      }
     else {
      console.log('Invalid input! Please enter a valid sequence.');
      // Sets the input validation status to false
      setValid(false);
    }
  };

  // JSX for rendering the component
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
              accept='.fasta, .fas, .fa, .fna, .txt'
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