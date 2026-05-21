import React, { useState, useRef } from 'react';
import './CodeEntryPopin.css';

interface CodeEntryPopinProps {
  onSuccess: (code: string) => void;
  onClose: () => void;
}

const VALID_CODES = ['GREEN2026', 'SCRAPBOT', 'ECOFUTURE', 'RECYCLE'];

export default function CodeEntryPopin({ onSuccess, onClose }: CodeEntryPopinProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play scanner feedback sounds using Web Audio API
  const playSound = (type: 'success' | 'failure') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'success') {
        // High sonar ping + chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3); // A6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Static error noise
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.setValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (VALID_CODES.includes(cleanCode)) {
      setSuccess(true);
      setError(false);
      playSound('success');
      setTimeout(() => {
        onSuccess(cleanCode);
        onClose();
      }, 1500);
    } else {
      setError(true);
      setSuccess(false);
      playSound('failure');
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="code-popin-overlay">
      <div className="code-popin-backdrop" onClick={onClose} />
      <div className="code-popin-card">
        <button className="code-popin-close-btn" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="code-popin-header">
          <div className="code-popin-badge">FREQUENCY SCANNER</div>
        </div>

        <h3 className="code-popin-title">Tune Signal Frequency</h3>
        <p className="code-popin-desc">
          Enter a hidden code found in the course materials to unlock bonus HERO XP and trophies! Try entering <code>GREEN2026</code>.
        </p>

        <form onSubmit={handleSubmit} className="code-popin-form">
          <input
            type="text"
            className={`code-popin-input ${error ? 'error' : ''} ${success ? 'success' : ''}`}
            placeholder="ENTER SIGNAL CODE..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={success}
            autoFocus
          />

          <button
            type="submit"
            className={`code-popin-submit-btn ${success ? 'success' : ''}`}
            disabled={!code || success}
          >
            {success ? '✓ SIGNAL LOCK ESTABLISHED' : 'VERIFY FREQUENCY'}
          </button>
        </form>

        {error && <div className="code-error-msg">Signal Rejected: Invalid Frequency.</div>}
      </div>
    </div>
  );
}
