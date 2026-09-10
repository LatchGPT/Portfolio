import { personalInfo } from '@/data/personal';
import { SectionHeading } from './ui/section-heading';
import { Mail, Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const hasValidGithub = personalInfo.links.github !== '[YOUR GITHUB URL]';
  const hasValidLinkedin = personalInfo.links.linkedin !== '[YOUR LINKEDIN URL]';
  const hasValidEmail = personalInfo.links.email !== '[YOUR EMAIL]';
  const hasValidResume = personalInfo.links.resume !== '[YOUR RESUME URL]';

  return (
    <section id="contact" className="py-16">
      <SectionHeading
        number="06."
        title="Get in Touch"
        subtitle="Feel free to reach out for technical discussions, collaborations, or developer opportunities."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Email */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col justify-between">
          <div>
            <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Direct Email</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              For professional inquiries
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {hasValidEmail ? (
              <a
                href={`mailto:${personalInfo.links.email}`}
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                {personalInfo.links.email}
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                [YOUR EMAIL]
              </span>
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col justify-between">
          <div>
            <Github className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">GitHub Profile</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Source code & repositories
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {hasValidGithub ? (
              <a
                href={personalInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                View Repositories
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                [YOUR GITHUB URL]
              </span>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col justify-between">
          <div>
            <Linkedin className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">LinkedIn</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Professional network
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {hasValidLinkedin ? (
              <a
                href={personalInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                Connect on LinkedIn
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                [YOUR LINKEDIN URL]
              </span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col justify-between">
          <div>
            <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Resume / CV</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Full background & coursework
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            {hasValidResume ? (
              <a
                href={personalInfo.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                Download Resume
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                [YOUR RESUME URL]
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}