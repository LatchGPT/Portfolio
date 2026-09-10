'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Education', href: '/#education' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          latch.ayhon<span className="text-sky-600 dark:text-sky-400">()</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
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
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-neutral-700 dark:text-neutral-200 hover:text-sky-600 dark:hover:text-sky-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}