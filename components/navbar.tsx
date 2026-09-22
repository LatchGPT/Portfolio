'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, FileText, Gamepad2 } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();

  const navLinks = [
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Projects', href: '/#projects', id: 'projects' },
    { label: 'Skills', href: '/#skills', id: 'skills' },
    { label: 'Experience', href: '/#experience', id: 'experience' },
    { label: 'Education', href: '/#education', id: 'education' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
    { label: 'Resume', href: '/resume', id: 'resume', isResume: true },
  ];

  // Reset scroll to top (Hero section, above About me) on initial page load / refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (pathname === '/' || pathname === '') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      };

      resetScroll();
      const raf1 = requestAnimationFrame(resetScroll);
      const raf2 = requestAnimationFrame(() => requestAnimationFrame(resetScroll));
      const t1 = setTimeout(resetScroll, 30);
      const t2 = setTimeout(resetScroll, 120);
      const t3 = setTimeout(resetScroll, 300);

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (window.location.hash && (window.location.pathname === '/' || window.location.pathname === '')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Active section scroll spy
  useEffect(() => {
    if (pathname === '/resume') {
      setActiveSection('resume');
      return;
    }

    if (pathname !== '/' && pathname !== '') {
      setActiveSection(null);
      return;
    }

    const sectionIds = ['about', 'projects', 'skills', 'experience', 'education', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      // If at the very top of page (hero area)
      if (window.scrollY < 140) {
        setActiveSection(null);
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id?: string) => {
    setMobileMenuOpen(false);

    if (id && id !== 'resume' && (pathname === '/' || pathname === '')) {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (pathname === '/' || pathname === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenArcade = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-arcade'));
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={handleBrandClick}
          className="font-mono font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          latch.ayhon<span className="text-sky-600 dark:text-sky-400">()</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            if (link.isResume) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all shadow-xs ${
                    isActive
                      ? 'bg-sky-500 text-white dark:bg-sky-500 dark:text-white border border-sky-600 shadow-sm'
                      : 'bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/80'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`relative inline-flex items-center px-2.5 py-1 rounded-md text-sm transition-all ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/90 font-semibold shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse mr-1.5 shrink-0" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleOpenArcade}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 transition-all shadow-2xs hover:shadow-amber-500/10 active:scale-95 ml-1"
            title="Play Arcade Games"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Play</span>
          </button>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={handleOpenArcade}
            className="p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60"
            title="Play Arcade Games"
          >
            <Gamepad2 className="w-5 h-5 text-amber-500" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-4 pt-2 pb-6 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;

            if (link.isResume) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-base font-semibold rounded-lg w-full ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`flex items-center px-3 py-2 text-base rounded-lg transition-colors ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70 font-semibold border border-sky-200 dark:border-sky-800'
                    : 'text-neutral-700 dark:text-neutral-200 hover:text-sky-600 dark:hover:text-sky-400 font-medium'
                }`}
              >
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mr-2" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleOpenArcade}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 flex items-center gap-2 mt-2 border border-amber-200 dark:border-amber-800/80"
          >
            <Gamepad2 className="w-4 h-4 text-amber-500" />
            <span>Play</span>
          </button>
        </div>
      )}
    </header>
  );
}
