import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
}

export interface Collectable {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface GameState {
  xp: number;
  level: number;
  unlockedChapters: string[];
  achievements: string[];
  collectables: string[];
  robotParts: string[];
  streakDays: number;
  lastVisit: string;
  // Detective additions
  detectiveRank: 'Rookie' | 'Detective' | 'Senior' | 'Chief Inspector';
  activeCaseId: string | null;
  solvedCases: string[];
  collectedEvidence: string[];
  npcInteractions: string[];
  verdictAttempts: Record<string, number>;
  restoredBiomes: string[];
}

export const XP_REWARDS = {
  CHAPTER_VIEW: 15,
  QUIZ_CORRECT: 25,
  FLIP_CARD_VIEWED: 10,
  DRAG_SORT_COMPLETE: 40,
  CALCULATOR_USED: 20,
  ALL_HOTSPOTS_EXPLORED: 30,
  STREAK_BONUS: 50,
  CODE_ENTERED: 100,
} as const;

export const LEVELS = [0, 50, 150, 300, 500, 750, 1100, 1500, 2000, 3000];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_chapter', title: 'First Steps', description: 'Begin your e-waste adventure', icon: '🌱', xp: 50 },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Answer a quiz correctly', icon: '🧠', xp: 75 },
  { id: 'recycler_pro', title: 'Eco Sorter', description: 'Complete a sorting activity', icon: '♻️', xp: 100 },
  { id: 'calculator_wizard', title: 'Impact Analyst', description: 'Analyze footprint with the calculator', icon: '📊', xp: 60 },
  { id: 'explorer_pro', title: 'Device Explorer', description: 'Reveal diagram secrets', icon: '🔍', xp: 50 },
  { id: 'secret_code', title: 'Code Breaker', description: 'Unlock a hidden developer code', icon: '🔑', xp: 150 },
  // Detective Achievements
  { id: 'first_evidence', title: 'First Clue', description: 'Collect your first evidence item', icon: '🔍', xp: 50 },
  { id: 'case_1_solved', title: 'Rookie No More', description: 'Solve Case 1: The Phantom Dumper', icon: '🎓', xp: 150 },
  { id: 'all_evidence_case', title: 'Thorough Investigator', description: 'Collect all evidence in any case', icon: '🕵️‍♂️', xp: 100 },
  { id: 'all_cases_solved', title: 'Chief Inspector', description: 'Solve all cases', icon: '🏆', xp: 300 }
];

const DEFAULT_STATE: GameState = {
  xp: 0,
  level: 1,
  unlockedChapters: ['1-0'],
  achievements: [],
  collectables: [],
  robotParts: [],
  streakDays: 1,
  lastVisit: new Date().toISOString().split('T')[0],
  detectiveRank: 'Rookie',
  activeCaseId: null,
  solvedCases: [],
  collectedEvidence: [],
  npcInteractions: [],
  verdictAttempts: {},
  restoredBiomes: [],
};

// Dispatch standard event listeners for achievement toasts & level up events
export function dispatchGameUpdate(type: 'achievement' | 'levelup' | 'xp', payload: unknown) {
  const event = new CustomEvent('game_update', { detail: { type, payload } });
  window.dispatchEvent(event);
}

interface GameContextType {
  state: GameState;
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (id: string) => void;
  unlockChapter: (chapterId: string) => void;
  addRobotPart: (partId: string) => void;
  collectEvidence: (evidenceId: string, xpReward: number) => void;
  solveCase: (caseId: string, xpReward: number) => void;
  setActiveCase: (caseId: string | null) => void;
  recordNPCInteraction: (npcId: string) => void;
  restoreBiome: (biomeId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    let baseState = DEFAULT_STATE;
    try {
      const saved = localStorage.getItem('skilizee_game_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        baseState = { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse state:', e);
    }

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (baseState.lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = baseState.streakDays;
      if (baseState.lastVisit === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      return {
        ...baseState,
        lastVisit: today,
        streakDays: newStreak,
      };
    }
    return baseState;
  });

  useEffect(() => {
    localStorage.setItem('skilizee_game_state', JSON.stringify(state));
  }, [state]);


  const addXP = (amount: number, reason?: string) => {
    setState((prev) => {
      const nextXP = prev.xp + amount;
      
      // Calculate level
      let nextLevel = prev.level;
      while (nextLevel < LEVELS.length && nextXP >= LEVELS[nextLevel]) {
        nextLevel++;
      }

      const levelUpOccurred = nextLevel > prev.level;
      if (levelUpOccurred) {
        setTimeout(() => {
          dispatchGameUpdate('levelup', { level: nextLevel, xp: nextXP });
        }, 100);
      }

      dispatchGameUpdate('xp', { amount, reason, total: nextXP });

      return {
        ...prev,
        xp: nextXP,
        level: nextLevel,
      };
    });
  };

  const unlockAchievement = (id: string) => {
    if (state.achievements.includes(id)) return;
    const item = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    if (!item) return;

    setState((prev) => {
      const newAchievements = [...prev.achievements, id];
      setTimeout(() => {
        dispatchGameUpdate('achievement', item);
      }, 100);
      return {
        ...prev,
        achievements: newAchievements,
      };
    });
    addXP(item.xp, `Achievement: ${item.title}`);
  };

  const unlockChapter = (chapterId: string) => {
    if (state.unlockedChapters.includes(chapterId)) return;
    setState((prev) => ({
      ...prev,
      unlockedChapters: [...prev.unlockedChapters, chapterId],
    }));
  };

  const addRobotPart = (partId: string) => {
    if (state.robotParts.includes(partId)) return;
    setState((prev) => ({
      ...prev,
      robotParts: [...prev.robotParts, partId],
    }));
  };

  const collectEvidence = (evidenceId: string, xpReward: number) => {
    if (state.collectedEvidence.includes(evidenceId)) return;
    
    setState((prev) => {
      const nextCollected = [...prev.collectedEvidence, evidenceId];
      return {
        ...prev,
        collectedEvidence: nextCollected,
      };
    });

    addXP(xpReward, `Discovered Clue: ${evidenceId.replace('-', ' ')}`);

    // Trigger First Evidence achievement
    if (state.collectedEvidence.length === 0) {
      unlockAchievement('first_evidence');
    }
  };

  const solveCase = (caseId: string, xpReward: number) => {
    if (state.solvedCases.includes(caseId)) return;

    setState((prev) => {
      const nextSolved = [...prev.solvedCases, caseId];
      
      // Determine Rank
      let nextRank = prev.detectiveRank;
      if (nextSolved.length >= 4) nextRank = 'Chief Inspector';
      else if (nextSolved.length >= 2) nextRank = 'Senior';
      else if (nextSolved.length >= 1) nextRank = 'Detective';

      // Unlock starting chapter of the next case
      const nextChapters = [...prev.unlockedChapters];
      if (caseId === 'case-1' && !nextChapters.includes('2-0')) {
        nextChapters.push('2-0');
      } else if (caseId === 'case-2' && !nextChapters.includes('3-0')) {
        nextChapters.push('3-0');
      } else if (caseId === 'case-3' && !nextChapters.includes('4-0')) {
        nextChapters.push('4-0');
      }

      return {
        ...prev,
        solvedCases: nextSolved,
        detectiveRank: nextRank,
        unlockedChapters: nextChapters,
      };
    });

    addXP(xpReward, `Case Solved: ${caseId.toUpperCase()}`);

    // Trigger achievements
    if (caseId === 'case-1') {
      unlockAchievement('case_1_solved');
    }

    // Check if all solved
    setTimeout(() => {
      setState((prev) => {
        if (prev.solvedCases.length >= 4) {
          unlockAchievement('all_cases_solved');
        }
        return prev;
      });
    }, 200);
  };

  const setActiveCase = (caseId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeCaseId: caseId,
    }));
  };

  const recordNPCInteraction = (npcId: string) => {
    if (state.npcInteractions.includes(npcId)) return;
    setState((prev) => ({
      ...prev,
      npcInteractions: [...prev.npcInteractions, npcId],
    }));
  };

  const restoreBiome = (biomeId: string) => {
    if (state.restoredBiomes.includes(biomeId)) return;
    setState((prev) => ({
      ...prev,
      restoredBiomes: [...prev.restoredBiomes, biomeId],
    }));
  };

  return React.createElement(
    GameContext.Provider,
    {
      value: {
        state,
        addXP,
        unlockAchievement,
        unlockChapter,
        addRobotPart,
        collectEvidence,
        solveCase,
        setActiveCase,
        recordNPCInteraction,
        restoreBiome,
      },
    },
    children
  );
}

export function useGameEngine() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameEngine must be used within a GameProvider');
  }
  return context;
}

