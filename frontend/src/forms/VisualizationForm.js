import React, { useState } from "react";
import FullSequence from "../components/fullSequence";
import MagnifiedBox from "../components/MagnifiedBox";
import "./VisualizationForm.css";

function VisualizationPage({ input }) {
  const [selectedSequence, setSelectedSequence] = useState("");
  const [selected, setSelected] = useState(false);
  const handleSequenceSelect = (sequence) => {
    setSelectedSequence(sequence);
    setSelected(true);
  };
  const inputSequence =
    "ACTTGCCTGGACGCTGCGCCACATCCCACCGGCCCTTACACTGTGGTGTCCAGCAGCATCCGGCTTCATGGGGGGACTTGAACCCTGCAGCAGGCTCCTGCTCCTGCCTCTCCTGCTGGCTGTAAGTGGTGAGTTAGGGGCTTCCGTGGCTGCCTCCCGGGTCCCTGGGCTCAGCTTGGGGCAGGGCAGGGAGTGGGGTGGAACGAGAGACCAAAAGTGGGTGTTGGGATGGGAGCAGGTCCCCAACCTCCCAAAGCCTGTGGGTTTCTCCCAGAGCCCAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAGTTGTGCAGAAGTAACGCACATAGTCCGGTGGCCCAGACGCCAGCCCCCTGAGTCCCGCCAGACACGCTCTCCCCCTTGCTAACCTCTTGGCTGTCAGGATCCACCTTCCCTGGCTTCTAAACTTGCCTCCCCCACCCCCGTCATAACTCTGTGCCTCAGTTTACCTTCTTTTTCCTCCTCAGGTCTCCGTCCTGTCCAGGCCCAGGCCCAGAGCGGTAGGCCTAGACCCAGCAGTCCCTCTCTCTACCTCCCAGAGACCTCCCTGTCTCCGTCTCTCCCACACCCTTTCCAAACCTCCCTGCCGCTGACCCCCCTCCCCACAGTTCCCAGCACACACTGACCTCCCCTGACCCCTGTGCTGCAGATTGCAGTTGCTCTACGGTGAGCCCGGGCGTGCTGGCAGGGATCGTGATGGGAGACCTGGTGCTGACAGTGCTCATTGCCCTGGCCGTGTACTTCCTGGGCCGGCTGGTCCCTCGGGGGCGAGGGGCTGCGGAGGGTGAGTGGGGCTAGCAGGGGACATCCTGAGGACTTGCCTAGATGGGGGTGGGGGGCTGGGTAAACTCCCAGATCTCAAACATCCAAAGGGATGGTAATGGAGGTGCTGATTTGGAATGACAAAACACCCTA";

  return (
    <div>
      <h2>Genomic Sequence</h2>
      <div style={{ fontSize: "1.2rem", color: "black", margin: "20px" }}>
        <div class="container">
          <div class="component">
            <FullSequence
              sequence={input}
              onSequenceSelect={handleSequenceSelect}
            />
          </div>
          <div class="component">
            <MagnifiedBox sequence={selectedSequence}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizationPage;
