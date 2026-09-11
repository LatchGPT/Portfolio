import { projectsData } from '@/data/projects';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Layers, Cpu, FileCode2, Globe } from 'lucide-react';
import type { Metadata } from 'next';
import { WebPreviewFrame } from '@/components/web-preview-frame';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found | Latch Ayhon',
    };
  }

  return {
    title: `${project.name} — Technical Case Study | Latch Ayhon`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      {/* Back button */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all projects
      </Link>

      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="accent">{project.category}</Badge>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            Status: {project.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          {project.name}
        </h1>

        <p className="mt-3 text-lg sm:text-xl font-medium text-neutral-600 dark:text-neutral-400">
          {project.tagline}
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <Github className="w-4 h-4" />
              Source Code (GitHub)
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-900/80 transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Project Website
            </a>
          )}
        </div>
      </header>

      {/* Embedded Live Web Preview & Interactive Frame */}
      <section className="pt-8 pb-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Interactive Web Application Preview
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Live iframe preview directly rendering {project.liveUrl || 'production deployment'} with instant controls
            </p>
          </div>
        </div>
        <WebPreviewFrame project={project} heightClass="h-[480px] sm:h-[560px]" defaultMode="live" />
      </section>

      {/* Overview & Tech stack */}
      <div className="py-10 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            System Overview
          </h2>
          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {project.notes && (
            <div className="mt-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Note: </span>
              {project.notes}
            </div>
          )}
        </section>

        {/* Architecture if available */}
        {project.architecture && (
          <section className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
            <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Architecture & Data Flow
            </h3>
            <p className="font-mono text-sm text-neutral-800 dark:text-neutral-200">
              {project.architecture}
            </p>
          </section>
        )}

        {/* Technologies */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Technologies & Tools Applied
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} className="text-xs py-1 px-3">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        {/* Core Features */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Functional Requirements & Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex items-start gap-3"
              >
                <span className="text-sky-600 dark:text-sky-400 font-mono font-bold text-sm shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Highlights & Implementation Engineering */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Engineering Decisions & Technical Highlights
          </h2>
          <div className="space-y-3">
            {project.technicalHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 flex items-start gap-3"
              >
                <span className="text-sky-600 dark:text-sky-400 font-mono text-base leading-none mt-0.5">
                  ›
                </span>
                <p className="text-sm text-neutral-800 dark:text-neutral-200">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions Bar */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all projects
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Launch Project Website
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}