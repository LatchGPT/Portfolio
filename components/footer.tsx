import { personalInfo } from '@/data/personal';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <div>
            <p className="font-mono">
              Designed & Engineered by <span className="font-semibold text-neutral-900 dark:text-neutral-200">{personalInfo.name}</span>
            </p>
            <p className="mt-1">
              Built with Next.js, TypeScript & Tailwind CSS.
            </p>
          </div>

          <div className="flex items-center gap-5">
            {personalInfo.links.github !== '[YOUR GITHUB URL]' ? (
              <a
                href={personalInfo.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-neutral-900 dark:hover:text-white"
              >
                GitHub
              </a>
            ) : (
              <span className="text-neutral-400 dark:text-neutral-600">GitHub</span>
            )}

            {personalInfo.links.linkedin !== '[YOUR LINKEDIN URL]' ? (
              <a
                href={personalInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-neutral-900 dark:hover:text-white"
              >
                LinkedIn
              </a>
            ) : (
              <span className="text-neutral-400 dark:text-neutral-600">LinkedIn</span>
            )}

            <Link href="/#about" className="hover:underline hover:text-neutral-900 dark:hover:text-white">
              Back to top
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-900 text-[11px] text-neutral-500 dark:text-neutral-500 text-center sm:text-left">
          © {currentYear} {personalInfo.name}. All verified credentials, coursework, and technical details strictly represented.
        </div>
      </div>
    </footer>
  );
}