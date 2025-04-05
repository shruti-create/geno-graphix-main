import PrimerChosenForm from "../forms/PrimerEditorForm";
import PrimerInput from "../forms/PrimerInputForm";
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import './PrimerEdit.css';
import BACKEND_URL from './config';

function PrimerEditPage() {
    const [submitted, setSubmitted] = useState(0);
    const [back, setBack] = useState(false);
    const [inputtedSequence, setInputtedSequence] = useState({ fullSequence: '', primers: [] });
    const [editingPrimer, setEditingPrimer] = useState(null);
    const [editedPrimer, setEditedPrimer] = useState({ name: '', sequence: '' });
    const [simulationOutput, setSimulationOutput] = useState('');
    const [error, setError] = useState('');
    const [mapImage, setMapImage] = useState(null);


    const handleInputtedSequence = (fullSequence, primers) => {
        setInputtedSequence({ fullSequence, primers });
    };

    const fetchPrimerMap = useCallback(async () => {
        if (!inputtedSequence.fullSequence || inputtedSequence.primers.length === 0) {
            return;
        }
    
        try {
            const response = await axios.post('${BACKEND_URL}/primer-map', {
                sequence: inputtedSequence.fullSequence,
                primers: inputtedSequence.primers.map(primer => primer.sequence)
            }, {
                responseType: 'blob' 
            });
    
            const imageUrl = URL.createObjectURL(response.data);  
            setMapImage(imageUrl);  
        } catch (error) {
            console.error('Error fetching primer map:', error);
            setError('Failed to fetch the primer map.');
        }
    }, [inputtedSequence]);
    
    
    
    

    useEffect(() => {
        if (submitted === 2) {
            fetchPrimerMap();
        }
    }, [submitted, fetchPrimerMap]);
    

    const runSimulation = useCallback(async () => {
        let sequence = inputtedSequence.fullSequence;
        let F2 = '';
        let F1c = '';
        let B2 = '';
        let B1c = '';
        inputtedSequence.primers.forEach(primer => {
            switch (primer.name) {
                case 'F2':
                    F2 = primer.sequence;
                    break;
                case 'F1c':
                    F1c = primer.sequence;
                    break;
                case 'B2':
                    B2 = primer.sequence;
                    break;
                case 'B1c':
                    B1c = primer.sequence;
                    break;
                default:
                    break;
            }
        });
        try {
            const response = await axios.post('${BACKEND_URL}/run-simulation', {
                sequence: sequence,
                F2: F2,
                F1c: F1c,
                B2: B2,
                B1c: B1c
            });

            const data = response.data;
            setSimulationOutput(data.output);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    }, [inputtedSequence]);

    const handleButtonClick = () => {
        setBack(!back);
        setSubmitted(0);
    };

    const handleBackFromEdit = () => {
        setEditingPrimer(null);
        updateEditedPrimer();
    };

    const handleValueChange = (newValue) => {
        const newSubmittedValue = newValue ? 2 : 0;
        setSubmitted(newSubmittedValue);
    };

    const handleEditPrimer = (primer) => {
        setEditingPrimer(primer);
        setEditedPrimer({ name: '', sequence: '' });
    };

    const handlePrimerChange = (name, newSequence) => {
        setEditedPrimer({ name, sequence: newSequence });
    };

    const updateEditedPrimer = () => {
        setInputtedSequence((prevState) => {
            const updatedPrimers = prevState.primers.map((primer) =>
                primer.name === editedPrimer.name ? { ...primer, sequence: editedPrimer.sequence } : primer
            );
            return { ...prevState, primers: updatedPrimers };
        });
    };

    const saveToFile = () => {
        let textContent = `Full Sequence:\n${inputtedSequence.fullSequence}\n\nPrimers:\n`;
        inputtedSequence.primers.forEach((primer) => {
            textContent += `${primer.name}: ${primer.sequence}\n`;
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'primers_and_sequence.txt';  
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); 
        window.URL.revokeObjectURL(url);  
    };

    function ChooseForm() {
        if (submitted === 0 || (back && submitted === 0) || editingPrimer) {
            if (editingPrimer) {
                return (
                    <div>
                        <PrimerChosenForm
                            inputtedSequence={editingPrimer.sequence}
                            onPrimerChange={(newSequence) => {
                                handlePrimerChange(editingPrimer.name, newSequence);
                            }}
                        />
                        <button
                            style={{
                                backgroundColor: '#0f3663',
                                color: 'white',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                top: '20vh',
                            }}
                            onClick={() => {
                                localStorage.clear();  
                                handleBackFromEdit();
                            }}
                        >
                            Back
                        </button>
                    </div>
                );
            }
            return (
                <div>
                    <PrimerInput onValueChange={handleValueChange} handleSequence={handleInputtedSequence} />
                </div>
            );
        } else if (submitted === 2) {
            return (
                <div>
                    <textbf style = {{color: '#0f3663', fontSize: "large"}}>Primer Map</textbf> 
                    <text style = {{fontSize: "small"}}> Click on the primer sequences to edit them. </text>

                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        width: '70vw',
                        height: '30vh', 
                        border: '2px solid #0f3663',  
                        marginBottom: '3vh', 
                        marginTop: '3vh'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',  
                            height: '100%'  
                        }}>
                            {mapImage ? (
                                <img 
                                    src={mapImage} 
                                    style={{
                                        height: '100%',  
                                        width: 'auto',   
                                    }} 
                                    alt="Primer Map" 
                                />
                            ) : (
                                <p>Loading Primer Map...</p>
                            )}
                        </div>
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
                            <br />
                            <br />
                            Primer Sequence: {primer.sequence}
                        </button>
                    ))}
                    <div style={{
                        backgroundColor: '#0f3663',
                        color: 'white',
                        top: '10vh',
                        right: '3vw',
                        position: 'fixed',
                        width: '16vw',
                        height: '74vh',
                        borderRadius: '5px',
                        padding: '4vh',
                        overflowWrap: 'break-word',
                        overflow: 'scroll'
                    }}>
                        <h3> Run LAMP simulation with primers:  </h3>
                        <br/>
                        <button onClick={runSimulation}>Run Simulation</button>
                        {simulationOutput && (
                            <div style={{ marginTop: '2vh' }}>
                                <h3>Simulation Output:</h3>
                                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: 'small'}}>
                                    {simulationOutput === 1
                                        ? "The simulation ran without any issues. The primers successfully passed the baseline LAMP simulation, indicating strong compatibility and reliability." 
                                        : "The simulation encountered issues, suggesting potential problems such as primer self-amplification, primer dimers, or suboptimal binding. Further optimization may be required to address these challenges."}
                                </pre>
                            </div>
                        )}

                        {error && (
                            <div style={{ color: 'red', marginTop: '2vh' }}>
                            <strong>Error:</strong> {error}
                            </div>
                        )}
                        <div>
                            <text style={{ fontSize: 'x-small', color: 'white', }}
                            > Disclaimer: This simulation provides a preliminary assessment and should not be considered definitive. It does not account for the intricate strand displacement steps inherent to the LAMP process, which are critical for accurate amplification dynamics. As such, further experimental validation is recommended to confirm the reliability of the primers under actual LAMP conditions.</text>
                        </div>
                    </div>

                    <button
                        style={{
                            backgroundColor: '#0f3663',
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            position: 'fixed',
                            top: '93vh',
                            right: '3vw'
                        }}
                        onClick={saveToFile}  
                    >
                        Save and Download
                    </button>

                    <button
                        style={{
                            backgroundColor: '#0f3663',
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            position: 'fixed',
                            top: '93vh',
                            left: '3vw'
                        }}
                        onClick={() => {
                            localStorage.clear();  
                            handleButtonClick(); 
                        }}
                    >
                        Back
                    </button>
                </div>
            );
        }
    }

    return (
        <div>
            <div style={{ fontSize: '1.2rem', color: 'black', margin: '20px' }}>
                <div style={{ backgroundColor: "white", padding: '2%', height: '75vh', borderRadius: '1%' }}>
                    <ChooseForm />
                </div>
            </div>
        </div>
    );
};

export default PrimerEditPage;
