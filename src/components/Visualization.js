import React from 'react';

function Visualization({ algorithm, string, pattern }) {
  // Visualization logic will go here
  return (
    <div>
      <p>Selected Algorithm: {algorithm}</p>
      <p>String: {string}</p>
      <p>Pattern: {pattern}</p>
    </div>
  );
}

export default Visualization;
