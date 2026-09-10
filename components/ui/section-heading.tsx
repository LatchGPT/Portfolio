import React from 'react';

interface SectionHeadingProps {
  number?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  number,
  title,
  subtitle,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <div className="flex items-center gap-3">
        {number && (
          <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
            {number}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}