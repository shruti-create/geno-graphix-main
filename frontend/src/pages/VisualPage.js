import React, { useState} from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import SequenceSubmissionForm from '../forms/SequenceSubmissionForm';
import VisualizationPage from "../forms/VisualizationForm";

// VisualPage component for handling sequence input, demo sequence, and visualization
function VisualPage() {
    const [tabNum, setTabNum] = useState(0);
    const [submitted, setSubmitted] = useState(0);
    const [back, setBack] = useState(false);
    const [inputtedSequence, setInputtedSequence]  = useState('');
    
    // Handles updating the inputted sequence
    const handleInputtedSequence = (sequence) => {
      setInputtedSequence(sequence);
    };
  
    // Handles button click to go back to the input form
    const handleButtonClick = () => {
      setBack(!back); 
      setSubmitted(0);
    };
    
    // Handles value change to update submission status
    const handleValueChange = (newValue) => {
      const newSubmittedValue = newValue ? 2 : 0; 
      setSubmitted(newSubmittedValue);
    };

    // Function to render the appropriate form based on the active tab
    function ChooseForm(){
      switch(tabNum) {
        case 0:
          if(submitted === 0 || (back && submitted === 0)){
          return (
            <div>
              <SequenceSubmissionForm onValueChange={handleValueChange} handleSequence = {handleInputtedSequence} />
            </div>
          );
          } else if (submitted === 2){
            return (
              <div>
                <VisualizationPage style = {{position: "fixed",  width: "80vw", height: "80vh"}} input = {inputtedSequence}/>
                <button 
                style={{
                  marginRight: '10px',
                  backgroundColor: '#0f3663',
                  border: '1px solid #665682',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
                onClick={handleButtonClick}>
                  Back
                  </button>
              </div>
            );
          }
      }
    }

    return (
        <main style={{ margin: '20px' }}>
            <div>
               
                <Paper variant="outlined" style={{padding:20, borderRadius:10}}>
               
              <div style={{padding:10}}>
                <ChooseForm/>
              </div>
            </Paper>
            </div>
        </main>
    );
};

export default VisualPage;
