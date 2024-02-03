import React from "react";
import "./MagnifiedBox.css";

const MagnifiedBox = ({ sequence }) => {

  return (
    <div>
      <p style={{ marginRight: "70px" }}>
        {" "}
        Magnify a portion of your sequence and associated labels in this box!
        Highlight the part of the sequence that you want to magnify from the box
        on the left.{" "}
      </p>
      <div className="box">
      <pre>{sequence}</pre>
      </div>
    </div>
  );
};

export default MagnifiedBox;
