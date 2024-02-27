import React from "react";
import "./MagnifiedBox.css"; // Import CSS file for styling

// MagnifiedBox component displays a magnified view of a portion of sequence
// Users can highlight a part of the sequence and it will be magnified here.
const MagnifiedBox = ({ sequence }) => {
  return (
    <div>
    <p style={{right: "2vw"}}> Magnify a portion of your sequence and associated labels in this box! 
        Highlight the part of the sequence that you want to magnify from the box on the left. </p>
      <div className="box">
      <pre>{sequence}</pre>
      </div>
    </div>
  );
};

export default MagnifiedBox;
