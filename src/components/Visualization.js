import React, { useEffect, useState, useRef } from 'react';
import { zAlgorithm, zAlgorithmSteps, boyerMooreSteps } from '../algorithms';
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
  const [algorithmType, setAlgorithmType] = useState(algorithm); // Track current algorithm type

  useEffect(() => {
    setAlgorithmType(algorithm); // Update the algorithm type when it changes
    if (algorithm === 'z-algorithm' && string && pattern) {
      const combinedString = `${pattern}$${string}`;
      const Z = zAlgorithm(combinedString);
      const matches = [];
      for (let i = 0; i < Z.length; i++) {
        if (Z[i] === pattern.length) matches.push(i - pattern.length - 1);
      }
      setFinalResult({ Z, matches });

      generatorRef.current = zAlgorithmSteps(combinedString);
      const firstStep = generatorRef.current.next().value;
      setCurrentState(firstStep);
      setStepHistory([firstStep]);
      setStepDescription('Initializing Z-array...');
      setStepIndex(0);
      setIsLastStep(false);
    } else if (algorithm === 'boyer-moore' && string && pattern) {
      generatorRef.current = boyerMooreSteps(string, pattern);
      const firstStep = generatorRef.current.next().value;
      setCurrentState(firstStep);
      setStepHistory([firstStep]);
      setStepDescription(getBoyerMooreDescription(firstStep));
      setStepIndex(0);
      setIsLastStep(false);
    } else {
      setFinalResult({ Z: [], matches: [] });
      setCurrentState(null);
      setStepHistory([]);
      setStepIndex(0);
    }
  }, [algorithm, string, pattern]);

  // Step forward function
  const stepForward = () => {
    if (stepIndex < stepHistory.length - 1) {
      const nextStep = stepHistory[stepIndex + 1];
      setCurrentState(nextStep);
      setStepIndex(stepIndex + 1);
      setStepDescription(getStepDescription(nextStep));

      const progressiveZ = [...stepZArray]; 
      for (let i = 0; i <= nextStep.i; i++) {  // Only update Z up to the current step index
        progressiveZ[i] = nextStep.Z[i];
      }
      setStepZArray(progressiveZ);
    } else if (generatorRef.current) {
      const next = generatorRef.current.next();
      if (!next.done) {
        const nextStep = next.value;
        setCurrentState(nextStep);
        setStepHistory((prev) => [...prev, nextStep]);
        setStepIndex(stepIndex + 1);
        setStepDescription(getStepDescription(nextStep));

        const progressiveZ = [...stepZArray];
        for (let i = 0; i <= nextStep.i; i++) {
          progressiveZ[i] = nextStep.Z[i];
        }
        setStepZArray(progressiveZ);
      } else {
        setIsLastStep(true);
      }
    }
  };

  // Step backward function
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
      setStepZArray(truncatedZ);
    }
  };

  // Reset function
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

  // Get step description based on the algorithm type
  const getStepDescription = (state) => {
    if (algorithmType === 'z-algorithm') {
      const { i, L, R } = state;
      if (i > R) return `Starting a new window at index ${i}. Checking the window for pattern matches.`;
      if (i <= R) return `Within window [L=${L}, R=${R}]. Comparing the substring with the pattern.`;
      return '';
    } else if (algorithmType === 'boyer-moore') {
      return getBoyerMooreDescription(state);
    }
  };

  // Boyer-Moore step description logic
  const getBoyerMooreDescription = (state) => {
    if (state.match) return `Pattern found at index ${state.s}. Moving the pattern by ${state.shift}.`;
    return `Mismatch at index ${state.s + state.j}. Shifting pattern by ${state.shift}.`;
  };

  // Highlight text for Z-Algorithm or Boyer-Moore
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
        <h3 className="title">
          {algorithmType === 'z-algorithm' ? 'Z-Algorithm Visualization' : 'Boyer-Moore Visualization'}
        </h3>
        <button className="learn-more-button" onClick={() => setIsModalOpen(true)}>Learn More</button>
      </div>

      <div className="text-section">
        <p><strong>Text:</strong></p>
        <p className="text-content">
          {currentState ? highlightText(string, currentState.L - pattern.length - 1, currentState.R - pattern.length - 1) : string}
        </p>
      </div>

      <div className="pattern-section">
        <p><strong>Pattern:</strong> {pattern}</p>
      </div>

      {/* Z-Algorithm Results */}
      {algorithmType === 'z-algorithm' && (
        <div className="final-result-section">
          <h4>Final Z-Array:</h4>
          <p>{finalResult.Z.join(', ')}</p>
          {finalResult.matches.length > 0 ? (
            <p>Pattern found at index(es): {finalResult.matches.join(', ')}</p>
          ) : (
            <p>No matches found.</p>
          )}
        </div>
      )}

      {currentState && (
        <div className="step-by-step-section">
          <h4>Step-by-Step:</h4>
          {algorithmType === 'z-algorithm' && (
            <>
              <p><strong>Window:</strong> [L = {currentState.L}, R = {currentState.R}]</p>
              <p><strong>Position:</strong> i = {currentState.i}</p>
              <p><strong>Z-Array:</strong> {stepZArray.join(', ')}</p>
            </>
          )}
          {algorithmType === 'boyer-moore' && (
            <>
              <p><strong>Shift:</strong> {currentState.s}</p>
              <p><strong>Pattern Matched:</strong> {currentState.match ? 'Yes' : 'No'}</p>
            </>
          )}
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
            {algorithmType === 'z-algorithm' ? (
              <>
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
              </>
            ) : (
              <>
                <h3>Introduction to the Boyer-Moore Algorithm</h3>
                <p>The Boyer-Moore algorithm uses two key heuristics (bad character and good suffix) to efficiently search for a pattern in a text...</p>
                {/* Add more details here */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Visualization;

