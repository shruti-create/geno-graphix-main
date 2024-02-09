import React, {useCallback} from "react";
import "./FullSequence.css"; // Import the CSS file for styling

// Make the full sequence box resizable

const FullSequence = ({ sequence, onSequenceSelect }) => {
  const logSelection = useCallback(() => {
    const selection = window.getSelection();
    const isWithinSequence = selection.anchorNode.parentNode.classList.contains('sequence');
    if (!isWithinSequence) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
    const anchorOffset = selection.anchorOffset;
    const focusOffset = selection.focusOffset;
    // getting start and end indexes of sequence for our Annotations
    const startIndex = Math.min(anchorOffset, focusOffset);
    const endIndex = Math.max(anchorOffset, focusOffset) - 1; 

    console.log('Selected sequence:', selectedText, 'Start index:', startIndex, 'End index:', endIndex);
    // sending it all back to parent file
    onSequenceSelect(selectedText, startIndex, endIndex);
  }, [onSequenceSelect]);

  return (
    <div>
      <div className="sequence-container" onMouseUp={logSelection}>
        <pre className="sequence">{sequence}</pre>
      </div>
    </div>
  );
};

export default FullSequence;
