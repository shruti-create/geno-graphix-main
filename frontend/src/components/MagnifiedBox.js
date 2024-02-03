import React from "react";
import "./MagnifiedBox.css";

const MagnifiedBox = ({ sequence }) => {
  return (
    <div>
    <p style={{marginRight: '10vh'}}> Magnify a portion of your sequence and associated labels in this box! 
        Highlight the part of the sequence that you want to magnify from the box on the left. </p>
      <div className="box">
        {sequence}
      </div>
    </div>
  );
};

export default MagnifiedBox;
