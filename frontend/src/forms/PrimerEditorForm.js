import { SettingsRemote } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrimerShowPage(inputtedSequence) {
    const [input, setInput] = useState(String(inputtedSequence.input));
    const [addCharacter, setAddCharacter] = useState('');
    const [addPosition, setAddPosition] = useState('');
    const [deletePosition, setDeletePosition] = useState('');
    const [recommendation, setRecommendation] = useState("");
    const [sequence, setSequence] = useState(String(inputtedSequence.input));
    const [loops, setLoops] = useState([]); // found complementary sequences + biggest loops within sequences
    const [imgMap, setImgMap] = useState('');

    
    // print reccommendations for loops 
    useEffect(() => {
        if (loops.length > 0) {
            const loopSequences = loops.map(loop => loop.loopSeq).join(", ");
            const recs = recommendations(input); // Calculate recommendations based on input
            const formattedRecs = recs;
            console.log(formattedRecs);
            setRecommendation(formattedRecs);
        }
    }, [loops, input]);
    

    // write function to check all parameters of the primer and their fit with the primer rules 

    // get reverse complement for seq
    const reverseComplement = (seq) => {
        const complement = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        return seq.split('').reverse().map(nuc => complement[nuc]).join('');
    };

    // finding the loops and inputting in loops list
    const findLargestUniqueLoops = () => {

        let sequenceLength = sequence.length;
        let potentialLoops = [];

        // sequences are approximately 18-25
        for (let start = 0; start < sequenceLength; start++) {
            for (let end = start + 1; end <= sequenceLength; end++) {
                const subseq = sequence.slice(start, end);
                const subseqRevComp = reverseComplement(subseq);
                const pos = sequence.indexOf(subseqRevComp, end);
                if (pos !== -1 && pos > end) {
                    let loopSeq = sequence.substring(start, pos + subseqRevComp.length);
                    potentialLoops.push({ loopSeq, start, end: pos + subseqRevComp.length - 1 });
                }
            }
        }

        // sorts the potential loops from small to large 
        potentialLoops.sort((a, b) => b.loopSeq.length - a.loopSeq.length || b.start - a.start);
        let usedPositions = new Set();
        let largestLoops = [];

        // take the largest potential loop without no overlaps 
        for (const { loopSeq, start, end } of potentialLoops) {
            let isOverlap = false;
            for (let pos = start; pos <= end; pos++) {
                if (usedPositions.has(pos)) {
                    isOverlap = true;
                    break;
                }
            }
            if (!isOverlap) {
                largestLoops.push({loopSeq, start, end});
                for (let pos = start; pos <= end; pos++) {
                    usedPositions.add(pos);
                }
            }
        }

        // set loops variable with largest loops
        setLoops(largestLoops);
        console.log(loops);
    };


    useEffect(() => {
        setSequence(input);
        getRecs(input);
        findLargestUniqueLoops();
        displaySequenceWithLoops();
    }, [input]);

    const displaySequenceWithLoops = () => {
        let display = [];
        let loopIndex = 0;
    
        loops.sort((a, b) => a.start - b.start);
    
        console.log(loops);
    
        for (let i = 0; i < sequence.length; i++) {
            if (loopIndex < loops.length && i === loops[loopIndex].start) {
                // change - displaying the loop
                // pushing red characters instead of loop all together
                display.push(<span key={i} style={{ color: 'red' }}>{sequence.substring(i, loops[loopIndex].end +1)} -- </span>);
                i = loops[loopIndex].end; 
                loopIndex++; 
            } else {
                // if no loop, push them with dashes in between
                display.push(<span key={i}>{sequence[i]} -- </span>);
            }
        }
    
        return display;
    };

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

    function getRecs(dna) {
        findLargestUniqueLoops();
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

    const fetchQuickfoldMap = async () => {
        try {
            console.log(input);
            // Make a POST request to the server to get primers
            const response = await axios.post('http://127.0.0.1:5000/quickfold', {
                sequence: input
            });
            // Update state with forward and reverse primers
            setImgMap(response.data.results_img)
            console.log("Image URL", imgMap);
        } catch (error) {
            console.error('Error fetching manipulated sequence', error);
        }
    };

    React.useEffect(() => {
        if (inputtedSequence) fetchQuickfoldMap();
    }, [inputtedSequence]);

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
                        // when click on character, then user can change character
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
                    <div style = {{marginTop: '5vh', position: 'relative'}}>
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
                    <img id="imgMap" src={imgMap} ></img>
                </div>
            </div>
            <div style = {{
                    padding: '1%', 
                    height: '25vh',
                    width: '45vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    padding: '1%',
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
