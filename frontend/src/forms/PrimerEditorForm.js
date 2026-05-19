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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0' }}>

            {/* Top row: nucleotide grid + structure map */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                {/* Left: nucleotide buttons + edit controls */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Primer Sequence — click any base to change it
                    </div>
                    <div style={{
                        overflowY: 'auto',
                        maxHeight: '200px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '10px',
                        background: '#f8fafc',
                        marginBottom: '16px'
                    }}>
                        {input.split('').map((item, index) => (
                            <button key={index} onClick={() => handleCharacterChange(index)} title={`Position ${index + 1}: ${item}`} style={{
                                width: '36px', height: '36px',
                                backgroundColor: getColor(item),
                                margin: '2px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: 'black', fontWeight: '700',
                                fontSize: '0.85rem',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}>
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Edit controls */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Add nucleotide */}
                        <div style={{ flex: 1, minWidth: '200px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                ＋ Add Nucleotide
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Base (A/T/G/C)</label>
                                    <input
                                        type="text" maxLength={1} value={addCharacter}
                                        onChange={(e) => setAddCharacter(e.target.value.toUpperCase())}
                                        placeholder="e.g. A"
                                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1fae5', borderRadius: '6px', fontSize: '1rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Insert at position</label>
                                    <input
                                        type="number" min={0} max={input.length} value={addPosition}
                                        onChange={(e) => setAddPosition(e.target.value)}
                                        placeholder={`0–${input.length}`}
                                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1fae5', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                            <button onClick={handleAddCharacter}
                                style={{ width: '100%', padding: '9px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                                Add Base
                            </button>
                        </div>

                        {/* Delete nucleotide */}
                        <div style={{ flex: 1, minWidth: '180px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '14px' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                － Delete Nucleotide
                            </div>
                            <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '4px' }}>Position to delete</label>
                            <input
                                type="number" min={0} max={input.length - 1} value={deletePosition}
                                onChange={(e) => setDeletePosition(e.target.value)}
                                placeholder={`0–${input.length - 1}`}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '1rem', marginBottom: '8px', boxSizing: 'border-box' }}
                            />
                            <button onClick={handleCharacterDelete}
                                style={{ width: '100%', padding: '9px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                                Delete Base
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: RNA structure map */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Structure Map
                    </div>
                    <div ref={fornaRef} style={{
                        width: '42vw', height: '55vh',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#f8fafc',
                    }} />
                </div>
            </div>

            {/* Recommendations + context */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f3663', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Recommendations
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{recommendation}</div>
                </div>
                <div style={{ flex: 1, minWidth: '200px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f3663', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Flanking Context
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#475569' }}>
                        <span style={{ color: '#94a3b8' }}>Before: </span>
                        <span style={{ background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px' }}>{characters[0] || '—'}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#475569', marginTop: '6px' }}>
                        <span style={{ color: '#94a3b8' }}>After: </span>
                        <span style={{ background: '#e0f2fe', padding: '1px 4px', borderRadius: '3px' }}>{characters[1] || '—'}</span>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div>
                <button
                    style={{ background: '#0f3663', color: 'white', border: 'none', borderRadius: '8px', padding: '11px 28px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                    onClick={(e) => { e.preventDefault(); localStorage.setItem('primerInput', input); onPrimerChange(input); }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default PrimerShowPage;
