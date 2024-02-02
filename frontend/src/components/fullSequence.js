import React, {useCallback} from "react";
import "./FullSequence.css"; // Import the CSS file for styling

const FullSequence = ({ sequence, onSequenceSelect }) => {
  const logSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const isWithinSequence = selection.anchorNode.parentNode.classList.contains('sequence');
    
    if (selectedText && isWithinSequence) {
      console.log('Selected sequence:', selectedText);
      onSequenceSelect(selectedText);
    }
  }, []);

  return (
    <div>
      <h2>Genomic Sequence</h2>
      <div className="sequence-container" onMouseUp={logSelection}>
        <pre className="sequence">{sequence}</pre>
      </div>
    </div>
  );
};

export default FullSequence;
