import Link from 'next/link';
import { personalInfo } from '@/data/personal';
import { ArrowDown, Code2, MapPin, GraduationCap, Award } from 'lucide-react';
import { HeroPortrait } from './hero-portrait';

export function Hero() {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 border-b border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Introductions and Actions */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border border-sky-300 dark:border-sky-800/80 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            BSIT Student & Aspiring Full-Stack Developer
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              {personalInfo.name}
            </h1>

            <p className="mt-3 text-lg sm:text-xl font-medium text-neutral-700 dark:text-neutral-300">
              {personalInfo.role}
            </p>
          </div>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
            {personalInfo.headline}
          </p>

          {/* Quick status and credentials badge strip */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono text-neutral-600 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <MapPin className="w-3 h-3 text-sky-500" />
              <span>{personalInfo.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
              <span>RTU Boni Campus (BSIT &apos;26)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>GWA 1.48 (President&apos;s Lister)</span>
            </span>
          </div>

          {/* Action CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <Code2 className="w-4 h-4" />
              <span>View Technical Projects</span>
            </Link>

            <Link
              href="#about"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <span>Learn more</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Plain Portrait Component */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}
