import PrimerChosenForm from "../forms/PrimerEditorForm";
import PrimerInput from "../forms/PrimerInputForm";
import React, { useState } from "react";
import primersImage from '../components/primers.png';
import './PrimerEdit.css';


function PrimerEditPage() {
    const [submitted, setSubmitted] = useState(0);
    const [back, setBack] = useState(false);
    const [inputtedSequence, setInputtedSequence] = useState({ fullSequence: '', primers: [] });
    const [editingPrimer, setEditingPrimer] = useState(null);  // State to hold the currently editing primer

    const handleInputtedSequence = (fullSequence, primers) => {
      setInputtedSequence({ fullSequence, primers });
    };

    const handleButtonClick = () => {
      setBack(!back);
      setEditingPrimer(null); // Reset editing primer when going back
      setSubmitted(0);
    };

    const handleValueChange = (newValue) => {
      const newSubmittedValue = newValue ? 2 : 0; 
      setSubmitted(newSubmittedValue);
    };

    const handleEditPrimer = (primer) => {
      setEditingPrimer(primer);  // Set the currently editing primer
    };

    function ChooseForm() {
        if (submitted === 0 || (back && submitted === 0) || editingPrimer) {
            if (editingPrimer) {
                return (
                    <div>
                        <PrimerChosenForm input={editingPrimer.sequence}/>
                        <button 
                            style={{
                                backgroundColor: '#0f3663',
                                color: 'white',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                top: '20vh', 
                            }}
                            onClick={() => setEditingPrimer(null)}
                        >
                            Back
                        </button>
                    </div>
                );
            }
            return (
                <div>
                    <PrimerInput onValueChange={handleValueChange} handleSequence={handleInputtedSequence}/>
                </div>
            );
        } else if (submitted === 2) {
            return (
                <div>
                    <div style={{borderRadius: 5, borderWidth: 2}}>
                        <img src={primersImage} alt="Primers" className="small-image" />
                    </div>
                    {inputtedSequence.primers.map((primer) => (
                        <button 
                            key={primer.name}
                            style={{
                                marginRight: '10px',
                                backgroundColor: '#0f3663',
                                border: 'none',
                                color: 'white',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                marginBottom: '10px', 
                                width: '35vw', 
                                height: '12vh'
                            }}
                            onClick={() => handleEditPrimer(primer)}
                        >
                            Edit {primer.name}
                        </button>
                        
                    ))}
                    <div style={{
                            backgroundColor: '#0f3663',
                            color: 'white',
                            top: '10vh', 
                            right: '3vw',
                            position: 'fixed', 
                            width: '20vw', 
                            height: '78vh', 
                            borderRadius: '5px',
                            padding: '5px 10px',
                        }}>
                        Full Sequence: {inputtedSequence.fullSequence}
                    </div>
                    <button 
                        style={{
                            backgroundColor: '#0f3663',
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            position: 'fixed', 
                            top: '90vh', 
                            right: '3vw'
                        }}
                        onClick={handleButtonClick}
                    >
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

export default PrimerEditPage;
