'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (
    theme: Theme,
    event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX: number; clientY: number }
  ) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null;
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === 'dark';
      }

      setResolvedTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const handleSetTheme = (
    newTheme: Theme,
    event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX: number; clientY: number }
  ) => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const willBeDark = newTheme === 'system' ? mediaQuery.matches : newTheme === 'dark';
    const currentIsDark = root.classList.contains('dark');

    const updateDOM = () => {
      if (willBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setResolvedTheme(willBeDark ? 'dark' : 'light');
      setThemeState(newTheme);
      try {
        localStorage.setItem('portfolio-theme', newTheme);
      } catch {
        // ignore
      }
    };

    // If state doesn't actually visually flip (e.g. dark -> dark), just update state
    if (willBeDark === currentIsDark) {
      updateDOM();
      return;
    }

    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document;

    // Fallback for browsers without View Transitions API or users who prefer reduced motion
    if (reduce || !hasViewTransition) {
      root.classList.add('theme-anim');
      updateDOM();
      setTimeout(() => {
        root.classList.remove('theme-anim');
      }, 520);
      return;
    }

    // Circular wipe from (x,y) via native View Transitions API (identical to bryllim.com)
    let x = typeof window !== 'undefined' ? window.innerWidth - 40 : 0;
    let y = 40;

    if (event) {
      if ('clientX' in event && typeof event.clientX === 'number') {
        x = event.clientX;
        y = event.clientY;
      } else if ('currentTarget' in event && (event.currentTarget as HTMLElement)?.getBoundingClientRect) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const maxDistanceX = Math.max(x, (typeof window !== 'undefined' ? window.innerWidth : 1000) - x);
    const maxDistanceY = Math.max(y, (typeof window !== 'undefined' ? window.innerHeight : 1000) - y);
    const r = Math.hypot(maxDistanceX, maxDistanceY);

    try {
      // document.startViewTransition creates a seamless compositor snapshot
      const transition = (document as unknown as {
        startViewTransition: (cb: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      }).startViewTransition(() => {
        updateDOM();
      });

      transition.ready
        .then(() => {
          root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${r}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 540,
              easing: 'cubic-bezier(.32,.08,.24,1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {});
    } catch {
      updateDOM();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
