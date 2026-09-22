'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from './sound-fx';
import { RotateCcw, Play, Pause, Trophy, Heart } from 'lucide-react';

interface BugInvadersProps {
  onBackToMenu: () => void;
}

interface Bullet {
  x: number;
  y: number;
  speed: number;
  isPlayer: boolean;
}

interface Bug {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number; // 0, 1, 2
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
}

export function BugInvaders({ onBackToMenu }: BugInvadersProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const highScoreRef = useRef(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');

  // Input states
  const keys = useRef<{ left: boolean; right: boolean; shoot: boolean }>({
    left: false,
    right: false,
    shoot: false,
  });

  // Game internal state ref
  const engine = useRef<{
    playerX: number;
    playerWidth: number;
    playerHeight: number;
    bullets: Bullet[];
    bugs: Bug[];
    particles: Particle[];
    bugDirection: number;
    bugSpeed: number;
    lastShotTime: number;
    lastBugShotTime: number;
    animationId: number;
    wave: number;
    score: number;
    lives: number;
    isWaveTransitioning: boolean;
    waveTransitionEndTime: number;
    clearedWaveNum: number;
  }>({
    playerX: 275,
    playerWidth: 44,
    playerHeight: 24,
    bullets: [],
    bugs: [],
    particles: [],
    bugDirection: 1,
    bugSpeed: 0.8,
    lastShotTime: 0,
    lastBugShotTime: 0,
    animationId: 0,
    wave: 1,
    score: 0,
    lives: 3,
    isWaveTransitioning: false,
    waveTransitionEndTime: 0,
    clearedWaveNum: 0,
  });

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('arcade_high_bug_invaders');
    if (saved) {
      const val = parseInt(saved, 10);
      setHighScore(val);
      highScoreRef.current = val;
    }
  }, []);

  const initBugs = useCallback((waveNum: number) => {
    const bugs: Bug[] = [];
    const rows = 4;
    const cols = 8;
    const startX = 40;
    const startY = Math.min(50 + (waveNum - 1) * 6, 88);
    const gapX = 48;
    const gapY = 36;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bugs.push({
          x: startX + c * gapX,
          y: startY + r * gapY,
          width: 30,
          height: 22,
          type: r,
          alive: true,
        });
      }
    }
    return bugs;
  }, []);

  const startGame = () => {
    engine.current.score = 0;
    engine.current.lives = 3;
    engine.current.wave = 1;
    engine.current.bullets = [];
    engine.current.particles = [];
    engine.current.bugDirection = 1;
    engine.current.bugSpeed = 0.9;
    engine.current.playerX = 275;
    engine.current.bugs = initBugs(1);
    engine.current.isWaveTransitioning = false;
    engine.current.waveTransitionEndTime = 0;
    engine.current.clearedWaveNum = 0;

    setScore(0);
    setLives(3);
    setWave(1);
    setGameState('playing');
    sound.playScore();
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || ['ArrowLeft', 'a', 'A'].includes(e.key)) {
        keys.current.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || ['ArrowRight', 'd', 'D'].includes(e.key)) {
        keys.current.right = true;
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        keys.current.shoot = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || ['ArrowLeft', 'a', 'A'].includes(e.key)) {
        keys.current.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || ['ArrowRight', 'd', 'D'].includes(e.key)) {
        keys.current.right = false;
      }
      if (e.code === 'Space' || e.key === ' ') {
        keys.current.shoot = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const spawnParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        engine.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          life: 25 + Math.random() * 15,
        });
      }
    };

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const state = engine.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Move Player
      if (keys.current.left && state.playerX > 10) {
        state.playerX -= 4.8;
      }
      if (keys.current.right && state.playerX < width - state.playerWidth - 10) {
        state.playerX += 4.8;
      }

      // 2. Shoot Player Laser
      if (keys.current.shoot && timestamp - state.lastShotTime > 260) {
        state.bullets.push({
          x: state.playerX + state.playerWidth / 2,
          y: height - state.playerHeight - 12,
          speed: -7.5,
          isPlayer: true,
        });
        state.lastShotTime = timestamp;
        sound.playLaser();
      }

      // 3. Update & Move Bullets
      state.bullets.forEach((b) => (b.y += b.speed));
      state.bullets = state.bullets.filter((b) => b.y > -10 && b.y < height + 10);

      // 4. Update Bugs & Wave Progress
      let hitEdge = false;
      const aliveBugs = state.bugs.filter((b) => b.alive);

      // Check if current wave is cleared
      if (aliveBugs.length === 0 && !state.isWaveTransitioning && state.bugs.length > 0) {
        state.isWaveTransitioning = true;
        state.waveTransitionEndTime = timestamp + 1600;
        state.clearedWaveNum = state.wave;

        // Wave clear bonus points
        const waveBonus = state.wave * 250 + 250;
        state.score += waveBonus;
        setScore(state.score);

        if (state.score > highScoreRef.current) {
          highScoreRef.current = state.score;
          setHighScore(state.score);
          localStorage.setItem('arcade_high_bug_invaders', String(state.score));
        }

        // Clear bug bullets so player isn't hit during celebration
        state.bullets = state.bullets.filter((b) => b.isPlayer);
        sound.playScore();
      }

      // Check if wave transition completed -> spawn next wave
      if (state.isWaveTransitioning) {
        if (timestamp >= state.waveTransitionEndTime) {
          state.isWaveTransitioning = false;
          const nextWaveNum = state.wave + 1;
          state.wave = nextWaveNum;
          setWave(nextWaveNum);
          state.bugs = initBugs(nextWaveNum);
          state.bugDirection = 1;
          state.bugSpeed = Math.min(0.9 + (nextWaveNum - 1) * 0.22, 2.8);
          state.bullets = [];
          sound.playScore();
        }
      }

      // Move bugs and shoot only when not transitioning
      if (!state.isWaveTransitioning && aliveBugs.length > 0) {
        const aliveCount = aliveBugs.length;
        const speedMultiplier = 1 + (32 - aliveCount) * 0.015;

        for (const bug of aliveBugs) {
          bug.x += state.bugDirection * state.bugSpeed * speedMultiplier;
          if (bug.x + bug.width > width - 15 || bug.x < 15) {
            hitEdge = true;
          }

          // Check if bugs reached bottom (Game Over)
          if (bug.y + bug.height >= height - state.playerHeight - 15) {
            state.lives = 0;
            setLives(0);
            setGameState('gameover');
            sound.playGameOver();
            return;
          }
        }

        if (hitEdge) {
          state.bugDirection *= -1;
          for (const bug of aliveBugs) {
            bug.y += 14;
          }
        }

        // Random bug shot
        if (timestamp - state.lastBugShotTime > Math.max(900 - state.wave * 70, 380)) {
          const randomBug = aliveBugs[Math.floor(Math.random() * aliveBugs.length)];
          state.bullets.push({
            x: randomBug.x + randomBug.width / 2,
            y: randomBug.y + randomBug.height,
            speed: Math.min(3.8 + state.wave * 0.35, 7),
            isPlayer: false,
          });
          state.lastBugShotTime = timestamp;
        }
      }

      // 5. Collision Checks: Player Laser vs Bugs
      if (!state.isWaveTransitioning && aliveBugs.length > 0) {
        for (const bullet of state.bullets.filter((b) => b.isPlayer)) {
          for (const bug of aliveBugs) {
            if (
              bullet.x > bug.x &&
              bullet.x < bug.x + bug.width &&
              bullet.y > bug.y &&
              bullet.y < bug.y + bug.height
            ) {
              bug.alive = false;
              bullet.y = -999; // destroy bullet

              const bugPoints = (4 - bug.type) * 50;
              state.score += bugPoints;
              setScore(state.score);

              if (state.score > highScoreRef.current) {
                highScoreRef.current = state.score;
                setHighScore(state.score);
                localStorage.setItem('arcade_high_bug_invaders', String(state.score));
              }

              const colors = ['#ef4444', '#f59e0b', '#a855f7', '#06b6d4'];
              spawnParticles(bug.x + bug.width / 2, bug.y + bug.height / 2, colors[bug.type]);
              sound.playHit();
              break;
            }
          }
        }
      }

      // 6. Collision: Bug Laser vs Player
      for (const bullet of state.bullets.filter((b) => !b.isPlayer)) {
        if (
          bullet.x > state.playerX &&
          bullet.x < state.playerX + state.playerWidth &&
          bullet.y > height - state.playerHeight - 16 &&
          bullet.y < height - 5
        ) {
          bullet.y = 9999;
          state.lives -= 1;
          setLives(state.lives);
          spawnParticles(state.playerX + state.playerWidth / 2, height - 20, '#38bdf8');
          sound.playHit();

          if (state.lives <= 0) {
            setGameState('gameover');
            sound.playGameOver();
            return;
          }
        }
      }

      // 7. Update Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.life--;
      });
      state.particles = state.particles.filter((p) => p.life > 0 && p.alpha > 0);

      // --- RENDER ---
      ctx.fillStyle = '#090d16'; // Deep space terminal dark
      ctx.fillRect(0, 0, width, height);

      // Grid scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      // Draw Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Bullets
      state.bullets.forEach((b) => {
        if (b.isPlayer) {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x - 2, b.y, 4, 12);
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x - 2, b.y, 4, 10);
        }
        ctx.shadowBlur = 0;
      });

      // Draw Bugs
      const bugLabels = ['[ERR]', 'null', '{404}', 'BUG'];
      const bugColors = ['#f87171', '#fbbf24', '#c084fc', '#38bdf8'];

      state.bugs.forEach((bug) => {
        if (!bug.alive) return;

        // Bug Body
        ctx.fillStyle = bugColors[bug.type];
        ctx.shadowColor = bugColors[bug.type];
        ctx.shadowBlur = 6;

        // Draw cute retro sprite/box
        ctx.beginPath();
        ctx.roundRect(bug.x, bug.y, bug.width, bug.height, 4);
        ctx.fill();

        // Antennae / legs
        ctx.fillRect(bug.x + 4, bug.y - 3, 3, 4);
        ctx.fillRect(bug.x + bug.width - 7, bug.y - 3, 3, 4);

        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.shadowBlur = 0;
        ctx.fillRect(bug.x + 6, bug.y + 6, 4, 4);
        ctx.fillRect(bug.x + bug.width - 10, bug.y + 6, 4, 4);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bugLabels[bug.type], bug.x + bug.width / 2, bug.y + 17);
      });

      // Draw Player Ship (Dev Terminal Terminal Ship)
      const px = state.playerX;
      const py = height - state.playerHeight - 12;

      ctx.fillStyle = '#10b981'; // Emerald dev ship
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;

      // Base
      ctx.beginPath();
      ctx.roundRect(px, py + 8, state.playerWidth, state.playerHeight - 8, 4);
      ctx.fill();

      // Cockpit / Cannon
      ctx.fillRect(px + state.playerWidth / 2 - 4, py, 8, 12);
      ctx.fillRect(px + state.playerWidth / 2 - 2, py - 4, 4, 5);

      ctx.fillStyle = '#ecfdf5';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('>_', px + state.playerWidth / 2, py + 18);
      ctx.shadowBlur = 0;

      // Draw Wave Clear Banner Overlay
      if (state.isWaveTransitioning) {
        ctx.save();
        const bannerW = 320;
        const bannerH = 100;
        const bannerX = (width - bannerW) / 2;
        const bannerY = height / 2 - 60;

        // Background box
        ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 10);
        ctx.fill();
        ctx.stroke();

        // Wave title
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.fillText(`WAVE ${state.clearedWaveNum} CLEARED!`, width / 2, bannerY + 34);

        // Bonus text
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px monospace';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.fillText(`+${state.clearedWaveNum * 250 + 250} BONUS PTS`, width / 2, bannerY + 60);

        // Prepare wave
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.shadowBlur = 0;
        ctx.fillText(`GET READY FOR WAVE ${state.clearedWaveNum + 1}...`, width / 2, bannerY + 84);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    let animId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [gameState, initBugs]);

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Top Game Bar */}
      <div className="w-full max-w-[600px] flex items-center justify-between px-3 py-2 bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">
            SCORE: <strong className="text-emerald-400 text-sm font-bold">{score}</strong>
          </span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            HI: <strong className="text-amber-400">{highScore}</strong>
          </span>
          <span className="text-neutral-400">
            WAVE: <strong className="text-sky-400">{wave}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-rose-400" title={`${lives} Shields Remaining`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Area with Overlays */}
      <div className="relative w-full max-w-[600px] aspect-[600/460] bg-[#090d16] border border-neutral-800 rounded-b-xl overflow-hidden shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={460}
          className="w-full h-full block touch-none"
        />

        {/* Start / Idle Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-3">
              <span className="text-3xl">👾</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase font-mono">
              Bug Invaders
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-sm">
              Defend your codebase from descending runtime exceptions, null pointers, and 404 errors!
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 max-w-xs space-y-1">
              <p>🎮 <strong>Desktop:</strong> [← / →] or [A / D] to Move, [Space] to Fire</p>
              <p>📱 <strong>Mobile:</strong> Use on-screen touch buttons below</p>
            </div>

            <button
              onClick={startGame}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono font-bold text-sm hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              START GAME
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
            <div className="text-4xl mb-2">💥</div>
            <h2 className="text-2xl font-bold text-rose-500 uppercase tracking-widest font-mono">
              Build Broken!
            </h2>
            <p className="text-neutral-300 text-xs mt-1">Bugs successfully deployed to production.</p>

            <div className="my-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs flex gap-6">
              <div>
                <div className="text-neutral-400 text-[10px]">FINAL SCORE</div>
                <div className="text-lg font-bold text-emerald-400">{score}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-[10px]">HIGHEST SCORE</div>
                <div className="text-lg font-bold text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 text-white font-mono font-bold text-xs hover:bg-emerald-400 active:scale-95 transition-all"
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

      {/* Mobile Touch Controls Bar */}
      <div className="w-full max-w-[600px] mt-3 flex items-center justify-between gap-2 px-2">
        <div className="flex gap-2">
          <button
            onPointerDown={() => (keys.current.left = true)}
            onPointerUp={() => (keys.current.left = false)}
            onPointerLeave={() => (keys.current.left = false)}
            className="w-14 h-12 rounded-xl bg-neutral-800 active:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-xl font-bold text-white shadow-md select-none touch-manipulation"
          >
            ◀
          </button>
          <button
            onPointerDown={() => (keys.current.right = true)}
            onPointerUp={() => (keys.current.right = false)}
            onPointerLeave={() => (keys.current.right = false)}
            className="w-14 h-12 rounded-xl bg-neutral-800 active:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-xl font-bold text-white shadow-md select-none touch-manipulation"
          >
            ▶
          </button>
        </div>

        <button
          onPointerDown={() => {
            keys.current.shoot = true;
          }}
          onPointerUp={() => {
            keys.current.shoot = false;
          }}
          onPointerLeave={() => {
            keys.current.shoot = false;
          }}
          className="flex-1 max-w-[180px] h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 active:from-emerald-500 active:to-teal-500 border border-emerald-500 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-white shadow-md select-none touch-manipulation"
        >
          <span>FIRE LASER</span>
        </button>
      </div>
    </div>
  );
}
