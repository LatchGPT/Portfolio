import { personalInfo } from '@/data/personal';
import { SectionHeading } from './ui/section-heading';
import { CheckCircle2 } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-16 border-b border-neutral-200 dark:border-neutral-800">
      <SectionHeading
        number="01."
        title="About Me"
        subtitle="Background, mindset, and software engineering philosophy."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4 text-neutral-700 dark:text-neutral-300 text-base leading-relaxed">
          {personalInfo.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p>
            Currently pursuing my Bachelor of Science in Information Technology at Rizal Technological University (RTU Boni Campus). My experience balances software development—designing transactional database backends and reactive frontends—with hands-on Quality Assurance testing methodologies.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-4 self-start">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Core Focus Areas
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>Full-Stack Application Development</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>Transactional Integrity & State Synchronization</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>Functional & Regression Quality Assurance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>Clean, Accessible, Utility-Driven Interfaces</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}