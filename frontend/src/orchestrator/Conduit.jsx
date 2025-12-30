import React, { useState } from "react";
import ObservationStage from "../components/observation/ObservationStage.jsx";
import DecisionContext from "../components/brief/DecisionContext.jsx";
import { DistillChoice } from "../services/bridge";
import "../styles/design-tokens.css";

function Conduit() {
  const [phase, setPhase] = useState('DORMANT'); // DORMANT, PROCESSING, RESOLVED
  const [outcome, setOutcome] = useState(null);
  const [incident, setIncident] = useState(null);

  const [thoughtStage, setThoughtStage] = useState(0);
  const stages = [
    "Engaging Optical Perception Layer...",
    "Extracting Metabolic Signatures...",
    "Synthesizing Chemical Impact...",
    "Distilling Evolutionary Brief..."
  ];

  const performDistillation = async (input, mode) => {
    setPhase('PROCESSING');
    setIncident(null);
    setThoughtStage(0);

    const stageInterval = setInterval(() => {
      setThoughtStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      let finalInput = input;
      if (mode === 'image') {
        const reader = new FileReader();
        const readPromise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
        reader.readAsDataURL(input);
        finalInput = await readPromise;
      }
      
      const insight = await DistillChoice(finalInput, mode);
      clearInterval(stageInterval);
      setOutcome(insight);
      setPhase('RESOLVED');
    } catch (e) {
      clearInterval(stageInterval);
      setIncident(e.message);
      setPhase('DORMANT');
    }
  };

  return (
    <div className="app-container">
      <div className="brand">Decide</div>
      
      {phase === 'DORMANT' && (
        <ObservationStage 
          onCommit={performDistillation} 
          activeDistillation={false} 
        />
      )}
      
      {phase === 'PROCESSING' && (
        <div className="screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-secondary/30 mb-8">
              Analytical Layer Active
            </div>
            <div className="h-px w-24 bg-black/5 mx-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-black/40 -translate-x-full animate-[loadingProgress_1.5s_infinite]"></div>
            </div>
            <p className="text-[0.9rem] font-medium text-secondary mt-12 animate-pulse">
              {stages[thoughtStage]}
            </p>
          </div>
        </div>
      )}

      {phase === 'RESOLVED' && outcome && (
        <DecisionContext 
          context={outcome} 
          onReset={() => setPhase('DORMANT')} 
        />
      )}

      {incident && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 p-4 bg-red-50 text-[0.75rem] text-red-600 rounded-lg border border-red-100">
          {incident}
        </div>
      )}
    </div>
  );
}

export default Conduit;
