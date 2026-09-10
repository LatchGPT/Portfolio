import { educationData } from '@/data/education';
import { SectionHeading } from './ui/section-heading';
import { Badge } from './ui/badge';
import { GraduationCap, Award, BookOpen, Calendar, MapPin } from 'lucide-react';

export function EducationSection() {
  return (
    <section id="education" className="py-16 border-b border-neutral-200 dark:border-neutral-800">
      <SectionHeading
        number="05."
        title="Education & Academic Background"
        subtitle="Academic standing, institutional milestones, and relevant university coursework."
      />

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {educationData.degree}
              </h3>
            </div>
            <p className="mt-1 text-base font-medium text-neutral-700 dark:text-neutral-300">
              {educationData.institution}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{educationData.campus}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5" />
              {educationData.period}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold self-start sm:self-auto">
              <span>GWA: {educationData.gwa}</span>
            </div>
          </div>
        </div>

        {/* Honors & Academic Standing */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50">
          <Award className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-sky-900 dark:text-sky-300">
              Academic Recognition
            </h4>
            <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {educationData.honors}
            </p>
          </div>
        </div>

        {/* Relevant Coursework */}
        <div className="mt-6">
          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Relevant University Coursework
          </h4>
          <div className="flex flex-wrap gap-2">
            {educationData.relevantCoursework.map((course) => (
              <Badge key={course} variant="outline" className="text-xs py-1 px-3">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}