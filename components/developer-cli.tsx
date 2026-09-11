'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';
import { personalInfo } from '@/data/personal';
import { projectsData } from '@/data/projects';
import { skillsData } from '@/data/skills';
import { experienceData } from '@/data/experience';
import { educationData } from '@/data/education';
import { useTheme } from './theme-provider';
import { useRouter } from 'next/navigation';

interface OutputLine {
  type: 'input' | 'output' | 'system' | 'error';
  text: string | React.ReactNode;
}

const COMMAND_LIST = [
  'help',
  'whoami',
  'bio',
  'skills',
  'projects',
  'experience',
  'education',
  'cat resume',
  'contact',
  'open',
  'theme',
  'clear',
  'date',
  'echo',
  'exit'
];

export function DeveloperCli() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [output, setOutput] = useState<OutputLine[]>([
    {
      type: 'system',
      text: (
        <div>
          <p className="text-sky-400 font-bold">Latch Ayhon Portfolio Terminal v2.4 (CLI Mode)</p>
          <p className="text-neutral-400 text-xs mt-0.5">
            Type <span className="text-emerald-400 font-semibold font-mono">help</span> to view all commands, or use Tab to auto-complete.
          </p>
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  // Listen to custom toggle event
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-cli', handleToggle);

    // Global keyboard listener: backtick (`) or Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '`' || e.key === '~') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-cli', handleToggle);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, output]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setOutput(prev => [...prev, { type: 'input', text: `$ ` }]);
      return;
    }

    // Save to history
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLines: OutputLine[] = [{ type: 'input', text: `$ ${trimmed}` }];

    switch (cmd) {
      case 'help':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-1 my-1 font-mono text-xs">
              <p className="text-sky-400 font-semibold">Available Shell Commands:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-neutral-300">
                <div><span className="text-emerald-400 font-bold">whoami / bio</span> - Overview & profile</div>
                <div><span className="text-emerald-400 font-bold">projects</span> - List full-stack projects</div>
                <div><span className="text-emerald-400 font-bold">skills</span> - Breakdown of tech stack</div>
                <div><span className="text-emerald-400 font-bold">experience</span> - QA & technician roles</div>
                <div><span className="text-emerald-400 font-bold">education</span> - RTU degree & GWA (1.48)</div>
                <div><span className="text-emerald-400 font-bold">cat resume</span> - Print resume summary</div>
                <div><span className="text-emerald-400 font-bold">contact</span> - Show email, phone & social</div>
                <div><span className="text-emerald-400 font-bold">open &lt;item&gt;</span> - Open project or link</div>
                <div><span className="text-emerald-400 font-bold">theme [dark|light]</span> - Toggle color scheme</div>
                <div><span className="text-emerald-400 font-bold">clear</span> - Clear terminal window</div>
                <div><span className="text-emerald-400 font-bold">exit</span> - Close terminal</div>
              </div>
            </div>
          )
        });
        break;

      case 'whoami':
      case 'bio':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-1.5 my-1 text-xs text-neutral-300 font-mono">
              <p className="text-white font-bold text-sm">{personalInfo.name}</p>
              <p className="text-sky-400">{personalInfo.role}</p>
              <p className="text-neutral-400">{personalInfo.summary || personalInfo.headline}</p>
              <p className="text-neutral-400">Location: {personalInfo.location || 'Cainta, Rizal'}</p>
            </div>
          )
        });
        break;

      case 'skills':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-2 my-1 text-xs font-mono">
              {skillsData.map((s, i) => (
                <div key={i}>
                  <span className="text-amber-400 font-bold">{s.title}:</span>{' '}
                  <span className="text-neutral-300">{s.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          )
        });
        break;

      case 'projects':
      case 'ls':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-2.5 my-1 text-xs font-mono">
              {projectsData.map((p) => (
                <div key={p.slug} className="border-l-2 border-sky-500 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{p.name}</span>
                    <span className="text-neutral-500">[{p.category}]</span>
                  </div>
                  <p className="text-neutral-400 mt-0.5">{p.description}</p>
                  <div className="text-neutral-300 mt-1 flex flex-wrap gap-2">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300">
                        Live: {p.liveUrl}
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline hover:text-white">
                        Repo: {p.githubUrl}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        });
        break;

      case 'experience':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-3 my-1 text-xs font-mono">
              {experienceData.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500 pl-2">
                  <div className="text-white font-bold">{exp.role} @ {exp.company}</div>
                  <div className="text-neutral-500 text-[11px]">{exp.period}</div>
                  <ul className="list-disc list-inside mt-1 text-neutral-300 space-y-0.5">
                    {exp.responsibilities.map((r, rI) => (
                      <li key={rI}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        });
        break;

      case 'education':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-1.5 my-1 text-xs font-mono">
              <p className="text-white font-bold">{educationData.institution} ({educationData.period})</p>
              <p className="text-sky-400">{educationData.degree}</p>
              <p className="text-emerald-400 font-semibold">GWA: {educationData.gwa} ({educationData.honors})</p>
              <p className="text-neutral-400 text-[11px]">Coursework: {educationData.relevantCoursework.join(', ')}</p>
            </div>
          )
        });
        break;

      case 'cat':
        if (args[0] === 'resume' || args[0] === 'resume.txt') {
          newLines.push({
            type: 'output',
            text: (
              <div className="space-y-1.5 my-1 text-xs font-mono text-neutral-300">
                <p className="text-white font-bold">{personalInfo.name} — RESUME</p>
                <p>Status: 4th Year BS IT Student @ RTU (GWA 1.48)</p>
                <p>QA Experience: Denso Ten Solutions Philippines (VerUp, PCTS, Infotainment)</p>
                <p>Key Projects: Kuya Pahipak (Next.js/Firestore), DTR ni Latch (Node/Mongo)</p>
                <div className="pt-1 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/resume');
                    }}
                    className="text-sky-400 underline hover:text-sky-300"
                  >
                    &gt; View full interactive resume page (/resume)
                  </button>
                </div>
              </div>
            )
          });
        } else {
          newLines.push({
            type: 'error',
            text: `cat: ${args[0] || ''}: No such file. Try 'cat resume'`
          });
        }
        break;

      case 'contact':
        newLines.push({
          type: 'output',
          text: (
            <div className="space-y-1 my-1 text-xs font-mono text-neutral-300">
              <p>Email: <a href={`mailto:${personalInfo.links.email}`} className="text-sky-400 underline">{personalInfo.links.email}</a></p>
              <p>Location: <span className="text-emerald-400">{personalInfo.location || 'Cainta, Rizal'}</span></p>
              <p>GitHub: <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline">{personalInfo.links.github}</a></p>
              <p>LinkedIn: <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline">{personalInfo.links.linkedin}</a></p>
            </div>
          )
        });
        break;

      case 'open':
        const target = (args[0] || '').toLowerCase();
        if (target === 'resume') {
          setIsOpen(false);
          router.push('/resume');
          return;
        } else if (target === 'github') {
          window.open(personalInfo.links.github, '_blank');
          newLines.push({ type: 'output', text: 'Opening GitHub profile...' });
        } else if (target === 'linkedin') {
          window.open(personalInfo.links.linkedin, '_blank');
          newLines.push({ type: 'output', text: 'Opening LinkedIn profile...' });
        } else if (target === 'kuya' || target === 'kuyapahipak') {
          window.open('https://kuya-pahipak.vercel.app', '_blank');
          newLines.push({ type: 'output', text: 'Opening Kuya Pahipak website...' });
        } else if (target === 'dtr') {
          window.open('https://dtrnilatch.latchcrisford213.workers.dev/', '_blank');
          newLines.push({ type: 'output', text: 'Opening DTR ni Latch website...' });
        } else {
          newLines.push({
            type: 'error',
            text: "Usage: open <resume | github | linkedin | kuya | dtr>"
          });
        }
        break;

      case 'theme':
        if (args[0] === 'dark') {
          setTheme('dark');
          newLines.push({ type: 'output', text: 'Theme switched to Dark.' });
        } else if (args[0] === 'light') {
          setTheme('light');
          newLines.push({ type: 'output', text: 'Theme switched to Light.' });
        } else if (args[0] === 'system') {
          setTheme('system');
          newLines.push({ type: 'output', text: 'Theme switched to System.' });
        } else {
          const next = resolvedTheme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          newLines.push({ type: 'output', text: `Theme toggled to ${next}.` });
        }
        break;

      case 'clear':
        setOutput([]);
        return;

      case 'date':
        newLines.push({ type: 'output', text: new Date().toString() });
        break;

      case 'echo':
        newLines.push({ type: 'output', text: args.join(' ') });
        break;

      case 'exit':
        setIsOpen(false);
        return;

      default:
        newLines.push({
          type: 'error',
          text: `Command not recognized: '${cmd}'. Type 'help' to see all available commands.`
        });
        break;
    }

    setOutput(prev => [...prev, ...newLines]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInputVal(history[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMAND_LIST.find(c => c.startsWith(inputVal.toLowerCase().trim()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-5 left-5 z-40 no-print">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-mono font-medium"
            title="Open Developer Terminal (Shortcut: ` or ~)"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Terminal / CLI</span>
            <span className="text-[10px] bg-neutral-800 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-600">~</span>
          </button>
        )}
      </div>

      {/* Terminal Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 no-print ${
            isExpanded
              ? 'inset-2 sm:inset-6'
              : 'bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:w-[620px] h-[520px] max-h-[88vh]'
          } bg-neutral-950 text-neutral-100 rounded-xl shadow-2xl border border-neutral-800 flex flex-col font-mono overflow-hidden animate-in fade-in slide-in-from-bottom-6`}
        >
          {/* Title Bar */}
          <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors"
                  title="Close Terminal"
                />
                <button
                  type="button"
                  onClick={() => setIsExpanded(prev => !prev)}
                  className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors"
                  title="Toggle Fullscreen"
                />
                <button
                  type="button"
                  onClick={() => setOutput([])}
                  className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  title="Clear Terminal"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                latch@portfolio: ~ (bash)
              </span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1 hover:text-white transition-colors"
                title={isExpanded ? "Restore" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed selection:bg-emerald-500/30 selection:text-emerald-200"
          >
            {output.map((line, idx) => (
              <div key={idx}>
                {line.type === 'input' && (
                  <div className="text-emerald-400 font-semibold">{line.text}</div>
                )}
                {line.type === 'output' && (
                  <div className="text-neutral-200">{line.text}</div>
                )}
                {line.type === 'system' && (
                  <div className="text-neutral-300">{line.text}</div>
                )}
                {line.type === 'error' && (
                  <div className="text-rose-400">{line.text}</div>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Prompt Line */}
          <div className="px-4 py-3 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs select-none">
              latch@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command (e.g. 'help', 'skills', 'projects')..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-hidden placeholder:text-neutral-600"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => handleCommand(inputVal)}
              className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors"
              title="Execute Command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
