import Link from 'next/link';
import { Project } from '@/types';
import { Badge } from './ui/badge';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-neutral-400 dark:hover:border-neutral-700">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-semibold">
            PROJECT 0{index + 1}
          </span>
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded">
            {project.category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            {project.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {project.tagline}
        </p>

        <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {project.description}
        </p>

        {/* Feature Highlights */}
        <div className="mt-6">
          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            Selected Technical Highlights
          </h4>
          <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            {project.technicalHighlights.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sky-600 dark:text-sky-400 font-mono">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Badges */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          Read Full Technical Case Study
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={`GitHub repository for ${project.name}`}
              title="View GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={`Live demo for ${project.name}`}
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}