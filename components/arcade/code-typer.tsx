'use client';

import React, { useRef, useEffect, useState } from 'react';
import { sound } from './sound-fx';
import { RotateCcw, Play, Trophy, Zap, Keyboard } from 'lucide-react';

interface CodeTyperProps {
  onBackToMenu: () => void;
}

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  matchedLetters: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
}

const WORD_BANK = [
  'async', 'await', 'react', 'nextjs', 'docker', 'deploy', 'git', 'push',
  'tailwind', 'prisma', 'postgres', 'graphql', 'lambda', 'branch', 'debug',
  'function', 'promise', 'kernel', 'pipeline', 'frontend', 'backend', 'cloud',
  'eslint', 'router', 'npm', 'bun', 'vite', 'node', 'server', 'client',
  'fetch', 'oauth', 'token', 'cache', 'state', 'props', 'hook', 'vercel'
];

export function CodeTyper({ onBackToMenu }: CodeTyperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wordsCleared, setWordsCleared] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  const engine = useRef<{
    words: FallingWord[];
    sparks: Spark[];
    targetId: number | null;
    lastSpawnTime: number;
    score: number;
    streak: number;
    wordsCleared: number;
    animationId: number;
    nextId: number;
    laserTarget: { x: number; y: number } | null;
  }>({
    words: [],
    sparks: [],
    targetId: null,
    lastSpawnTime: 0,
    score: 0,
    streak: 0,
    wordsCleared: 0,
    animationId: 0,
    nextId: 1,
    laserTarget: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('arcade_high_code_typer');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    engine.current.words = [];
    engine.current.sparks = [];
    engine.current.targetId = null;
    engine.current.lastSpawnTime = 0;
    engine.current.score = 0;
    engine.current.streak = 0;
    engine.current.wordsCleared = 0;
    engine.current.nextId = 1;
    engine.current.laserTarget = null;

    setScore(0);
    setStreak(0);
    setWordsCleared(0);
    setGameState('playing');
    sound.playScore();

    // Focus hidden input for mobile keyboard support
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
  };

  // Keyboard processing
  const handleTypedChar = (char: string) => {
    if (gameState !== 'playing') return;
    const lower = char.toLowerCase();
    if (!/^[a-z]$/.test(lower)) return;

    const state = engine.current;

    // 1. If we currently have a locked target word
    if (state.targetId !== null) {
      const target = state.words.find((w) => w.id === state.targetId);
      if (target) {
        const nextExpected = target.word[target.matchedLetters]?.toLowerCase();
        if (lower === nextExpected) {
          // Matched letter!
          target.matchedLetters++;
          state.laserTarget = { x: target.x, y: target.y };
          sound.playTypingHit();

          // Spawn letter sparks
          for (let i = 0; i < 6; i++) {
            state.sparks.push({
              x: target.x + target.matchedLetters * 10,
              y: target.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: '#38bdf8',
              alpha: 1,
              life: 15,
            });
          }

          // Word completely typed!
          if (target.matchedLetters >= target.word.length) {
            // Explode whole word
            for (let i = 0; i < 20; i++) {
              state.sparks.push({
                x: target.x,
                y: target.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#10b981',
                alpha: 1,
                life: 25,
              });
            }

            const points = target.word.length * 20 * (1 + Math.min(state.streak, 10) * 0.2);
            state.score += Math.round(points);
            state.streak += 1;
            state.wordsCleared += 1;
            state.targetId = null;

            setScore(state.score);
            setStreak(state.streak);
            setWordsCleared(state.wordsCleared);
            sound.playScore();

            if (state.score > highScore) {
              setHighScore(state.score);
              localStorage.setItem('arcade_high_code_typer', String(state.score));
            }

            // Remove word
            state.words = state.words.filter((w) => w.id !== target.id);
          }
          return;
        } else {
          // Typo on current target
          state.streak = 0;
          setStreak(0);
          sound.playHit();
          return;
        }
      } else {
        state.targetId = null;
      }
    }

    // 2. No target locked, find closest word that starts with this char
    const candidateWords = state.words.filter(
      (w) => w.matchedLetters === 0 && w.word[0]?.toLowerCase() === lower
    );

    if (candidateWords.length > 0) {
      // Pick the lowest word (closest to bottom)
      candidateWords.sort((a, b) => b.y - a.y);
      const chosen = candidateWords[0];
      state.targetId = chosen.id;
      chosen.matchedLetters = 1;
      state.laserTarget = { x: chosen.x, y: chosen.y };
      sound.playTypingHit();

      // Check if 1-letter word (rare)
      if (chosen.matchedLetters >= chosen.word.length) {
        state.score += 20;
        state.streak += 1;
        state.wordsCleared += 1;
        state.targetId = null;
        setScore(state.score);
        setStreak(state.streak);
        setWordsCleared(state.wordsCleared);
        sound.playScore();
        state.words = state.words.filter((w) => w.id !== chosen.id);
      }
    } else {
      // Missed key
      state.streak = 0;
      setStreak(0);
    }
  };

  const handleTypedCharRef = useRef(handleTypedChar);
  handleTypedCharRef.current = handleTypedChar;

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key.length === 1) {
        handleTypedCharRef.current(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const width = canvas.width;
    const height = canvas.height;

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const state = engine.current;

      // 1. Spawn words
      const spawnInterval = Math.max(2200 - state.wordsCleared * 60, 1100);
      if (timestamp - state.lastSpawnTime > spawnInterval) {
        const randomWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
        const wordWidth = randomWord.length * 14;
        const x = 40 + Math.random() * (width - wordWidth - 80);

        state.words.push({
          id: state.nextId++,
          word: randomWord,
          x,
          y: -10,
          speed: 0.6 + Math.min(state.wordsCleared * 0.03, 1.2),
          matchedLetters: 0,
        });
        state.lastSpawnTime = timestamp;
      }

      // 2. Move words & check bottom breach
      for (const w of state.words) {
        w.y += w.speed;

        if (w.y >= height - 40) {
          // Word breached terminal perimeter -> Game Over!
          setGameState('gameover');
          sound.playGameOver();
          return;
        }
      }

      // 3. Update sparks
      state.sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.04;
        s.life--;
      });
      state.sparks = state.sparks.filter((s) => s.life > 0 && s.alpha > 0);

      // --- RENDER ---
      // Background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      for (let y = 0; y < height; y += 30) {
        ctx.fillRect(0, y, width, 1);
      }

      // Bottom Defense Line
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height - 35);
      ctx.lineTo(width, height - 35);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = '9px monospace';
      ctx.fillText('CRITICAL PERIMETER', 15, height - 22);

      // Draw Laser Beam from Cannon to locked target
      if (state.targetId !== null) {
        const target = state.words.find((w) => w.id === state.targetId);
        if (target) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(width / 2, height - 20);
          ctx.lineTo(target.x + target.matchedLetters * 11, target.y + 4);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.lineWidth = 1;
        }
      }

      // Draw Sparks
      state.sparks.forEach((s) => {
        ctx.save();
        ctx.globalAlpha = Math.max(s.alpha, 0);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Falling Words
      ctx.font = 'bold 15px monospace';
      state.words.forEach((w) => {
        const isTarget = w.id === state.targetId;

        // Word Box / Tag
        const textWidth = ctx.measureText(w.word).width;
        ctx.fillStyle = isTarget ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = isTarget ? '#38bdf8' : '#334155';
        ctx.beginPath();
        ctx.roundRect(w.x - 8, w.y - 14, textWidth + 16, 22, 6);
        ctx.fill();
        ctx.stroke();

        // Render matched letters in Emerald/Sky, rest in White
        let currentX = w.x;
        for (let i = 0; i < w.word.length; i++) {
          const char = w.word[i];
          const charWidth = ctx.measureText(char).width;

          if (i < w.matchedLetters) {
            ctx.fillStyle = '#10b981'; // Solved
          } else if (isTarget && i === w.matchedLetters) {
            ctx.fillStyle = '#f59e0b'; // Next letter to type
          } else {
            ctx.fillStyle = '#f8fafc';
          }

          ctx.fillText(char, currentX, w.y + 2);
          currentX += charWidth;
        }
      });

      // Draw Player Cannon at Bottom Center
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(width / 2, height - 10, 16, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(width / 2, height - 10, 6, Math.PI, 0);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    let animId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [gameState, highScore]);

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Hidden input for mobile keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none -top-96"
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            handleTypedChar(val[val.length - 1]);
            e.target.value = '';
          }
        }}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
      />

      {/* Top Game Bar */}
      <div className="w-full max-w-[600px] flex items-center justify-between px-4 py-2 bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl text-xs font-mono">
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
          {streak > 1 && (
            <span className="text-amber-400 flex items-center gap-1 font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              {streak}x COMBO
            </span>
          )}
          <span className="text-neutral-400">
            CLEARED: <strong className="text-sky-400">{wordsCleared}</strong>
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        onClick={() => hiddenInputRef.current?.focus()}
        className="relative w-full max-w-[600px] aspect-[600/440] bg-[#0a0d14] border border-neutral-800 rounded-b-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-text"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={440}
          className="w-full h-full block"
        />

        {/* Start / Idle Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
              <span className="text-3xl">⌨️</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase font-mono">
              Code Typer (ZType)
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-sm">
              Falling tech keywords are attacking your server! Type the code words to target and shoot lasers to vaporize them.
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 max-w-xs space-y-1">
              <p>⌨️ Simply type letters on your keyboard to lock and fire!</p>
              <p>⚡ Build combos without typos for higher score multipliers.</p>
            </div>

            <button
              onClick={startGame}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono font-bold text-sm hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              START TYPING
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
            <div className="text-4xl mb-2">🛑</div>
            <h2 className="text-2xl font-bold text-rose-500 uppercase tracking-widest font-mono">
              Terminal Breached!
            </h2>
            <p className="text-neutral-300 text-xs mt-1">A word slipped past your defensive cannon.</p>

            <div className="my-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs flex gap-6">
              <div>
                <div className="text-neutral-400 text-[10px]">TOTAL SCORE</div>
                <div className="text-lg font-bold text-emerald-400">{score}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">WORDS CLEARED</div>
                <div className="text-lg font-bold text-sky-400">{wordsCleared}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">RECORD</div>
                <div className="text-lg font-bold text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 text-white font-mono font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all"
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

      {/* Mobile Keyboard Trigger helper */}
      <div className="w-full max-w-[600px] mt-2 flex justify-center">
        <button
          onClick={() => hiddenInputRef.current?.focus()}
          className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-mono"
        >
          <Keyboard className="w-3.5 h-3.5 text-sky-400" />
          Tap to Open Mobile Keyboard
        </button>
      </div>
    </div>
  );
}
