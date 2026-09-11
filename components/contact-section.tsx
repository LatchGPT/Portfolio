import { personalInfo } from '@/data/personal';
import { SectionHeading } from './ui/section-heading';
import { Mail, Github, Linkedin, FileText, ArrowUpRight, MapPin, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { InteractiveContactForm } from './interactive-contact-form';

export function ContactSection() {
  const hasValidGithub = personalInfo.links.github !== '[YOUR GITHUB URL]';
  const hasValidLinkedin = personalInfo.links.linkedin !== '[YOUR LINKEDIN URL]';
  const hasValidEmail = personalInfo.links.email !== '[YOUR EMAIL]';

  return (
    <section id="contact" className="py-16 scroll-mt-20">
      <SectionHeading
        number="06."
        title="Get in Touch"
        subtitle="Feel free to reach out for software engineering roles, QA opportunities, freelance projects, or technical collaboration."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Form (Left, 7 columns) */}
        <div className="lg:col-span-7">
          <InteractiveContactForm />
        </div>

        {/* Direct Channels & Verified Details (Right, 5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono mb-4">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-sm">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 block">Email Address</span>
                  <a
                    href={`mailto:${personalInfo.links.email}`}
                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 hover:underline truncate block"
                  >
                    {personalInfo.links.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 block">Location</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 block">
                    {personalInfo.location || 'Cainta, Rizal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social & Resume Links */}
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2">
              {hasValidLinkedin && (
                <a
                  href={personalInfo.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              )}

              {hasValidGithub && (
                <a
                  href={personalInfo.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repositories</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              )}

              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
                <ArrowUpRight className="w-3 h-3 text-sky-500" />
              </Link>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 text-xs text-neutral-600 dark:text-neutral-300">
            <p className="font-semibold text-sky-900 dark:text-sky-200 mb-1 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Need an instant answer?
            </p>
            <p className="leading-relaxed">
              You can also chat with <strong>Talk to Latch AI</strong> (floating button at the bottom right) or open the <strong>Developer CLI</strong> (<code className="font-mono text-sky-700 dark:text-sky-300">`</code> or <code className="font-mono text-sky-700 dark:text-sky-300">~</code> key) for immediate background information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
