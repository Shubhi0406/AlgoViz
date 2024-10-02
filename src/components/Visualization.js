import React, { useEffect, useState, useRef } from 'react';
import { zAlgorithm, zAlgorithmSteps } from '../algorithms';
import './Visualization.css';

function Visualization({ algorithm, string, pattern }) {
  const [finalResult, setFinalResult] = useState({ Z: [], matches: [] });
  const [currentState, setCurrentState] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const generatorRef = useRef(null);
  const [stepDescription, setStepDescription] = useState('');
  const [stepZArray, setStepZArray] = useState([]);

  useEffect(() => {
    if (algorithm === 'z-algorithm' && string && pattern) {
      const combinedString = `${pattern}$${string}`;

      // Compute the final Z-array and matches
      const Z = zAlgorithm(combinedString);
      const matches = [];
      for (let i = 0; i < Z.length; i++) {
        if (Z[i] === pattern.length) matches.push(i - pattern.length - 1);
      }

      setFinalResult({ Z, matches });

      // Start the step-by-step visualization
      generatorRef.current = zAlgorithmSteps(combinedString);
      const firstStep = generatorRef.current.next().value;
      setCurrentState(firstStep);
      setStepHistory([firstStep]);
      setStepDescription('Initializing Z-array...');
      setStepIndex(0);
      setIsLastStep(false);
    } else {
      setFinalResult({ Z: [], matches: [] });
      setCurrentState(null);
      setStepHistory([]);
      setStepIndex(0);
    }
  }, [algorithm, string, pattern]);

  // Move to the next step
  const stepForward = () => {
    if (stepIndex < stepHistory.length - 1) {
      const nextStep = stepHistory[stepIndex + 1];
      setCurrentState(nextStep);
      setStepIndex(stepIndex + 1);
      setStepDescription(getStepDescription(nextStep));
  
      // Progressively update the Z-array up to the current step
      const progressiveZ = [...stepZArray]; 
      for (let i = 0; i <= nextStep.i; i++) {  // Only update Z up to the current step index
        progressiveZ[i] = nextStep.Z[i];
      }
      setStepZArray(progressiveZ);  // Set the Z-array for this step
    } else if (generatorRef.current) {
      const next = generatorRef.current.next();
      if (!next.done) {
        const nextStep = next.value;
        setCurrentState(nextStep);
        setStepHistory((prev) => [...prev, nextStep]);
        setStepIndex((prevIndex) => prevIndex + 1);
        setStepDescription(getStepDescription(nextStep));
  
        // Progressively update the Z-array
        const progressiveZ = [...stepZArray];
        for (let i = 0; i <= nextStep.i; i++) {
          progressiveZ[i] = nextStep.Z[i];
        }
        setStepZArray(progressiveZ);  // Set the Z-array for this step
      } else {
        setIsLastStep(true);
      }
    }
  };
  

  // Move to the previous step
  const stepBackward = () => {
    if (stepIndex > 0) {
      const prevStep = stepHistory[stepIndex - 1];
      setCurrentState(prevStep);
      setStepIndex(stepIndex - 1);
      setStepDescription(getStepDescription(prevStep));
      setIsLastStep(false);
  
      // Truncate the Z-array for the previous step
      const truncatedZ = [...stepZArray];
      for (let i = prevStep.i + 1; i < truncatedZ.length; i++) {
        truncatedZ[i] = 0;  // Reset values beyond the current step's index to 0
      }
      setStepZArray(truncatedZ);  // Update Z-array to reflect the previous step
    }
  };
  
  

  // Reset the algorithm
  const resetSteps = () => {
    if (stepHistory.length > 0) {
      const firstStep = stepHistory[0];
      setCurrentState(firstStep);
      setStepIndex(0);
      setStepDescription('Resetting to the beginning...');
      setIsLastStep(false);
      
      setStepZArray(new Array(firstStep.Z.length).fill(0));
    }
  };
  

  // Provide step explanations
  const getStepDescription = (state) => {
    const { i, L, R } = state;
    if (i > R) return `We are now starting a new window at index ${i}. The algorithm will check this window to match the pattern with the substring.`;
    if (i <= R) return `Continuing within the window [L=${L}, R=${R}]. The algorithm will now compare the substring with the pattern to find a match.`;
    return '';
  };

  // Function to highlight the current window in the string
  const highlightText = (text, L, R) => {
    return text.split('').map((char, index) => {
      if (index >= L && index <= R) {
        return <span key={index} className="highlight" title={`Window [L=${L}, R=${R}]`}>{char}</span>;
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <div className="visualization-container">
      <div className="algorithm-header">
        <h3 className="title">Z-Algorithm Visualization</h3>
        <button className="learn-more-button" onClick={() => setIsModalOpen(true)}>Learn More</button>
      </div>

      <div className="text-section">
        <p><strong>Text:</strong></p>
        <p className="text-content">{currentState ? highlightText(string, currentState.L - pattern.length - 1, currentState.R - pattern.length - 1) : string}</p>
      </div>

      <div className="pattern-section">
        <p><strong>Pattern:</strong> {pattern}</p>
      </div>

      <div className="final-result-section">
        <h4>Final Z-Array:</h4>
        <p>{finalResult.Z.join(', ')}</p>
        {finalResult.matches.length > 0 ? (
          <p>Pattern found at index(es): {finalResult.matches.join(', ')}</p>
        ) : (
          <p>No matches found.</p>
        )}
      </div>

      {currentState && (
        <div className="step-by-step-section">
          <h4>Step-by-Step:</h4>
          <p><strong>Window:</strong> [L = {currentState.L}, R = {currentState.R}]</p>
          <p><strong>Position:</strong> i = {currentState.i}</p>
          <p><strong>Z-Array:</strong> {stepZArray.join(', ')}</p>
          <p className="step-description">{stepDescription}</p>

          <div className="button-group">
            <button className="nav-button" onClick={stepBackward} disabled={stepIndex === 0}>Previous Step</button>
            <button className="nav-button" onClick={stepForward} disabled={isLastStep}>Next Step</button>
            <button className="nav-button reset-button" onClick={resetSteps}>Reset</button>
          </div>
        </div>
      )}

      {/* Modal for explanations */}
      {isModalOpen && (
        <div className="modal open">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>Introduction to the Z-Algorithm</h3>
            <p>The Z-algorithm is a pattern matching algorithm used to efficiently find all occurrences of a pattern in a text. It builds a Z-array that, for each index i in the string, stores the length of the longest substring starting at i that matches the prefix of the string.</p>
            <p>The Z-algorithm operates in O(n) time, making it an efficient alternative to brute-force pattern matching approaches.</p>
            <h4>Steps:</h4>
            <ul>
              <li>Initialize the Z-array to store the lengths of the matching prefixes.</li>
              <li>Use a window [L, R] to track the substring currently being compared.</li>
              <li>Expand or reset the window as necessary to find matches.</li>
              <li>Update the Z-array and repeat the process until the end of the string.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Visualization;
