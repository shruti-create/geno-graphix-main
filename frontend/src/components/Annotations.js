import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox } from '@fortawesome/free-solid-svg-icons';

// AnnotationBox component handles annotation type selection.
const AnnotationBox = ( {onAnnotationSelect}) => {
    return (
    <div>
      <p>Pick an annotation type to do on the sequence:</p>
      <div style={{ position: 'relative', border: "0.1vh solid black", padding: "2%", borderRadius: "1vh", height: "20vh" }}>
          <div style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
              <FontAwesomeIcon icon={faToolbox} />
          </div>
          <div>
              <button onClick={() => onAnnotationSelect('Highlight')}>Highlight</button>
              <button onClick={() => onAnnotationSelect('Underline')}>Underline</button>
          </div>
      </div>
    </div>
  );
};

export default AnnotationBox;
