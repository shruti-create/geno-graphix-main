import React, { useState, useEffect } from "react";
import FullSequence from "../components/fullSequence";
import MagnifiedBox from "../components/MagnifiedBox";
import "./VisualizationForm.css";
import AnnotationBox from "../components/Annotations";

// Component for visualizing genomic sequence and controls what happems afer clicking generate buttom
function VisualizationPage({ input }) {
  // State variables for managing sequence, annotations, and download content
  const [selectedSequence, setSelectedSequence] = useState("");
  const [selected, setSelected] = useState(false);
  const [annotation, setAnnotation] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [fileContent, setFileContent] = useState(input); 
  const [displayAnnotation,setDisplay] = useState([]);
  
  // useEffect to update fileContent when annotations are added
  useEffect(() => {
    if (annotation && startIndex >= 0 && endIndex >= 0) {
      const annotationText = `${startIndex},${endIndex},${annotation}`;
      setFileContent((prevContent) => `${prevContent}\n${annotationText}`);
    }
    
  }, [annotation, startIndex, endIndex]);
 
  // Handles the selection of a sequence range for annotation
  const handleSequenceSelect = (sequence, start, end) => {
    setStartIndex(start);
    setEndIndex(end);
    setSelectedSequence(sequence);
  };

  // Handles the selection of an annotation type
  const handleAnnotation = (selectedAnnotation) => {
    setAnnotation(selectedAnnotation);
    setDisplay((prevAnn) => [...prevAnn, { start: startIndex, end: endIndex, type: selectedAnnotation }]);
    console.log("Display Annotation: ",displayAnnotation);
    console.log(selectedAnnotation);
  };

  // Downloads the file content as a text file
  const downloadFileContent = () => {
    // Create a Blob with the file content and specify the MIME type as text/plain
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Create a URL for the Blob
    const href = URL.createObjectURL(blob);
    
    // Create an <a> element to trigger the download
    const link = document.createElement('a');
    link.href = href;
    link.download = "GenomicSequenceAnnotations.txt";

    // Append the link to the document body
    document.body.appendChild(link);
    // Trigger a click event on the link to start the download
    link.click();
    // Remove the link from the document body
    document.body.removeChild(link);
    // Revoke the URL to free up resources
    URL.revokeObjectURL(href);
    console.log("File Content: ",fileContent);
    console.log("Display Annotation: ",displayAnnotation);
  };
  
  // Sample input sequence
  const inputSequence = "ACTTGCCTGGACGCTGCGCCACATCCCACCGGCCCTTACACTGTGGTGTCCAGCAGCATCCGGCTTCATGGGGGGACTTGAACCCTGCAGCAGGCTCCTGCTCCTGCCTCTCCTGCTGGCTGTAAGTGGTGAGTTAGGGGCTTCCGTGGCTGCCTCCCGGGTCCCTGGGCTCAGCTTGGGGCAGGGCAGGGAGTGGGGTGGAACGAGAGACCAAAAGTGGGTGTTGGGATGGGAGCAGGTCCCCAACCTCCCAAAGCCTGTGGGTTTCTCCCAGAGCCCAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAAAGCCCCCAAGTTTTGTCGTCCGCTACAAGCAGGGGAGAAGAGACATCTAAGTGTGTTGCCACAGGACAAGTTGTGCAGAAGTAACGCACATAGTCCGGTGGCCCAGACGCCAGCCCCCTGAGTCCCGCCAGACACGCTCTCCCCCTTGCTAACCTCTTGGCTGTCAGGATCCACCTTCCCTGGCTTCTAAACTTGCCTCCCCCACCCCCGTCATAACTCTGTGCCTCAGTTTACCTTCTTTTTCCTCCTCAGGTCTCCGTCCTGTCCAGGCCCAGGCCCAGAGCGGTAGGCCTAGACCCAGCAGTCCCTCTCTCTACCTCCCAGAGACCTCCCTGTCTCCGTCTCTCCCACACCCTTTCCAAACCTCCCTGCCGCTGACCCCCCTCCCCACAGTTCCCAGCACACACTGACCTCCCCTGACCCCTGTGCTGCAGATTGCAGTTGCTCTACGGTGAGCCCGGGCGTGCTGGCAGGGATCGTGATGGGAGACCTGGTGCTGACAGTGCTCATTGCCCTGGCCGTGTACTTCCTGGGCCGGCTGGTCCCTCGGGGGCGAGGGGCTGCGGAGGGTGAGTGGGGCTAGCAGGGGACATCCTGAGGACTTGCCTAGATGGGGGTGGGGGGCTGGGTAAACTCCCAGATCTCAAACATCCAAAGGGATGGTAATGGAGGTGCTGATTTGGAATGACAAAACACCCTA";

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