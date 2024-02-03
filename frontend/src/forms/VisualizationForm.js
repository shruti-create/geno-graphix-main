import React, {useState} from "react";
import FullSequence from "../components/fullSequence";
import MagnifiedBox from "../components/MagnifiedBox";


function VisualizationPage({input}){
    const [selectedSequence, setSelectedSequence] = useState('');
    const handleSequenceSelect = (sequence) => {
        setSelectedSequence(sequence);
    };
    const inputSequence = 'ACTTGCCTGGACGCTGCGCCACATCCCACCGGCCCTTACACTGTGGTGTCCAGCAGCATCCGGCTTCATGGGGGGACTTGAACCCTGCAGCAGGCTCCTGCTCCTGCCTCTCCTGCTGGCTGTAAGTGGTGAGTTAGGGGCTTCCGTGGCTGCCTCCCGGGTCCCTGGGCTCAGCTTGGGGCAGGGCAGGGAGTGGGGTGGAACGAGAGACCAAAAGTGGGTGTTGGGATGGGAGCAGGTCCCCAACCTCCCAAAGCCTGTGGGTTTCTCCCAGAGCCCAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAGTTGTGCAGAAGTAACGCACATAGTCCGGTGGCCCAGACGCCAGCCCCCTGAGTCCCGCCAGACACGCTCTCCCCCTTGCTAACCTCTTGGCTGTCAGGATCCACCTTCCCTGGCTTCTAAACTTGCCTCCCCCACCCCCGTCATAACTCTGTGCCTCAGTTTACCTTCTTTTTCCTCCTCAGGTCTCCGTCCTGTCCAGGCCCAGGCCCAGAGCGGTAGGCCTAGACCCAGCAGTCCCTCTCTCTACCTCCCAGAGACCTCCCTGTCTCCGTCTCTCCCACACCCTTTCCAAACCTCCCTGCCGCTGACCCCCCTCCCCACAGTTCCCAGCACACACTGACCTCCCCTGACCCCTGTGCTGCAGATTGCAGTTGCTCTACGGTGAGCCCGGGCGTGCTGGCAGGGATCGTGATGGGAGACCTGGTGCTGACAGTGCTCATTGCCCTGGCCGTGTACTTCCTGGGCCGGCTGGTCCCTCGGGGGCGAGGGGCTGCGGAGGGTGAGTGGGGCTAGCAGGGGACATCCTGAGGACTTGCCTAGATGGGGGTGGGGGGCTGGGTAAACTCCCAGATCTCAAACATCCAAAGGGATGGTAATGGAGGTGCTGATTTGGAATGACAAAACACCCTA';

    return (
        <div>
            <p style={{ fontSize: '1.2rem', color: 'black', margin: '4vh'}}>
                <div style ={{position: "relative"}}>
                    <FullSequence sequence={input} onSequenceSelect={handleSequenceSelect}/>
                </div>
                <div style ={{position: "fixed", top: '60vh', left: '100vh'}}>
                    <MagnifiedBox sequence={selectedSequence}/>
                </div>
            </p>
        </div>
    );
};

export default VisualizationPage;
