import React, { useState, useEffect } from 'react';

function PrimerShowPage(inputtedSequence) {
    const [input, setInput] = useState(String(inputtedSequence.input));
    const [addCharacter, setAddCharacter] = useState('');
    const [addPosition, setAddPosition] = useState('');
    const [deletePosition, setDeletePosition] = useState('');
    const [recommendation, setRecommendation] = useState("");
    const [sequence, setSequence] = useState(String(inputtedSequence.input));
    const [loops, setLoops] = useState([]);

    

    useEffect(() => {
        if (loops.length > 0) {
            const loopSequences = loops.map(loop => loop.loopSeq).join(", ");
            setRecommendation(loopSequences);
        }
    }, [loops]);

    const reverseComplement = (seq) => {
        const complement = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        return seq.split('').reverse().map(nuc => complement[nuc]).join('');
    };

    const findLargestUniqueLoops = () => {

        let sequenceLength = sequence.length;
        let potentialLoops = [];

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

        potentialLoops.sort((a, b) => b.loopSeq.length - a.loopSeq.length || b.start - a.start);
        let usedPositions = new Set();
        let largestLoops = [];

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
                display.push(<span key={i} style={{ color: 'red' }}>{sequence.substring(i, loops[loopIndex].end +1)} -- </span>);
                i = loops[loopIndex].end; 
                loopIndex++; 
            } else {
                display.push(<span key={i}>{sequence[i]} -- </span>);
            }
        }
    
        return display;
    };
    

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
                    height: '30vh',
                    width: '42vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    padding: '1%',
                    overflowY: 'auto'
                }}>
                    <h3>Recommendations</h3>
                    <div> Potential Self Amplifying Regions: {recommendation}</div>
                </div>
            </div>
            <div style = {{
                    padding: '1%', 
                    height: '28vh',
                    width: '90vw',
                    borderRadius: '1vh',
                    borderColor: 'purple',
                    borderWidth: '0.02vh',
                    borderStyle: 'solid',
                    padding: '1%',
                    overflowY: 'auto', 
                    marginTop: '2vh'}}>
                <h3> Map: </h3>
                <div> Shows the potentially self amplifying regions in red. </div>
                <br/>
                <div>{displaySequenceWithLoops()}</div>
            </div>
        </div>
    );
}

export default PrimerShowPage;
