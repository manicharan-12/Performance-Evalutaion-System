import React, { useState, useRef, useEffect } from 'react';
import { EditableTextArea } from './StyledComponents';

const EditableText = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  
  const handleTextClick = () => {
    setIsEditing(true);
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    onChange(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div style={{ width: '100%', height: '100%', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
      {isEditing ? (
        <EditableTextArea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          autoFocus
          rows="1"
          style={{ height: textareaHeight, overflow: 'hidden' }}
        />
      ) : (
        <div
          onClick={handleTextClick}
          style={{ 
            width: '100%', 
            height: '100%', 
            padding: '8px', 
            cursor: 'pointer', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        >
          {text || 'Click to add Remarks'}
        </div>
      )}
    </div>
  );
};

export default EditableText;
