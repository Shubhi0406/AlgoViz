import React from 'react';

function ControlPanel({ algorithm, setAlgorithm }) {
  return (
    <div>
      <label>
        <input 
          type="radio" 
          value="z-algorithm" 
          checked={algorithm === 'z-algorithm'} 
          onChange={() => setAlgorithm('z-algorithm')}
        />
        Z-Algorithm
      </label>
      <label>
        <input 
          type="radio" 
          value="boyer-moore" 
          checked={algorithm === 'boyer-moore'} 
          onChange={() => setAlgorithm('boyer-moore')}
        />
        Boyer-Moore
      </label>
    </div>
  );
}

export default ControlPanel;
