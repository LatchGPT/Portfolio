import Link from 'next/link';
import { Project } from '@/types';
import { Badge } from './ui/badge';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { WebPreviewFrame } from './web-preview-frame';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden flex flex-col justify-between transition-all hover:border-neutral-400 dark:hover:border-neutral-700 shadow-xs hover:shadow-md group">
      <div>
        {/* Header Metadata */}
        <div className="p-6 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-semibold tracking-wider">
              PROJECT 0{index + 1}
            </span>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 rounded-md bg-neutral-50 dark:bg-neutral-800/60">
              {project.category}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {project.tagline}
          </p>
        </div>

        {/* Interactive Web Application Preview (Live Deployment Only, No Mockup) */}
        <div className="px-6 pb-2">
          <WebPreviewFrame
            project={project}
            heightClass="h-[280px]"
            defaultZoom={0.6}
          />
        </div>

        {/* Tech Badges */}
        <div className="p-6 pt-3 pb-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {project.technologies.length > 5 && (
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 self-center">
              +{project.technologies.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 sm:px-8 py-4 bg-neutral-50/60 dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group"
        >
          <span>Read Full Technical Case Study</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
              aria-label={`GitHub repository for ${project.name}`}
              title="View GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-300 dark:border-sky-800/70 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-medium hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors shadow-2xs"
              aria-label={`Visit project website for ${project.name}`}
              title="Access Project Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
