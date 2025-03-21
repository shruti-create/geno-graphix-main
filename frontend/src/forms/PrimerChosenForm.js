import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PrimerShowPage component displays forward and reverse primers for an inputted sequence.
function PrimerShowPage(inputtedSequence) {
    const [forwardPrimers, setForwardPrimers] = useState([]);
    const [reversePrimers, setReversePrimers] = useState([]);
    const [mainString, setMainString] = useState("");
    // Fetches manipulated sequence from the server
    const fetchManipulatedSequence = async () => {
        try {
            console.log(inputtedSequence);
            // Make a POST request to the server to get primers
            const response = await axios.post('http://127.0.0.1:5000/primer', {
                sequence: inputtedSequence
            });
            // Update state with forward and reverse primers
            setForwardPrimers(response.data.allPrimers[0]);
            setReversePrimers(response.data.allPrimers[1]);
            showSequence();
        } catch (error) {
            console.error('Error fetching manipulated sequence', error);
        }
    };

    // useEffect hook to trigger primer fetching when inputtedSequence changes
    React.useEffect(() => {
        if (inputtedSequence) fetchManipulatedSequence();
    }, [inputtedSequence]);
    
    console.log("Forward "+ forwardPrimers)

    function showSequence(){
        var length = inputtedSequence.input.length;
        var temp = "";
        for(var i = 0; i<length; i++){
            temp = temp + "-";
        }
        setMainString(temp);
    }
    // JSX for rendering the component
    return (
        <div style={{ padding: '1%', overflowY: 'scroll', height: '65vh', borderRadius: '1vh', borderColor: 'purple', borderWidth: '0.02vh', borderStyle: 'solid',}}>
            <div style= {{borderRadius: '1vh', borderStyle:'solid', borderColor: 'black', height: '40vh', overflow: 'auto',whiteSpace: 'nowrap',  fontSize: '48px',
            letterSpacing: '-2px',display: 'inline-block',fontFamily: "'Courier New', monospace", lineHeight: '1em', width:'70vw', minWidth: '100%',}}>
                <div style ={{transform: 'scaleX(0.02) scaleY(3)', whiteSpace: 'nowrap'}}>
                    {mainString}
                </div>
            </div>
            <p style={{ fontSize: '1.2rem', color: 'black', margin: '0.5%', marginTop: '0',  overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                <h4>Forward Primers:</h4>
                <hr style = {{marginTop:'1%', marginBottom: '2%'}}/>
                <div>
                    {forwardPrimers.map((primer, index) => (
                        <React.Fragment key={index}>
                            {primer}
                            {index < forwardPrimers.length - 1 && <hr style = {{marginTop:'2%', marginBottom: '2%'}}/>}
                        </React.Fragment>
                    ))}
                </div>
                <br />
                <hr style = {{ marginBottom: '2%'}}/>
                <h4>Reverse Primers:</h4>
                <hr style = {{marginTop:'1%', marginBottom: '2%'}}/>
                <div>
                    {reversePrimers.map((primer, index) => (
                        <React.Fragment key={index}>
                            {primer}
                            {index < reversePrimers.length - 1 && <hr style = {{marginTop:'2%', marginBottom: '2%'}}/>}
                        </React.Fragment>
                    ))}
                </div>
            </p>
        </div>
    );
};

export default PrimerShowPage;
