import React, { useState } from 'react';
import Visualization from './components/Visualization';
import './App.css';

function App() {
  const [algorithm, setAlgorithm] = useState('z-algorithm');
  const [string, setString] = useState('Hello World Hello');
  const [pattern, setPattern] = useState('Hello');

  return (
    <div className="app-container">
      <header>
        <h1>AlgoViz – String Algorithms Visualizer</h1>
      </header>

      <div className="input-container">
        <div className="input-group">
          <label htmlFor="string-input">Enter String:</label>
          <input
            type="text"
            id="string-input"
            value={string}
            onChange={(e) => setString(e.target.value)}
            placeholder="Enter your text here"
          />
        </div>

        <div className="input-group">
          <label htmlFor="pattern-input">Enter Pattern:</label>
          <input
            type="text"
            id="pattern-input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter pattern to search"
          />
        </div>

        <div className="input-group">
          <label htmlFor="algorithm-select">Choose Algorithm:</label>
          <select
            id="algorithm-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="z-algorithm">Z-Algorithm</option>
            <option value="boyer-moore">Boyer-Moore</option>
          </select>
        </div>
      </div>

      <Visualization algorithm={algorithm} string={string} pattern={pattern} />
    </div>
  );
}

export default App;
