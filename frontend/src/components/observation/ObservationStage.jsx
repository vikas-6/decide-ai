import React, { useState } from "react";

const ObservationStage = ({ onCommit, activeDistillation }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsOver(true);
    else setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onCommit(e.dataTransfer.files[0], 'image');
    }
  };

  return (
    <div 
      className={`screen transition-colors duration-500 ${isOver ? 'bg-black/[0.02]' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="input-stage fade-in">
        <div className="mb-24">
          <h2 className="text-[1.1rem] font-medium text-secondary/60 mb-2">Decide Architecture</h2>
          <h1 className="text-[2.2rem] font-bold tracking-tight">Provide data for distillation.</h1>
        </div>

        <textarea
          placeholder="Literal input or intent..."
          className="intent-field"
          rows="1"
          disabled={activeDistillation}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (e.target.value.trim()) onCommit(e.target.value, 'text');
            }
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />

        <div className="perception-zone mt-24">
          <label className={`scanner-box ${isOver ? 'active' : ''}`}>
            <div className="flex flex-col items-center gap-4">
              <span className="text-[1.4rem] opacity-40">⬚</span>
              <div className="text-center">
                <p className="text-[0.95rem] font-bold">Perception Layer Offline</p>
                <p className="text-[0.75rem] text-secondary opacity-60 mt-4">Drop image or click to scan</p>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              disabled={activeDistillation}
              onChange={(e) => onCommit(e.target.files[0], 'image')}
            />
          </label>
        </div>

        <div className="action-bar border-t-0 pt-0 opacity-40">
           <p className="text-[0.8rem] text-secondary font-medium tracking-wide">Cognitive layer ready.</p>
        </div>
      </div>
    </div>
  );
};

export default ObservationStage;
