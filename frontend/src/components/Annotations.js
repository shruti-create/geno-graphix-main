import React from "react";

// AnnotationBox component handles annotation type selection.
const AnnotationBox = ( {onAnnotationSelect}) => {
    return (
      <div>
          <p>Pick an annotation type to do on the sequence:</p>
          <div style = {{border: "0.1vh solid black", padding: "2%", borderRadius: "1vh", height: "20vh"}}>
            <button onClick={() => onAnnotationSelect('Highlight')}>Highlight</button>
            <button onClick={() => onAnnotationSelect('Underline')}>Underline</button>
          </div>
      </div>
  );
};

export default AnnotationBox;
