import React, {useState, useEffect, useCallback} from "react";
import "./FullSequence.css"; // Import the CSS file for styling

// FullSequence component displays the entire DNA sequence in a resizable box.
// It allows users to select a portion of the sequence, logs the selection, 
// and sends the selected text along with start and end indices back to the parent component.
const FullSequence = ({ sequence, onSequenceSelect, annotations }) => {
  const [formattedAnnotations, setFormattedAnnotations] = useState([]);

  useEffect(() => {
    if (!annotations) {
      console.log("No annotation received: ", annotations);
      return;
    }

    console.log("Annotation received: ", annotations);

    const formatted = annotations.map(({ start, end, type }) => {
      return {
        start,
        end,
        type,
      };
    });

    setFormattedAnnotations(formatted);
    // console.log("Formatted annotation: ", formatted);
  }, [annotations]);

  const renderSequenceWithAnnotations = () => {
    let result = [];
    let lastIndex = 0;


    formattedAnnotations.forEach(({ start, end, type }, index) => {
      const annotatedPart = sequence.slice(start, end);

      // Add the unannotated part of the sequence
      result.push(sequence.slice(lastIndex, start));
      // Add the annotated part with appropriate styling
      if (type === "Highlight") {
        result.push(
          <span
            key={index}
            style={{ backgroundColor: "#f8eb88" }}
          >
            {annotatedPart}
          </span>
        );
      } else if (type === "Underline") {

        result.push(
          <span
            key={index}
            style={{ borderBottom: "2px solid #634c89f0" }}
          >
            {annotatedPart}
          </span>
        );
      }

      lastIndex = end;
    });

    // Add the remaining unannotated part of the sequence
    result.push(sequence.slice(lastIndex));
    console.log("Annotations: ", formattedAnnotations);
    return result;
  };

  const logSelection = useCallback(() => {
    const selection = window.getSelection();
    const isWithinSequence = selection.anchorNode.parentElement.closest('.sequence-container');
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
        <pre className="sequence">{renderSequenceWithAnnotations()}</pre>
      </div>
    </div>
  );
};

export default FullSequence;
