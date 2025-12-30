import React, { useState } from "react";

const DecisionContext = ({ context, onReset }) => {
  const [showLogic, setShowLogic] = useState(false);

  // Mapping from our new IntelligenceCore data structure
  const factors = context.keyFactors || [];
  const positive = context.benefits || [];
  const cautious = context.tradeoffs || [];
  const steps = context.logicPath || [];

  return (
    <div className="screen fade-in">
      <header className="resolution-header">
        <div className="flex justify-between items-start">
          <div className="resolution-status">Cognitive Resolution</div>
          {context.confidenceScore && (
            <div className="text-[0.7rem] font-bold uppercase tracking-widest text-secondary/40">
              Confidence: {context.confidenceScore}%
            </div>
          )}
        </div>
        <h1 className="resolution-title">{context.verdict || "Distilled Outcome"}</h1>
        {context.summary && <p className="resolution-supporting">{context.summary}</p>}
      </header>

      <main className="brief-grid">
        <section className="why-section">
          <div className="section-container">
            <span className="section-label">Critical Factors</span>
            <ul className="insight-list">
              {(factors.length > 0 ? factors : ["Synthesizing impact..."]).map((f, i) => (
                <li key={i} className="insight-item">{f}</li>
              ))}
            </ul>
          </div>

          <div className="tradeoff-board">
            <div className="tradeoff-column positive">
              <span className="section-label">Positive Projection</span>
              <div className="mt-12 space-y-4">
                {(positive.length > 0 ? positive : ["Safety baseline verified"]).map((p, i) => (
                  <div key={i} className="token"><span className="text-green-600 font-bold">⊕</span> {p}</div>
                ))}
              </div>
            </div>
            <div className="tradeoff-column negative">
              <span className="section-label">Restraining Factors</span>
              <div className="mt-12 space-y-4">
                {(cautious.length > 0 ? cautious : ["Inherent metabolic cost"]).map((c, i) => (
                  <div key={i} className="token"><span className="text-red-400 font-bold">⊖</span> {c}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <div className="side-card guidance-card">
            <span className="section-label">Executive Advice</span>
            <p className="guidance-advice">{context.usageRecommendation}</p>
          </div>

          <div className="side-card p-12 bg-white rounded-2xl border border-black/5">
            <span className="section-label">Evidentiary Gaps</span>
            <p className="text-secondary font-medium leading-relaxed mt-4">
              {context.ambiguity || "No critical unknowns identified."}
            </p>
          </div>
        </aside>
      </main>

      <footer className="mt-48 pb-64">
        <div className="deep-dive">
          <button 
            className="deep-dive-trigger"
            onClick={() => setShowLogic(!showLogic)}
          >
            {showLogic ? '↑ Summary View' : '↓ View Logic Path'}
          </button>
          
          {showLogic && (
            <div className="deep-dive-content border-l-2 border-black/5 pl-24 ml-4">
              {steps.map((s, i) => (
                <p key={i} className="text-[0.9rem] italic">{s}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-24 pt-24 border-t border-black/5 flex justify-between items-center">
          <button onClick={onReset} className="action-btn text-blue-600">
            ← New Observation
          </button>
          <span className="text-[0.7rem] uppercase tracking-widest text-secondary/30">Intelligence Layer 2.0</span>
        </div>
      </footer>
    </div>
  );
};

export default DecisionContext;
