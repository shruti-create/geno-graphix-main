import PrimerChosenForm from "../forms/PrimerChosenForm";
import PrimerInput from "../forms/PrimerSequenceInputForm";
import React, {useState} from "react";


function PrimerPage() {
    const [submitted, setSubmitted] = useState(0);
    const [back, setBack] = useState(false);
    const [inputtedSequence, setInputtedSequence]  = useState('');
    
    const handleInputtedSequence = (sequence) => {
      setInputtedSequence(sequence);
    };
    
    const handleButtonClick = () => {
      setBack(!back); 
      setSubmitted(0);
    };
    const handleValueChange = (newValue) => {
      const newSubmittedValue = newValue ? 2 : 0; 
      setSubmitted(newSubmittedValue);
    };

    function ChooseForm(){
        if(submitted === 0 || (back && submitted === 0)){
        return (
            <div>
                <PrimerInput onValueChange={handleValueChange} handleSequence = {handleInputtedSequence}/>
            </div>
        );
        } else if (submitted === 2){
            return (
            <div>
                <PrimerChosenForm input = {inputtedSequence}/>
                <button 
                style={{
                marginRight: '10px',
                backgroundColor: '#665682',
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

    return (
        <div>
            <p style={{ fontSize: '1.2rem', color: 'black', margin: '20px'}}>
                <div style = {{backgroundColor: "white", padding: '2%', height: '75vh', borderRadius: '1%'}}>
                    <ChooseForm/>
                </div>
            </p>
        </div>
    );
};

export default PrimerPage;
