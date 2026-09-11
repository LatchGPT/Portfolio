'use client';

import Link from 'next/link';
import { personalInfo } from '@/data/personal';
import { experienceData } from '@/data/experience';
import { projectsData } from '@/data/projects';
import { skillsData } from '@/data/skills';
import { educationData } from '@/data/education';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Wrench, 
  CheckCircle,
  Share2,
  Check
} from 'lucide-react';
import { useState } from 'react';

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="no-print mb-8 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title="Copy link to this resume"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <a
            href={personalInfo.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            download="Latch_Crisford_Ayhon_Resume.pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm"
            title="Download Official Resume PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>

      {/* Coded Onsite Resume Document Container */}
      <article className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-12 shadow-sm text-neutral-900 dark:text-neutral-100 font-sans print:border-none print:p-0 print:shadow-none print:bg-white print:text-black">
        {/* Document Header */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-950 dark:text-white print:text-black">
              {personalInfo.name}
            </h1>
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400 font-mono print:text-neutral-800">
              {personalInfo.role}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 print:text-neutral-700">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {personalInfo.location || 'Cainta, Rizal'}
            </span>
            <a
              href={`mailto:${personalInfo.links.email}`}
              className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 hover:underline"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              {personalInfo.links.email}
            </a>
            <a
              href={personalInfo.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 hover:underline"
            >
              <Linkedin className="w-3.5 h-3.5 text-neutral-400" />
              LinkedIn
            </a>
            <a
              href={personalInfo.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 hover:underline"
            >
              <Github className="w-3.5 h-3.5 text-neutral-400" />
              GitHub
            </a>
          </div>
        </header>

        {/* Section: Professional Summary */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 print:text-neutral-800">
            {personalInfo.summary || personalInfo.headline}
          </p>
        </section>

        {/* Section: Work Experience */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Work Experience & Internships
          </h2>
          <div className="space-y-4">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 print:text-black">
                    {exp.role} <span className="font-normal text-neutral-500 dark:text-neutral-400">— {exp.company}</span>
                  </h3>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 print:text-neutral-800 leading-relaxed">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Education */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Education
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 print:text-black">
                  {educationData.institution}
                </h3>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                  {educationData.period}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                {educationData.degree} — <span className="font-semibold text-emerald-600 dark:text-emerald-400">GWA: {educationData.gwa}</span> ({educationData.honors})
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Key Coursework:</span> {educationData.relevantCoursework.join(', ')}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50 space-y-0.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Golden Faith Academy
                </h4>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  Senior High School
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Technical-Vocational Track (Information & Communications Technology)
              </p>
            </div>
          </div>
        </section>

        {/* Section: Technical Projects */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-1 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Key Technical Projects
          </h2>
          <div className="space-y-4">
            {projectsData.map((project) => (
              <div key={project.slug} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 print:text-black">
                      {project.name}
                    </h3>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      | {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 no-print">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-0.5"
                      >
                        GitHub <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-0.5"
                      >
                        Website <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 print:text-neutral-800">
                  {project.description}
                </p>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Technologies:</span> {project.technologies.slice(0, 7).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Technical Skills & Competencies */}
        <section>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Skills & Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {skillsData.map((cat, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 print:border-none print:p-0 print:bg-transparent">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 print:text-black">
                  {cat.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed print:text-neutral-800">
                  {cat.skills.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Footer link back to portfolio */}
      <div className="no-print mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Portfolio Homepage
        </Link>
      </div>
    </div>
  );
}
