import React from "react";
import "./FullSequence.css"; // Import the CSS file for styling

const FullSequence = ({ sequence }) => {
  return (
    <div>
      <h2>Genomic Sequence</h2>
      <div className="sequence-container">
        <pre className="sequence">{sequence}</pre>
      </div>
    </div>
  );
};

export default FullSequence;
