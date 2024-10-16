import PrimerChosenForm from "../forms/PrimerEditorForm";
import PrimerInput from "../forms/PrimerInputForm";
import React, { useState, useCallback} from "react";
import primersImage from '../components/primers.png';
import './PrimerEdit.css';
import axios from 'axios';


function PrimerEditPage() {
    const [submitted, setSubmitted] = useState(0);
    const [back, setBack] = useState(false);
    const [inputtedSequence, setInputtedSequence] = useState({ fullSequence: '', primers: [] });
    const [editingPrimer, setEditingPrimer] = useState(null);  // State to hold the currently editing primer
    const [editedPrimer, setEditedPrimer] = useState({ name: '', sequence: '' }); // Initialize with an empty object
    const [simulationOutput, setSimulationOutput] = useState('');
    const [error, setError] = useState('');
    const [primers, setPrimers] = useState(inputtedSequence.primers);
    const [sequence, setSequence] = useState(inputtedSequence.fullSequence);

    const handlePrimerDrop = (index, position) => {
        // Update primer position based on drop position
        const updatedPrimers = [...primers];
        updatedPrimers[index].position = position;
        setPrimers(updatedPrimers);
    };

    const handleInputtedSequence = (fullSequence, primers) => {
        setInputtedSequence({ fullSequence, primers });
    };

    const runSimulation = useCallback(async () => {
        let sequence = inputtedSequence.fullSequence;
        let F2 = '';
        let F1c = '';
        let B2 = '';
        let B1c = '';
        inputtedSequence.primers.forEach(primer => {
            console.log(primer.name);
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
            const response = await axios.post('http://127.0.0.1:5000/run-simulation', {
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
        updateEditedPrimer(); // update primer list with edited primer
    };

    const handleValueChange = (newValue) => {
        const newSubmittedValue = newValue ? 2 : 0;
        setSubmitted(newSubmittedValue);
    };

    const handleEditPrimer = (primer) => {
        setEditingPrimer(primer);  // Set the currently editing primer
        setEditedPrimer({ name: '', sequence: '' }); // initialize edited primer for the next page
    };

    const handlePrimerChange = (name, newSequence) => {
        setEditedPrimer({ name, sequence: newSequence }); // update edited primer state
    };

    const updateEditedPrimer = () => {
        setInputtedSequence((prevState) => {
            const updatedPrimers = prevState.primers.map((primer) =>
                primer.name === editedPrimer.name ? { ...primer, sequence: editedPrimer.sequence } : primer
            );
            return { ...prevState, primers: updatedPrimers };
        });
    };

    function ChooseForm() {
        if (submitted === 0 || (back && submitted === 0) || editingPrimer) {
            if (editingPrimer) {
                return (
                    <div>
                        <PrimerChosenForm
                            inputtedSequence={editingPrimer.sequence}
                            onPrimerChange={(newSequence) => handlePrimerChange(editingPrimer.name, newSequence)}
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
                            onClick={() => handleBackFromEdit()}
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
                    <div style={{ display: 'flex' }}>
                        {/* MAP HERE */}
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
                            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{simulationOutput}</pre>
                            </div>
                        )}
                        {error && (
                            <div style={{ color: 'red', marginTop: '2vh' }}>
                            <strong>Error:</strong> {error}
                            </div>
                        )}
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
            <div style={{ fontSize: '1.2rem', color: 'black', margin: '20px' }}>
                <div style={{ backgroundColor: "white", padding: '2%', height: '75vh', borderRadius: '1%' }}>
                    <ChooseForm />
                </div>
            </div>
        </div>
    );
};

export default PrimerEditPage;
