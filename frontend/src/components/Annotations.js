import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox, faBold, faStrikethrough, faUnderline, faTag, faHighlighter} from '@fortawesome/free-solid-svg-icons';

// AnnotationBox component handles annotation type selection.
const AnnotationBox = ( {onAnnotationSelect}) => {
    const [color, setColor] = useState('#ffffff'); 
    return (
    <div>
      <p>Pick an annotation type to do on the sequence:</p>
      <div style={{ position: 'relative', border: "0.1vh solid #00000055", padding: "2%", borderRadius: "1vh", height: "20vh" }}>
          <div style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
              <FontAwesomeIcon icon={faToolbox} />
          </div>
          <div 
            style={{ 
            display: 'flex', 
            alignItems: 'left', 
            justifyContent: 'left',             gap: '10px', 
          }}
          >
            <input 
                style={{ 
                    borderRadius: '10%', 
                    border: '1px solid #ccc', 
                    width: '40px', 
                    height: '40px',
                    cursor: 'pointer', 
                }} 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
            />

            <button 
                style={{ 
                    borderRadius: '3px', 
                    border: '1px solid #ccc', 
                    padding: '5px 20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f0f0f0', 
                    outline: 'none', 

                }} 
                onClick={() => onAnnotationSelect(color)}
            >
                <FontAwesomeIcon icon={faHighlighter} style={{ marginRight: '5px', fontSize: '1.2em'}} />
            </button>

            <button 
                style={{ 
                    borderRadius: '3px', 
                    border: '1px solid #ccc', 
                    padding: '5px 20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f0f0f0', 
                    outline: 'none',

                }} 
                onClick={() => onAnnotationSelect('Bold')}
            >
                <FontAwesomeIcon icon={faBold} style={{ marginRight: '5px', fontSize: '1.2em'}} />
            </button>

            <button 
                style={{ 
                    borderRadius: '3px', 
                    border: '1px solid #ccc', 
                    padding: '5px 20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f0f0f0', 
                    outline: 'none',

                }} 
                onClick={() => onAnnotationSelect('Underline')}
            >
                <FontAwesomeIcon icon={faUnderline} style={{ marginRight: '5px', fontSize: '1.2em' }} />
            </button>
            
            <button 
                style={{ 
                    borderRadius: '3px', 
                    border: '1px solid #ccc', 
                    padding: '5px 20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f0f0f0', 
                    outline: 'none',

                }} 
                onClick={() => onAnnotationSelect('StrikeThrough')}
            >
                <FontAwesomeIcon icon={faStrikethrough} style={{ marginRight: '5px', fontSize: '1.2em' }} />
            </button>

            <button 
                style={{ 
                    borderRadius: '3px', 
                    border: '1px solid #ccc', 
                    padding: '5px 20px', 
                    marginLeft: '5px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f0f0f0', 
                    outline: 'none',

                }} 
                onClick={() => onAnnotationSelect('Label')}
            >
                <FontAwesomeIcon icon={faTag} style={{ marginRight: '5px', fontSize: '1.2em' }} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default AnnotationBox;
