import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center">
      <span className="font-mono text-sm text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
        404 — Page Not Found
      </span>
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
        Resource does not exist
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-md text-sm sm:text-base">
        The requested project or route could not be resolved. Please check the URL or return to the home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}