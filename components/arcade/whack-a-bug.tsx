'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from './sound-fx';
import { RotateCcw, Play, Trophy, Clock, Zap, AlertTriangle } from 'lucide-react';

interface WhackABugProps {
  onBackToMenu: () => void;
}

type BugType = 'bug' | 'critical' | 'coffee' | 'database';

interface Slot {
  id: number;
  active: boolean;
  type: BugType;
  whacked: boolean;
  port: string;
}

const PORTS = [
  'PORT:3000', 'PORT:8080', 'PORT:5432',
  'PORT:6379', 'PORT:4000', 'PORT:27017',
  'PORT:8000', 'PORT:9092', 'PORT:443'
];

export function WhackABug({ onBackToMenu }: WhackABugProps) {
  const [slots, setSlots] = useState<Slot[]>(
    PORTS.map((port, idx) => ({
      id: idx,
      active: false,
      type: 'bug',
      whacked: false,
      port,
    }))
  );

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; text: string; x: number; y: number; color: string }[]
  >([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextFloatId = useRef(1);

  useEffect(() => {
    const saved = localStorage.getItem('arcade_high_whack_a_bug');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = nextFloatId.current++;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  };

  const spawnBug = useCallback(() => {
    setSlots((prev) => {
      // Find inactive slots
      const inactiveIndices = prev
        .map((s, idx) => (!s.active ? idx : -1))
        .filter((idx) => idx !== -1);

      if (inactiveIndices.length === 0) return prev;

      const randomIdx = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];

      // Random bug type:
      // 65% regular bug, 15% critical bug, 10% coffee bonus, 10% prod DB bomb
      const rand = Math.random();
      let type: BugType = 'bug';
      if (rand < 0.1) type = 'database';
      else if (rand < 0.22) type = 'coffee';
      else if (rand < 0.42) type = 'critical';

      const updated = [...prev];
      updated[randomIdx] = {
        ...updated[randomIdx],
        active: true,
        type,
        whacked: false,
      };

      // Auto-hide after 800ms - 1300ms
      const duration = type === 'coffee' ? 1000 : Math.max(700, 1200 - (30 - timeLeft) * 15);
      setTimeout(() => {
        setSlots((cur) => {
          if (!cur[randomIdx].active || cur[randomIdx].whacked) return cur;
          const closed = [...cur];
          closed[randomIdx] = { ...closed[randomIdx], active: false };
          return closed;
        });
      }, duration);

      return updated;
    });
  }, [timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setGameState('playing');
    sound.playScore();

    setSlots(
      PORTS.map((port, idx) => ({
        id: idx,
        active: false,
        type: 'bug',
        whacked: false,
        port,
      }))
    );
  };

  // Main 1s countdown clock
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(spawnTimerRef.current!);
          setGameState('gameover');
          sound.playGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Spawning scheduler
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnTimerRef.current = setInterval(() => {
      spawnBug();
    }, 550);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState, spawnBug]);

  const handleWhack = (idx: number, e: React.MouseEvent) => {
    if (gameState !== 'playing') return;

    const slot = slots[idx];
    if (!slot.active || slot.whacked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.width / 2;
    const clickY = rect.height / 2;

    // Mark whacked
    setSlots((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], whacked: true };
      return updated;
    });

    // Handle points based on bug type
    if (slot.type === 'database') {
      // Hit prod DB! Penalty!
      sound.playHit();
      setCombo(0);
      setScore((s) => {
        const next = Math.max(0, s - 200);
        return next;
      });
      addFloatingText('💥 -200 DROP PROD DB!', clickX, clickY, 'text-rose-500 font-bold');
    } else if (slot.type === 'coffee') {
      // Coffee boost!
      sound.playScore();
      setTimeLeft((t) => t + 2);
      setScore((s) => s + 150);
      addFloatingText('☕ +150 & +2 SECS!', clickX, clickY, 'text-amber-400 font-bold');
    } else if (slot.type === 'critical') {
      // Critical bug!
      sound.playWhack();
      setCombo((c) => c + 1);
      const points = 250 + combo * 25;
      setScore((s) => {
        const next = s + points;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('arcade_high_whack_a_bug', String(next));
        }
        return next;
      });
      addFloatingText(`🎯 +${points}`, clickX, clickY, 'text-purple-400 font-bold');
    } else {
      // Regular bug
      sound.playWhack();
      setCombo((c) => c + 1);
      const points = 100 + combo * 10;
      setScore((s) => {
        const next = s + points;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('arcade_high_whack_a_bug', String(next));
        }
        return next;
      });
      addFloatingText(`+${points}`, clickX, clickY, 'text-emerald-400 font-bold');
    }

    // Auto close slot after hit
    setTimeout(() => {
      setSlots((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], active: false, whacked: false };
        return updated;
      });
    }, 280);
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Top Game Bar */}
      <div className="w-full max-w-[540px] flex items-center justify-between px-4 py-2 bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">
            SCORE: <strong className="text-emerald-400 text-sm font-bold">{score}</strong>
          </span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            HI: <strong className="text-amber-400">{highScore}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {combo > 2 && (
            <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              {combo}x
            </span>
          )}
          <span
            className={`flex items-center gap-1 font-bold ${
              timeLeft <= 5 ? 'text-rose-500 animate-bounce' : 'text-sky-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Game Grid Container */}
      <div className="relative w-full max-w-[540px] bg-[#090d16] border border-neutral-800 rounded-b-xl p-4 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-3 gap-3 aspect-square max-h-[460px]">
          {slots.map((slot, idx) => (
            <div
              key={slot.id}
              onClick={(e) => handleWhack(idx, e)}
              className={`relative rounded-xl border border-neutral-800 flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-150 overflow-hidden ${
                slot.active
                  ? slot.type === 'database'
                    ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-900/20'
                    : slot.type === 'coffee'
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-900/20'
                    : 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-900/20'
                  : 'bg-neutral-900/80 hover:bg-neutral-850'
              }`}
            >
              {/* Terminal Port header */}
              <span className="absolute top-2 left-2 text-[9px] font-mono text-neutral-500">
                {slot.port}
              </span>

              {/* Bug Entity */}
              {slot.active && (
                <div
                  className={`flex flex-col items-center justify-center transform transition-transform duration-100 ${
                    slot.whacked ? 'scale-75 opacity-60' : 'scale-110 animate-bounce'
                  }`}
                >
                  <span className="text-4xl filter drop-shadow-md">
                    {slot.whacked
                      ? '💥'
                      : slot.type === 'bug'
                      ? '🐛'
                      : slot.type === 'critical'
                      ? '🐞'
                      : slot.type === 'coffee'
                      ? '☕'
                      : '💣'}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold mt-1 uppercase ${
                      slot.type === 'database'
                        ? 'text-rose-400'
                        : slot.type === 'coffee'
                        ? 'text-amber-400'
                        : slot.type === 'critical'
                        ? 'text-purple-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {slot.whacked
                      ? 'FIXED!'
                      : slot.type === 'bug'
                      ? 'Bug'
                      : slot.type === 'critical'
                      ? 'Critical'
                      : slot.type === 'coffee'
                      ? '+Coffee'
                      : 'DON\'T HIT!'}
                  </span>
                </div>
              )}

              {!slot.active && (
                <div className="w-8 h-1 bg-neutral-800 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Floating hit indicators */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className={`absolute pointer-events-none text-xs font-mono animate-out fade-out slide-out-to-top-6 duration-700 ${item.color}`}
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </div>
        ))}

        {/* Start / Idle Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 mb-3">
              <span className="text-3xl">🔨</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase font-mono">
              Whack-A-Bug
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-sm">
              Bugs are popping out of open ports! Click or tap to patch them before release.
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 max-w-xs space-y-1">
              <p>🐛 <strong>Green Bug:</strong> +100 pts</p>
              <p>🐞 <strong>Critical Bug:</strong> +250 pts</p>
              <p>☕ <strong>Coffee:</strong> +150 pts & +2 seconds</p>
              <p>💣 <strong>Prod DB:</strong> -200 pts penalty (DO NOT HIT!)</p>
            </div>

            <button
              onClick={startGame}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-mono font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              START SQUASHING
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
            <div className="text-4xl mb-2">⏱️</div>
            <h2 className="text-2xl font-bold text-teal-400 uppercase tracking-widest font-mono">
              Sprint Complete!
            </h2>
            <p className="text-neutral-300 text-xs mt-1">Sprint time expired. All patched bugs tallied.</p>

            <div className="my-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs flex gap-6">
              <div>
                <div className="text-neutral-400 text-[10px]">FINAL SCORE</div>
                <div className="text-lg font-bold text-emerald-400">{score}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">RECORD</div>
                <div className="text-lg font-bold text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white font-mono font-bold text-xs hover:bg-teal-400 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                PLAY AGAIN
              </button>
              <button
                onClick={onBackToMenu}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 font-mono text-xs hover:bg-neutral-700 transition-all"
              >
                ARCADE MENU
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
