import { useState, useEffect, useRef } from 'react';
import './QuizPopin.css';

interface QuizPopinProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  onCorrect: () => void;
  onClose: () => void;
}

export default function QuizPopin({
  question,
  options,
  correctIndex,
  explanation,
  xpReward,
  onCorrect,
  onClose,
}: QuizPopinProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play procedural game sounds
  const playSound = (type: 'correct' | 'incorrect') => {
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

      if (type === 'correct') {
        // High-pitched celebratory arpeggio chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        // Dissolving low buzzer/ripple sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
    }
  };

  // Text to speech implementation
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Automatically read question when quiz opens
  useEffect(() => {
    // Speak question and options
    const fullText = `${question}. Option A: ${options[0] || ''}. Option B: ${options[1] || ''}. Option C: ${options[2] || ''}. Option D: ${options[3] || ''}.`;
    const timeout = setTimeout(() => {
      speakText(fullText);
    }, 800);

    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(timeout);
    };
  }, [question, options]);

  const handleOptionClick = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || submitted) return;
    setSubmitted(true);
    if (selectedIdx === correctIndex) {
      playSound('correct');
      onCorrect();
    } else {
      playSound('incorrect');
    }

    // Stop speaking question and read feedback instead
    const isCorrect = selectedIdx === correctIndex;
    const feedbackText = isCorrect 
      ? `Correct answer! ${explanation}`
      : `Incorrect. The correct answer was option ${String.fromCharCode(65 + correctIndex)}. ${explanation}`;
    speakText(feedbackText);
  };

  const isCorrect = selectedIdx === correctIndex;

  return (
    <div className="quiz-popin-overlay">
      <div className="quiz-popin-backdrop" onClick={onClose} />
      <div className="quiz-popin-card">
        <button className="quiz-popin-close-btn" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="quiz-popin-header">
          <div className="quiz-popin-badge">ENVIRONMENTAL CHALLENGE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className={`quiz-speak-btn ${isSpeaking ? 'active' : ''}`}
              onClick={() => {
                if (submitted) {
                  speakText(explanation);
                } else {
                  speakText(`${question}. Options are: ${options.join(', ')}`);
                }
              }}
              title="Narrate text"
              aria-label="Narrate"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isSpeaking ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M23 9l-6 6M17 9l6 6"></path>
                  </>
                )}
              </svg>
            </button>
            <span className="quiz-popin-xp-reward">+{xpReward} HP</span>
          </div>
        </div>

        <h3 className="quiz-popin-question">{question}</h3>

        <div className="quiz-popin-options">
          {options.map((option, idx) => {
            let className = "quiz-popin-option-btn";
            if (selectedIdx === idx) className += " selected";
            if (submitted) {
              if (idx === correctIndex) className += " correct";
              else if (selectedIdx === idx) className += " incorrect";
              else className += " disabled";
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleOptionClick(idx)}
                disabled={submitted}
              >
                <span className="option-indicator">
                  {submitted && idx === correctIndex ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : submitted && selectedIdx === idx ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button
            className="quiz-popin-submit-btn"
            disabled={selectedIdx === null}
            onClick={handleSubmit}
          >
            TRANSMIT SOLUTION
          </button>
        ) : (
          <div className="quiz-popin-feedback-section">
            <div className={`quiz-feedback-title ${isCorrect ? 'success' : 'fail'}`}>
              {isCorrect ? '📡 SYSTEM HEALED: Clean Signal Restored' : '⚠️ INTERFERENCE DETECTED: Signal Fragmented'}
            </div>
            <p className="quiz-explanation">{explanation}</p>
            <button className="quiz-popin-continue-btn" onClick={onClose}>
              CONTINUE ORBITAL DISCOVERY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
