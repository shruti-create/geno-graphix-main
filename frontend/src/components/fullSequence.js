import React, { useState, useEffect, useCallback } from "react";
import "./FullSequence.css"; // Import the CSS file for styling

// FullSequence component displays the entire DNA sequence in a resizable box.
// It allows users to select a portion of the sequence, logs the selection,
// and sends the selected text along with start and end indices back to the parent component.
const FullSequence = ({ sequence, onSequenceSelect, annotations }) => {
  const [formattedAnnotations, setFormattedAnnotations] = useState([]);
  const sortedAnnotations = annotations ? annotations.sort((a, b) => a.start - b.start) : [];


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
  }, [annotations]);

  function addComplements() {
    let lines = sequence.match(/.{1,40}/g); // Split the sequence into lines of 40 characters, make this dynamic later
    let results = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let complement = line
            .split('')
            .map(base => {
                switch (base) {
                    case 'A': return 'T';
                    case 'T': return 'A';
                    case 'C': return 'G';
                    case 'G': return 'C';
                    default: return base;
                }
            })
            .join('');

        results +=`3' ${line} 5'\n`;

        results += `5' ${complement} 3'\n\n`;
    }
    return results;
  }
  // TODO: Fix case when overlapping with existing annotation
  // TODO: Fix case when annotation button is clicked multiple times on the same selection
  // TODO: Remove annotation that are the same in the annotations array

  const renderSequenceWithAnnotations = () => {
    let result = [];
    let lastEnd = 0;
    let lastStart = 0;
    let lastType = '';
    let withComp = addComplements();

    // Sort the annotations by start index in ascending order
    const sortedAnnotations = formattedAnnotations.sort(
      (a, b) => a.start - b.start
    );

    sortedAnnotations.forEach(({ start, end, type }, index) => {
      
      const annotatedPart = withComp.slice(start, end);

      console.log(start, end, annotatedPart);
      noChange:if (start < lastEnd){  // Overlap detected since start index is within previous one last index
        
        if (end <= lastEnd){   // Overlap is in the middle the previous annotation

          if (index > 0) {
            lastType = sortedAnnotations[index - 1].type;
          }
          else{
            lastType = type;
          }
          console.log(lastType, type);
          if(lastType === type){
            console.log("same annotation");
            break noChange;
          }
          else{
            result.push(  //Push beginning of last annotation from last start to the start of new annotation
              <span
                key={`${lastStart}-${start}`}
                style={{
                  backgroundColor: (lastType[0] === "#") ? (lastType) : undefined,
                  borderBottom: (lastType) === "Underline" ? "2px solid #634c89f0" : undefined,
                  fontWeight: (lastType) === "Bold" ? "bold" : undefined,
                  textDecoration: (lastType) === "StrikeThrough" ? "line-through" : undefined,
                }}
                className="sequence"
              >
                {withComp.slice(lastStart, start)}
              </span>
            );
            result.push(  //Push the overlapping part
              <span
                key={`${start}-${end}`}
                style={{
                  backgroundColor: (lastType[0] === "#" || type[0] === "#") ? (lastType || type) : undefined,
                  borderBottom: (lastType||type) === "Underline" ? "2px solid #634c89f0" : undefined,
                  fontWeight: (lastType||type) === "Bold" ? "bold" : undefined,
                  textDecoration: (lastType||type) === "StrikeThrough" ? "line-through" : undefined,
                }}
                className="sequence"
              >
                {withComp.slice(start, end)}
              </span>
            );
            result.push( //Push the rest of the previous annotation
              <span
                key={`${end}-${lastEnd}`}
                style={{
                  backgroundColor: (lastType[0] === "#") ? (lastType) : undefined,
                  borderBottom: (lastType) === "Underline" ? "2px solid #634c89f0" : undefined,
                  fontWeight: (lastType) === "Bold" ? "bold" : undefined,
                  textDecoration: (lastType) === "StrikeThrough" ? "line-through" : undefined,
                }}
                className="sequence"
              >
                {withComp.slice(end, lastEnd)}
              </span>
            );
          }
        }
        else{   //Overlap ends after previous annotation
          result.push(  //Push the previous annotation from its start to the start of overlap
            <span
              key={`${lastStart}-${start}`}
              style={{
                backgroundColor: (lastType[0] === "#") ? (lastType) : undefined,
                borderBottom: (lastType) === "Underline" ? "2px solid #634c89f0" : undefined,
                fontWeight: (lastType) === "Bold" ? "bold" : undefined,
                textDecoration: (lastType) === "StrikeThrough" ? "line-through" : undefined,
              }}
              className="sequence"
            >
              {withComp.slice(lastStart, start)}
            </span>
          );
          result.push(  //Push overlapping part
            <span
              key={`${lastStart}-${start}`}
              style={{
                backgroundColor: (lastType[0] === "#") ? (lastType) : undefined,
                borderBottom: (lastType) === "Underline" ? "2px solid #634c89f0" : undefined,
                fontWeight: (lastType) === "Bold" ? "bold" : undefined,
                textDecoration: (lastType) === "StrikeThrough" ? "line-through" : undefined,
              }}
              className="sequence"
            >
              {withComp.slice(start, end)}
              {withComp.slice(lastStart, start)}
            </span>
          );
          result.push(  //Push overlapping part
            <span
              key={`${start}-${end}`}
              style={{
                backgroundColor: (lastType[0] === "#" || type[0] === "#") ? (lastType || type) : undefined,
                borderBottom: (lastType||type) === "Underline" ? "2px solid #634c89f0" : undefined,
                fontWeight: (lastType||type) === "Bold" ? "bold" : undefined,
                textDecoration: (lastType||type) === "StrikeThrough" ? "line-through" : undefined,
              }}
              className="sequence"
            >
              {withComp.slice(end, sortedAnnotations[index-1].end)}
              {withComp.slice(start, end)}
            </span>
          );
        }
      }

      // No overlap so add the annotated part of the sequence
      else{
      result.push(withComp.slice(lastIndex, start));
      result.push(withComp.slice(lastEnd, start));

        // Add the annotated part with appropriate styling
        result.push(
          <span
            key={`${start}-${end}`}
            style={{
              backgroundColor: type[0] === "#" ? type : undefined,
              borderBottom: type === "Underline" ? "2px solid #634c89f0" : undefined,
              fontWeight: type === "Bold" ? "bold" : undefined,
              textDecoration: type === "StrikeThrough" ? "line-through" : undefined,
            }}
            className="sequence"
          >
            {annotatedPart}
          </span>
        );
      }

      lastEnd = end;
      lastStart = start;
    });

    // Add the remaining unannotated part of the sequence
    result.push(withComp.slice(lastIndex));
    result.push(withComp.slice(lastEnd));
    console.log("Annotations: ", formattedAnnotations);
    return result;
  };


  // Sets the start and end index based on user highlighted on the sequence 
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
  
    if (selectedText === "Delete") {
      // Delete the selected portion of the sequence
      const updatedSequence = sequence.slice(0, startIndex) + sequence.slice(endIndex);
      console.log("Updated sequence:", updatedSequence);
      console.log("Start Index:", startIndex);
      onSequenceSelect(updatedSequence, startIndex, startIndex);
    } else {
      //Inform the parent about the regular annotation
      onSequenceSelect(selectedText, startIndex, endIndex);
    }

  }, [onSequenceSelect]);
  

  // JSX for rendering the component
  return (
    <div>
      <div className="sequence-container" onMouseUp={logSelection}>
        <pre className="sequence">{renderSequenceWithAnnotations()}</pre>
        {/* <pre>{displayDNASequence()}</pre> */}
      </div>
    </div>
  );
};

export default FullSequence;