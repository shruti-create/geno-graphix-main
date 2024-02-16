import React from "react";

const AnnotationBox = ( {onAnnotationSelect}) => {
  
    return (
      <div>
          <p>Pick an annotation type to do on the sequence:</p>
          <button onClick={() => onAnnotationSelect('Highlight')}>Highlight</button>
          <button onClick={() => onAnnotationSelect('Underline')}>Underline</button>
      </div>
  );
};

export default AnnotationBox;
