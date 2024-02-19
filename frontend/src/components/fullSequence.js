import React, {useCallback} from "react";
import "./FullSequence.css"; // Import CSS file for styling

// FullSequence component displays the entire DNA sequence in a resizable box.
// It allows users to select a portion of the sequence, logs the selection, 
// and sends the selected text along with start and end indices back to the parent component.
const FullSequence = ({ sequence, onSequenceSelect }) => {
  const logSelection = useCallback(() => {
    const selection = window.getSelection();
    const isWithinSequence = selection.anchorNode.parentNode.classList.contains('sequence');
    if (!isWithinSequence) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
    
    // Calculate start and end indices for the selected sequence
    const anchorOffset = selection.anchorOffset;
    const focusOffset = selection.focusOffset;
    
    // Getting start and end indexes of sequence for our Annotations
    const startIndex = Math.min(anchorOffset, focusOffset);
    const endIndex = Math.max(anchorOffset, focusOffset) - 1; 

    console.log('Selected sequence:', selectedText, 'Start index:', startIndex, 'End index:', endIndex);
    
    // Sending it all back to parent file
    onSequenceSelect(selectedText, startIndex, endIndex);
  }, [onSequenceSelect]);

   // JSX for rendering the component
  return (
    <div>
      <div className="sequence-container" onMouseUp={logSelection}>
        <pre className="sequence">{sequence}</pre>
      </div>
    </div>
  );
};

export default FullSequence;
