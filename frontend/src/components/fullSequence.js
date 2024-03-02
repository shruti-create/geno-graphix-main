import React, { useState, useEffect, useCallback } from "react";
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

  // TODO: Fix case when overlapping with existing annotation
  // TODO: Fix case when annotation button is clicked multiple times on the same selection

  const renderSequenceWithAnnotations = () => {
    let result = [];
    let lastIndex = 0;
    let lastType = '';

    // Sort the annotations by start index in ascending order
    const sortedAnnotations = formattedAnnotations.sort(
      (a, b) => a.start - b.start
    );

    sortedAnnotations.forEach(({ start, end, type }, index) => {
      const annotatedPart = sequence.slice(start, end);
      if ( start <= lastIndex){  // Current annotation is start in previous annotation
        result.pop();
        if (end < lastIndex){   // If the current annotation is in the middle the previous annotation
          result.push(
            <span
              key={index`-overlap`}
              style={{
                backgroundColor: lastType[0] === "#" ? lastType : undefined,
                borderBottom:
                  lastType === "Underline" ? "2px solid #634c89f0" : undefined,
                fontWeight: lastType === "Bold" ? "bold" : undefined,
                textDecoration:
                  lastType === "StrikeThrough" ? "line-through" : undefined,
              }}
              className="sequence"
            >
              {sequence.slice(sortedAnnotations[index-1].end, start)}
            </span>
          )
          result.push(
            <span
              key={index`-overlap`}
              style={{
                backgroundColor: type[0] === "#" ? type : undefined,
                borderBottom:
                type === "Underline" ? "2px solid #634c89f0" : undefined,
                fontWeight: type === "Bold" ? "bold" : undefined,
                textDecoration:
                type === "StrikeThrough" ? "line-through" : undefined,
              }}
              className="sequence"
            >
              {sequence.slice(start, end)}
            </span>
          )
        }
        else{
          if(lastType === type){
            return;
          }
          else{

          }
        }
      }

      // Add the unannotated part of the sequence
      result.push(sequence.slice(lastIndex, start));
      // Add the annotated part with appropriate styling
      result.push(
        <span
          key={index}
          style={{
            backgroundColor: type[0] === "#" ? type : undefined,
            borderBottom:
              type === "Underline" ? "2px solid #634c89f0" : undefined,
            fontWeight: type === "Bold" ? "bold" : undefined,
            textDecoration:
              type === "StrikeThrough" ? "line-through" : undefined,
          }}
          className="sequence"
        >
          {annotatedPart}
        </span>
      );

      lastIndex = end;
      lastType = type;
    });

    // Add the remaining unannotated part of the sequence
    result.push(sequence.slice(lastIndex));
    console.log("Annotations: ", formattedAnnotations);
    return result;
  };

  const logSelection = useCallback(() => {
    const selection = window.getSelection();
    const isWithinSequence = selection.anchorNode.parentElement.closest(
      ".sequence-container"
    );
    if (!isWithinSequence) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
  
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(document.querySelector(".sequence-container"));
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startIndex = preSelectionRange.toString().length;
  
    const endIndex = startIndex + selectedText.length;
  
    console.log(
      "Selected sequence:",
      selectedText,
      "Start index:",
      startIndex,
      "End index:",
      endIndex
    );
  
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
