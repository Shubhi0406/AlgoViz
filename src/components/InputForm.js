import React from 'react';

function InputForm({ string, setString, pattern, setPattern }) {
  return (
    <div>
      <label>
        String: 
        <input 
          type="text" 
          value={string} 
          onChange={(e) => setString(e.target.value)} 
        />
      </label>
      <label>
        Pattern: 
        <input 
          type="text" 
          value={pattern} 
          onChange={(e) => setPattern(e.target.value)} 
        />
      </label>
    </div>
  );
}

export default InputForm;
