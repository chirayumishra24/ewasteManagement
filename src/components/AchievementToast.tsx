import { useEffect, useState } from 'react';
import './AchievementToast.css';
import type { Achievement } from '../gameEngine';

interface ToastItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp?: number;
  type: 'achievement' | 'levelup';
}

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleGameUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, payload } = customEvent.detail;

      if (type === 'achievement') {
        const achievement = payload as Achievement;
        const newToast: ToastItem = {
          id: Math.random().toString(36).substring(2, 11),
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          xp: achievement.xp,
          type: 'achievement',
        };
        setToasts((prev) => [...prev, newToast]);
      } else if (type === 'levelup') {
        const newToast: ToastItem = {
          id: Math.random().toString(36).substring(2, 11),
          title: `Level Up!`,
          description: `You reached Level ${payload.level}!`,
          icon: 'level',
          type: 'levelup',
        };
        setToasts((prev) => [...prev, newToast]);
      }
    };

    window.addEventListener('game_update', handleGameUpdate);
    return () => window.removeEventListener('game_update', handleGameUpdate);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="achievement-toast-container">
      {toasts.map((toast) => (
        <ToastItemCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItemCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`toast-card toast-${toast.type}`}>
      <div className="toast-icon-container">
        {toast.type === 'levelup' ? (
          <svg className="toast-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ) : (
          <svg className="toast-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )}
      </div>
      <div className="toast-content">
        <span className="toast-kicker">
          {toast.type === 'achievement' ? 'SYSTEM UPDATE' : 'PROMOTION'}
        </span>
        <h4 className="toast-title">{toast.title}</h4>
        <p className="toast-description">{toast.description}</p>
      </div>
      {toast.xp && (
        <div className="toast-xp-badge">
          <span className="toast-xp-value">+{toast.xp}</span>
          <span className="toast-xp-unit">HP</span>
        </div>
      )}
      <button className="toast-close" onClick={onDismiss} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
