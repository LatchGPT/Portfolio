'use client';

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  X,
  Volume2,
  VolumeX,
  ArrowLeft,
  Sparkles,
  Trophy,
  Flame,
  Zap
} from 'lucide-react';
import { sound } from './sound-fx';
import { BugInvaders } from './bug-invaders';
import { FlappyDev } from './flappy-dev';
import { CodeTyper } from './code-typer';
import { TowerStacker } from './tower-stacker';

type GameId = 'bug-invaders' | 'flappy-dev' | 'code-typer' | 'tower-stacker' | null;

interface GameDef {
  id: 'bug-invaders' | 'flappy-dev' | 'code-typer' | 'tower-stacker';
  title: string;
  tagline: string;
  genre: string;
  icon: string;
  badgeColor: string;
  buttonGradient: string;
  difficulty: 'Casual' | 'Medium' | 'Challenging';
  storageKey: string;
}

const GAMES: GameDef[] = [
  {
    id: 'bug-invaders',
    title: 'Bug Invaders',
    tagline: 'Defend your codebase from descending waves of syntax & 404 bugs!',
    genre: 'Retro Space Shooter',
    icon: '👾',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    buttonGradient: 'from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400',
    difficulty: 'Medium',
    storageKey: 'arcade_high_bug_invaders',
  },
  {
    id: 'flappy-dev',
    title: 'Flappy Dev',
    tagline: 'Flap through endless server racks and cloud infrastructure pipelines.',
    genre: 'Physics Flapper',
    icon: '🚀',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    buttonGradient: 'from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400',
    difficulty: 'Challenging',
    storageKey: 'arcade_high_flappy_dev',
  },
  {
    id: 'code-typer',
    title: 'Code Typer (ZType)',
    tagline: 'Lock and fire lasers at falling tech keywords by typing letters on your keyboard.',
    genre: 'Typing Defense',
    icon: '⌨️',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    buttonGradient: 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    difficulty: 'Challenging',
    storageKey: 'arcade_high_code_typer',
  },
  {
    id: 'tower-stacker',
    title: 'Tower Stacker',
    tagline: 'Stack your tech architecture into the clouds. Overhang gets sliced off!',
    genre: 'Precision Stacker',
    icon: '🏗️',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    buttonGradient: 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    difficulty: 'Medium',
    storageKey: 'arcade_high_tower_stacker',
  },
];

export function ArcadeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  // Sync mute state on mount
  useEffect(() => {
    setIsMuted(sound.isMuted());
    loadHighScores();
  }, [isOpen]);

  const loadHighScores = () => {
    if (typeof window === 'undefined') return;
    const scores: Record<string, number> = {};
    GAMES.forEach((g) => {
      const val = localStorage.getItem(g.storageKey);
      scores[g.id] = val ? parseInt(val, 10) : 0;
    });
    setHighScores(scores);
  };

  // Event listener for opening arcade modal
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        const next = !prev;
        if (!next) setActiveGame(null);
        return next;
      });
    };

    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('toggle-arcade', handleToggle);
    window.addEventListener('open-arcade', handleOpen);

    // Escape key listener to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (activeGame !== null) {
          setActiveGame(null);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-arcade', handleToggle);
      window.removeEventListener('open-arcade', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeGame]);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleSelectGame = (id: GameDef['id']) => {
    sound.playScore();
    setActiveGame(id);
  };

  const handleBackToMenu = () => {
    loadHighScores();
    setActiveGame(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveGame(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-2">
            {activeGame ? (
              <button
                onClick={handleBackToMenu}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Games</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    LATCH ARCADE HUB
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      4 Mini-Games
                    </span>
                  </h2>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mute Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
                isMuted
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                  : 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
              }`}
              title={isMuted ? 'Sound is MUTED (Click to unmute)' : 'Sound is ON (Click to mute)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="Close Arcade (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {activeGame === null ? (
            /* Game Selector Lobby */
            <div>
              <div className="text-center max-w-lg mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive Portfolio Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Choose a Game to Play
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Built with HTML5 Canvas, Web Audio API, and real-time physics. High scores are saved locally!
                </p>
              </div>

              {/* 4 Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAMES.map((game) => {
                  const score = highScores[game.id] || 0;

                  return (
                    <div
                      key={game.id}
                      onClick={() => handleSelectGame(game.id)}
                      className="group relative p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <div>
                        {/* Top row: Icon + Difficulty Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {game.icon}
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${game.badgeColor}`}
                          >
                            {game.difficulty}
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors font-mono">
                          {game.title}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {game.tagline}
                        </p>
                      </div>

                      {/* Bottom row: High Score + Play CTA */}
                      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Best:</span>
                          <strong className="text-amber-400">{score}</strong>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r text-white text-xs font-mono font-bold shadow-md transition-all ${game.buttonGradient}`}
                        >
                          Play Now →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Footer Info */}
              <div className="mt-6 pt-4 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 text-center">
                <span>💡 Tip: Audio plays zero-latency 8-bit synth tones via Web Audio API.</span>
                <span className="text-neutral-400">Press ESC anytime to exit</span>
              </div>
            </div>
          ) : (
            /* Active Game View */
            <div className="flex justify-center items-center py-1">
              {activeGame === 'bug-invaders' && <BugInvaders onBackToMenu={handleBackToMenu} />}
              {activeGame === 'flappy-dev' && <FlappyDev onBackToMenu={handleBackToMenu} />}
              {activeGame === 'code-typer' && <CodeTyper onBackToMenu={handleBackToMenu} />}
              {activeGame === 'tower-stacker' && <TowerStacker onBackToMenu={handleBackToMenu} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
