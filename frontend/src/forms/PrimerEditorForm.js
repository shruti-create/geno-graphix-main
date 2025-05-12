import React, { useState, useEffect, useCallback , useRef} from 'react';
import axios from 'axios';
import './PrimerEditorForm.css'
import BACKEND_URL from '../config';
import { FornaContainer } from 'fornac';



function PrimerShowPage({sequence, inputtedSequence, onPrimerChange }) {
    const [characters, setCharacters]= useState([]);
    const [input, setInput] = useState(inputtedSequence || '');  
    const [addCharacter, setAddCharacter] = useState('');
    const [addPosition, setAddPosition] = useState('');
    const [deletePosition, setDeletePosition] = useState('');
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState("");

    const fornaRef = useRef(null);
    const [fornaContainer, setFornaContainer] = useState(null);
    const [structure, setStructure] = useState('');

    useEffect(() => {
    if (fornaRef.current) {
        const fc = new FornaContainer(fornaRef.current, {
        allowPanningAndZooming: true,
        zoomOnScroll: true,
        });
        setFornaContainer(fc);
    }
    }, []);
    useEffect(() => {
        const cachedInput = localStorage.getItem('primerInput');
        if (cachedInput) {
            setInput(cachedInput);  
        }
    }, []); 
    useEffect(() => {
        if (inputtedSequence) {
            setInput(inputtedSequence);
        }
    }, [inputtedSequence]);
    
    useEffect(() => {
        if (!input || !sequence) return;
      
        const len = input.length;
        const threshold = 0.5; 
      
        let matchIndex = -1;
        let bestScore = 0;
      
        for (let i = 0; i <= sequence.length - len; i++) {
          const window = sequence.slice(i, i + len);
      
          let matches = 0;
          for (let j = 0; j < len; j++) {
            if (window[j] === input[j]) matches++;
          }
      
          const score = matches / len;
          if (score >= threshold && score > bestScore) {
            bestScore = score;
            matchIndex = i;
          }
        }
      
        console.log(`Best fuzzy score: ${bestScore} at index ${matchIndex}`);
        if (matchIndex === -1) return;
      
        const before = sequence.slice(
          Math.max(0, matchIndex - 3),
          matchIndex
        );
        const after = sequence.slice(
          matchIndex + len,
          matchIndex + len + 3
        );
      
        setCharacters([before, after]);
      }, [input, sequence]);
      
    
      
    const handleMapLoad = (() =>{
        const iframe = document.getElementById("imgMap");
        const loadingMessage = document.getElementById("loadingMessage");
    })
    
    useEffect(() => {
        handleMapLoad();
      }, []);
   

    const fetchSequenceStructure = useCallback(async () => {
        if (!input) {
            return;
        }
    
        try {
            const response = await axios.post(`${BACKEND_URL}/update-sequence`, {
                sequence: input
            });
            const { structure, sequence } = response.data;
            console.log('Received structure:', structure);
            setStructure(structure);    
        } catch (error) {
            console.error('Error fetching sequence structure:', error);
            setError('Failed to fetch RNA structure.');
        }
    }, [input]);
    

    useEffect(() => {
        if (!fornaRef.current || !input || !structure) return;
      
        const trimmed = structure.trim();
        if (trimmed.length !== input.length) {
          console.error(
            `Length mismatch: input=${input.length}, structure=${trimmed.length}`
          );
          setError(
            `Sequence/structure length mismatch: ${input.length} vs ${trimmed.length}`
          );
          return;
        }
      
        fornaRef.current.innerHTML = "";
      
        const fc = new FornaContainer(fornaRef.current, {
          allowPanningAndZooming: true,
          zoomOnScroll: true,
        });
      
        try {
          console.log(
            'Drawing with:',
            'input length =', input.length, input,
            'structure length =', trimmed.length, JSON.stringify(trimmed)
          );
          fc.addRNA(trimmed, {
            sequence: input,
            name: 'primer-structure',
            charHeight: 12,
            charWidth: 8,
            color: ({ base }) =>
              ({ A: '#c00', C: '#0a0', G: '#00c', T: '#aa0' }[base] || '#888'),
          });

          setFornaContainer(fc); 
        } catch (err) {
          console.log('forna container:', fornaContainer);
          console.error("Forna render error:", err);
          setError("Failed to render structure: " + err.message);
        }
      }, [input, structure]);
      

    useEffect(() => {
        setRecommendation(recommendations(input)); 
        fetchSequenceStructure();
    }, [ input]);
    useEffect(() => {
        if (input) {
            fetchSequenceStructure();
        }
    }, [input, fetchSequenceStructure]);
    
    
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
        if (recs.length === 0){
            recs.push('No recommendations at this moment. ')
        }
        recs.push("Refer to the map on the right for information about potential loops forming in the sequence. ")
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
            localStorage.setItem('primerInput', updatedInput);  
        }
    }

    function handleCharacterDelete() {
        const index = parseInt(deletePosition);
        if (!isNaN(index) && index >= 0 && index < input.length) {
            const updatedInput = input.substring(0, index) + input.substring(index + 1);
            setInput(updatedInput);
            localStorage.setItem('primerInput', updatedInput);  
        }
    }

    
    function handleAddCharacter() {
        const position = parseInt(addPosition);
        if (addCharacter && !isNaN(position) && position >= 0 && position <= input.length) {
            const updatedInput = input.substring(0, position) + addCharacter + input.substring(position);
            setInput(updatedInput);
            localStorage.setItem('primerInput', updatedInput); 
        }
    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{
                    overflowY: 'scroll',
                    height: '30vh',
                    width: '43vw',
                    borderRadius: '1vh',
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
                    <div style={{ marginTop: '25vh', position: 'fixed' }}>
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
                
                <div id="mapContainer">
                    <div></div>
                    {/*<p id="loadingMessage" style = {{paddingLeft: '1vw'}}>Map Loading...</p>*/}
                    <div
                        ref={fornaRef}
                        style={{
                        width: '45vw',
                        height: '65vh',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginBottom: '4vh'
                        }}
                    >
                    </div>
                   
                </div>
                                
            </div>
            <div style={{
                padding: '1%',
                height: '25vh',
                width: '43vw',
                borderRadius: '1vh',
                borderWidth: '0.02vh',
                borderStyle: 'solid',
                overflowY: 'auto',
                marginTop: '37vh',
                position: 'absolute'
            }}>
                <h3>Recommendations</h3>
                <div style={{ whiteSpace: 'pre-line' }}>{recommendation}</div>
                <h3>Characters before and after the primer</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px' }}>
                        Before: {characters[0]}
                    </div>
                    <div>
                        After: {characters[1]}
                    </div>
                </div>
             </div>
            <button 
                style={{
                    backgroundColor: '#0f3663',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    top: '20vh',
                }}
                onClick={(event) => {
                    event.preventDefault();  
                    localStorage.setItem('primerInput', input);  
                    onPrimerChange(input); 
                    
                }}
            >
                Save
            </button>
        </div>
    );
}

export default PrimerShowPage;
