import React, { useEffect, useState, useRef } from 'react';
import { zAlgorithm, zAlgorithmSteps } from '../algorithms';
import './Visualization.css';

function Visualization({ algorithm, string, pattern }) {
  const [finalResult, setFinalResult] = useState({ Z: [], matches: [] });
  const [currentState, setCurrentState] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);  
  const [stepIndex, setStepIndex] = useState(0);  
  const [isLastStep, setIsLastStep] = useState(false);  
  const generatorRef = useRef(null);
  const [stepDescription, setStepDescription] = useState('');

  useEffect(() => {
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
    } else {
      setFinalResult({ Z: [], matches: [] });  
      setCurrentState(null);  
      setStepHistory([]);  
      setStepIndex(0);  
    }
  }, [algorithm, string, pattern]);

  const stepForward = () => {
    if (stepIndex < stepHistory.length - 1) {
      const nextStep = stepHistory[stepIndex + 1];
      setCurrentState(nextStep);
      setStepIndex(stepIndex + 1);
      setStepDescription(getStepDescription(nextStep));
    } else if (generatorRef.current) {
      const next = generatorRef.current.next();
      if (!next.done) {
        const nextStep = next.value;
        setCurrentState(nextStep);
        setStepHistory((prev) => [...prev, nextStep]);  
        setStepIndex((prevIndex) => prevIndex + 1);  
        setStepDescription(getStepDescription(nextStep));
      } else {
        setIsLastStep(true);  
      }
    }
  };

  const stepBackward = () => {
    if (stepIndex > 0) {
      const prevStep = stepHistory[stepIndex - 1];
      setCurrentState(prevStep);
      setStepIndex((prevIndex) => prevIndex - 1);  
      setStepDescription(getStepDescription(prevStep));
      setIsLastStep(false);  
    }
  };

  const resetSteps = () => {
    if (stepHistory.length > 0) {
      const firstStep = stepHistory[0];
      setCurrentState(firstStep);
      setStepIndex(0);
      setStepDescription('Resetting to the beginning...');
      setIsLastStep(false);  
    }
  };

  const getStepDescription = (state) => {
    const { i, L, R } = state;
    if (i > R) return `Starting a new window from index ${i}.`;
    if (i <= R) return `Continuing within the window [${L}, ${R}] from index ${i}.`;
    return '';
  };

  const highlightText = (text, L, R) => {
    return text.split('').map((char, index) => {
      if (index >= L && index <= R) {
        return <span key={index} className="highlight">{char}</span>;  
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <div className="visualization-container">
      <h3 className="title">Z-Algorithm Visualization</h3>

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
          <p><strong>Z-Array:</strong> {currentState.Z.join(', ')}</p>
          <p>{stepDescription}</p>

          <div className="button-group">
            <button className="nav-button" onClick={stepBackward} disabled={stepIndex === 0}>Previous Step</button>
            <button className="nav-button" onClick={stepForward} disabled={isLastStep}>Next Step</button>
            <button className="nav-button reset-button" onClick={resetSteps}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Visualization;
