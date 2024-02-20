/*
Visualizes form displays the full sequence and controls what happens after 
clicking on the generate button. 
*/
import React, { useState, useEffect } from "react";
import FullSequence from "../components/fullSequence";
import MagnifiedBox from "../components/MagnifiedBox";
import "./VisualizationForm.css";
import AnnotationBox from "../components/Annotations";

function VisualizationPage({ input }) {
  const [selectedSequence, setSelectedSequence] = useState("");
  const [selected, setSelected] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [fileContent, setFileContent] = useState(input); 
  const [displayAnnotation,setDisplay] = useState([]);

  
  useEffect(() => {
    if (annotation && startIndex >= 0 && endIndex >= 0) {
      const annotationText = `${startIndex},${endIndex},${annotation}`;
      setFileContent((prevContent) => `${prevContent}\n${annotationText}`);
    }
    
  }, [annotation, startIndex, endIndex]);

  const handleSequenceSelect = (sequence, start, end) => {
    setStartIndex(start);
    setEndIndex(end);
    setSelectedSequence(sequence);
  };

  const handleAnnotation = (selectedAnnotation) => {
    setAnnotation(selectedAnnotation);
    setDisplay((prevAnn) => [...prevAnn, { start: startIndex, end: endIndex, type: selectedAnnotation }]);
    console.log("Display Annotation: ",displayAnnotation);
    console.log(selectedAnnotation);
  };

  const downloadFileContent = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "GenomicSequenceAnnotations.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    console.log("File Content: ",fileContent);
    console.log("Display Annotation: ",displayAnnotation);
  };

  return (
    <div>
      <h2>Genomic Sequence</h2>
      <div style={{ fontSize: "1.2rem", color: "black", margin: "20px" }}>
        <div className="container">
          <div className="component">
            <FullSequence
              sequence={input}
              onSequenceSelect={handleSequenceSelect}
              annotations={displayAnnotation}
            />
          </div>
          <div className="component">
            <AnnotationBox onAnnotationSelect={handleAnnotation} />
            <MagnifiedBox sequence={selectedSequence}/>
            <button style = {{marginTop: '3%', width: '15%', height: '5%'}} onClick={downloadFileContent}>Save to File</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizationPage;