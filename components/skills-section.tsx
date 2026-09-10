import { skillsData } from '@/data/skills';
import { SectionHeading } from './ui/section-heading';

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 border-b border-neutral-200 dark:border-neutral-800">
      <SectionHeading
        number="03."
        title="Technical Skills"
        subtitle="Technologies, frameworks, and engineering tools applied across projects and academic work."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillsData.map((category) => (
          <div
            key={category.title}
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40"
          >
            <h3 className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              {category.title}
            </h3>

            <ul className="space-y-2">
              {category.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}