import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function PrimerShowPage({ inputtedSequence, onPrimerChange }) {
    const [input, setInput] = useState(String(inputtedSequence));
    const [addCharacter, setAddCharacter] = useState('');
    const [addPosition, setAddPosition] = useState('');
    const [deletePosition, setDeletePosition] = useState('');
    const [recommendation, setRecommendation] = useState("");
    const [imgMap, setImgMap] = useState('');
    const [updatedPrimer, setUpdatedPrimer] = useState(null);

    // Memoized fetch function to avoid re-creation on each render
    const fetchQuickfoldMap = useCallback(async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/quickfold', {
                sequence: input
            });
            setImgMap(response.data.results_img);
            console.log("Image URL", response.data.results_img);
        } catch (error) {
            console.error('Error fetching manipulated sequence', error);
        }
    }, [input]);

    useEffect(() => {
        setRecommendation(recommendations(input));
        fetchQuickfoldMap();
    }, [input]);

    function recommendations(primer) {
        const gc_content = calculateGCContent(primer);
        const temperature = calculateMeltingTemperature(primer);
        const recs = [];

        if (gc_content < 0.3) {
            const to_add_gc = Math.ceil((0.3 - gc_content) * primer.length);
            recs.push(`GC content is below the optimal range: Add ${to_add_gc} GC bases.`);
        } else if (gc_content > 0.7) {
            const to_remove_gc = Math.ceil((gc_content - 0.7) * primer.length);
            recs.push(`GC content is above the optimal range: Remove ${to_remove_gc} GC bases.`);
        }

        if (temperature < 50) {
            const to_increase_temp = Math.ceil((50 - temperature) / 2);
            recs.push(`Temperature is below the optimal range: Increase the temperature by ${to_increase_temp} degrees.`);
        } else if (temperature > 64) {
            const to_decrease_temp = Math.ceil((temperature - 64) / 2);
            recs.push(`Temperature is above the optimal range: Decrease the temperature by ${to_decrease_temp} degrees.`);
        }

        return recs;
    }

    function calculateGCContent(primer) {
        const gc_count = Array.from(primer).filter(base => base === 'G' || base === 'C').length;
        return gc_count / primer.length;
    }

    function calculateMeltingTemperature(primer) {
        const a_count = (primer.match(/A/g) || []).length;
        const t_count = (primer.match(/T/g) || []).length;
        const c_count = (primer.match(/C/g) || []).length;
        const g_count = (primer.match(/G/g) || []).length;
        return 4 * (g_count + c_count) + 2 * (a_count + t_count);
    }

    function getColor(character) {
        return {
            'A': 'red', 'a': 'red',
            'C': 'green', 'c': 'green',
            'G': 'yellow', 'g': 'yellow',
            'T': 'blue', 't': 'blue'
        }[character] || 'grey';
    }

    function handleCharacterChange(index) {
        const newChar = prompt(`Enter new character for position ${index + 1}`, input[index]);
        if (newChar && newChar.length === 1) {
            const updatedInput = input.substring(0, index) + newChar + input.substring(index + 1);
            setInput(updatedInput);
           
        }
    }
    
    function handleCharacterDelete() {
        const index = parseInt(deletePosition);
        if (!isNaN(index) && index >= 0 && index < input.length) {
            const updatedInput = input.substring(0, index) + input.substring(index + 1);
            setInput(updatedInput);
            
        }
    }

    function handleAddCharacter() {
        const position = parseInt(addPosition);
        if (addCharacter && !isNaN(position) && position >= 0 && position <= input.length) {
            const updatedInput = input.substring(0, position) + addCharacter + input.substring(position);
            setInput(updatedInput);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{
                    overflowY: 'scroll',
                    height: '30vh',
                    width: '45vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: '1%'
                }}>
                    {input.split('').map((item, index) => (
                        <button key={index} onClick={() => handleCharacterChange(index)} style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: getColor(item),
                            margin: '2px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontWeight: 'bold'
                        }}>
                            {item}
                        </button>
                    ))}
                    <div style={{ marginTop: '5vh', position: 'relative' }}>
                        <label>Add Character: </label>
                        <input type="text" value={addCharacter} onChange={(e) => setAddCharacter(e.target.value)} />
                        <label> Position: </label>
                        <input type="number" value={addPosition} onChange={(e) => setAddPosition(e.target.value)} />
                        <button onClick={handleAddCharacter}>Add</button>
                        <br />
                        <label>Delete Character: </label>
                        <input type="number" value={deletePosition} onChange={(e) => setDeletePosition(e.target.value)} />
                        <button onClick={handleCharacterDelete}>Delete</button>
                    </div>
                </div>
                <div style={{
                    height: '60vh',
                    width: '42vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    padding: '1%',
                    overflowY: 'auto'
                }}>
                    <h3> Map: </h3>
                    <img id="imgMap" src={imgMap} alt="Quickfold Map" />
                </div>
            </div>
            <div style={{
                padding: '1%',
                height: '25vh',
                width: '45vw',
                borderRadius: '1vh',
                borderColor: 'purple',
                borderWidth: '0.02vh',
                borderStyle: 'solid',
                overflowY: 'auto',
                marginTop: '34vh',
                position: 'absolute'
            }}>
                <h3>Recommendations</h3>
                <div style={{ whiteSpace: 'pre-line' }}>{recommendation}</div>
            </div>
        </div>
    );
}

export default PrimerShowPage;
