import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ControlPanel from './components/ControlPanel';
import Visualization from './components/Visualization';

function App() {
  const [algorithm, setAlgorithm] = useState('z-algorithm'); // Algorithm selection
  const [string, setString] = useState('');
  const [pattern, setPattern] = useState('');

  return (
    <div className="App">
      <h1>AlgoViz - String Algorithms Visualizer</h1>
      <InputForm string={string} setString={setString} pattern={pattern} setPattern={setPattern} />
      <ControlPanel algorithm={algorithm} setAlgorithm={setAlgorithm} />
      <Visualization algorithm={algorithm} string={string} pattern={pattern} />
    </div>
  );
}

export default App;
