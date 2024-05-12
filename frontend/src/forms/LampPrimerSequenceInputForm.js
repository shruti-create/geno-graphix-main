import React, {useCallback, useState} from 'react';
import "./LampPrimerSequenceInputForm.css";

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
    <h2> LAMP Primer Design Tool</h2>
    <div class="row">
      <div class="column_left">
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
            
              
              {/* <div className='dropdown-container' style= {{paddingTop:'1%', paddingBottom: '1%', width: '200px', height: '30px'}}>
                  <select className='primer-dropdown' style={{width: '100%', height: '100%'}}>
                      <option value="LAMP">LAMP Primers</option>
                      <option value="PCR">PCR Primers</option>
                  </select>
              </div> */}

            <div>
              <label for="target_name">Target Name</label><br></br>
              <input type="text" id="target_name"></input>
            </div>
            <div>
              <h3>Preferences</h3>
              {/* <label for="target_name">Target Name</label><br></br>
              <input type="text" id="target_name"></input><br></br> */}

              <div className='dropdown-container' style= {{paddingTop:'1%', paddingBottom: '1%', width: '200px', height: '30px'}}>
                  <select className='parameters-dropdown' style={{width: '100%', height: '100%'}}>
                      <option value="Normal">Normal Default Parameters</option>
                      <option value="AT-Rich">AT-Rich Default Parameters</option>
                      <option value="CG-Rich">CG-Rich Default Parameters</option>
                      <option value="Custom">Custom Parameters</option>
                  </select>
              </div>

              <div className='dropdown-container' style= {{paddingTop:'1%', paddingBottom: '1%', width: '200px', height: '30px'}}>
                  <select className='sorting-dropdown' style={{width: '100%', height: '100%'}}>
                      <option value="Dimer">Dimer</option>
                      <option value="F25">F2 5' Position</option>
                      <option value="F2B2">F2-B2 range</option>
                      <option value="MutationAsc">Mutations Ascending Order</option>
                      <option value="MutationDesc">Mutations Descending Order</option>
                      <option value="53edge">5'/3' Edge Stability</option>
                      <option value="Random">Random</option>
                      <option value="None">None</option>
                      <option value="Easy">Easy</option>
                  </select>
              </div>

              <label class="section-label">Reaction Conditions</label><br></br>
              <label for="conditionNa">Na+ concentration</label>
              <input type="number" id="conditionNa"></input><br></br>
              <label for="conditionMg">Mg++ concentration</label>
              <input type="number" id="conditionMg"></input><br></br>

              <label>Lengths</label><br></br>
              <input type="number" id="l1"></input><br></br>
              <input type="number" id="l2"></input><br></br>

            </div>
            <div className='button-container'>
              <button className='generate-button'>Generate LAMP Primers</button>
            </div>
          
            {!isValid && (
              <div className='error-message'> {errorMessage} </div>
            )}
          </form>
        </div>
        <div class="column_right">
          <p>primer output</p>
        </div>
      </div>
    </div>
  );
};

export default PrimerSequenceForm;