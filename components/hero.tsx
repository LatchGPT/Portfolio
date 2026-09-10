import Link from 'next/link';
import { personalInfo } from '@/data/personal';
import { ArrowDown, Code2, FileText } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border border-sky-300 dark:border-sky-800/80 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          BSIT Student & Aspiring Full-Stack Developer
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          {personalInfo.name}
        </h1>

        <p className="mt-4 text-lg sm:text-xl font-medium text-neutral-700 dark:text-neutral-300">
          {personalInfo.role}
        </p>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
          {personalInfo.headline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
          >
            <Code2 className="w-4 h-4" />
            View Technical Projects
          </Link>

          {personalInfo.links.resume && personalInfo.links.resume !== '[YOUR RESUME URL]' ? (
            <a
              href={personalInfo.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-medium text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Resume
            </a>
          ) : (
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-medium text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              Contact Me
            </Link>
          )}

          <Link
            href="#about"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Learn more <ArrowDown className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}