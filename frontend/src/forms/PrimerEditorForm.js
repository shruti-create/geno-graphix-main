import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrimerShowPage(inputtedSequence) {
    const [input, setInput] = useState(String(inputtedSequence.input));
    const [addCharacter, setAddCharacter] = useState('');
    const [addPosition, setAddPosition] = useState('');
    const [deletePosition, setDeletePosition] = useState('');
    const [recommendation, setRecommendation] = useState("");

    useEffect(() => {
        getRecs(input);
    }, [input]);

    function getColor(character) {
        if (character === 'A' || character === 'a') {
            return 'red';
        } else if (character === 'C' || character === 'c') {
            return 'green';
        } else if (character === 'G' || character === 'g') {
            return 'yellow';
        } else {
            return 'blue';
        }
    }

    function getRecs(input) {
        const complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'};
        const reverseComp = input.split('').map(char => complement[char.toUpperCase()] || char).reverse().join('');

        if (input.includes(reverseComp)) {
            setRecommendation("Possible self-amplification detected due to presence of inverted nucleotides.");
        } else {
            setRecommendation("No obvious self-amplification detected.");
        }
    }

    function handleCharacterChange(index) {
        const newChar = prompt(`Enter new character for position ${index + 1}`, input[index]);
        if (newChar !== null && newChar.length === 1) {
            const updatedInput = input.substring(0, index) + newChar + input.substring(index + 1);
            setInput(updatedInput);
        }
    }

    function handleCharacterDelete() {
        const index = parseInt(deletePosition);
        if (!isNaN(index) && index >= 0 && index <= input.length) {
            const updatedInput = input.substring(0, index) + input.substring(index + 1);
            setAddCharacter('');
            setAddPosition('');
            setInput(updatedInput);
        }
    }

    function handleAddCharacter() {
        const position = parseInt(addPosition);
        if (addCharacter && !isNaN(position) && position >= 0 && position <= input.length) {
            const updatedInput = input.substring(0, position) + addCharacter + input.substring(position);
            setInput(updatedInput);
            setAddCharacter('');
            setAddPosition('');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1%' }}>
                <div style={{
                    overflowY: 'scroll',
                    height: '20vh',
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
                </div>
                <div style={{
                    height: '20vh',
                    width: '43vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    padding: '1%',
                    overflowY: 'auto', 
                }}>
                    <h3>Recommendations</h3>
                    <div>{recommendation}</div>
                </div>
            </div>
            <div style = {{padding: '1%' }}>
                <label>Add Character: </label>
                <input type="text" value={addCharacter} onChange={(e) => setAddCharacter(e.target.value)} />
                <label> Position: </label>
                <input type="number" value={addPosition} onChange={(e) => setAddPosition(e.target.value)} />
                <button onClick={handleAddCharacter}>Add</button>
                <br/>
                <label>Delete Character: </label>
                <input type="number" value={deletePosition} onChange={(e) => setDeletePosition(e.target.value)} />
                <button onClick={handleCharacterDelete}>Delete</button>
            </div>
            <div style = {{padding: '1%' }}>
                Map: 
            </div>
        </div>
    );
}

export default PrimerShowPage;
