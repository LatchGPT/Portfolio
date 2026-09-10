import { experienceData } from '@/data/experience';
import { SectionHeading } from './ui/section-heading';
import { Briefcase } from 'lucide-react';

export function ExperienceSection() {
  return (
    <section id="experience" className="py-16 border-b border-neutral-200 dark:border-neutral-800">
      <SectionHeading
        number="04."
        title="Experience"
        subtitle="Industry exposure and professional software quality assurance."
      />

      <div className="space-y-8">
        {experienceData.map((item, index) => (
          <div
            key={index}
            className="relative p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  {item.role}
                </h3>
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
                  {item.company}
                </p>
              </div>

              <span className="font-mono text-xs px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 self-start sm:self-auto">
                {item.period}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                Key Responsibilities & Contributions
              </h4>
              <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                {item.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-sky-600 dark:text-sky-400 font-mono text-base leading-none mt-1">
                      ›
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}