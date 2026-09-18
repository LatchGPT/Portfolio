'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import {
  Globe,
  ExternalLink,
  RotateCw,
  Maximize2,
  AlertCircle
} from 'lucide-react';

interface WebPreviewFrameProps {
  project: Project;
  heightClass?: string; // e.g. 'h-[480px] sm:h-[560px]' for case study
  defaultZoom?: number; // default zoom scale (e.g. 0.8 or 1.0)
}

export function WebPreviewFrame({
  project,
  heightClass = 'h-[500px]',
  defaultZoom = 0.8
}: WebPreviewFrameProps) {
  const [zoom, setZoom] = useState<number>(defaultZoom);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  if (!project.liveUrl) {
    return (
      <div className={`rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 flex flex-col items-center justify-center p-8 text-center ${heightClass}`}>
        <AlertCircle className="w-8 h-8 text-neutral-400 mb-3" />
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          No Public Live Deployment
        </h3>
        <p className="mt-1 text-xs text-neutral-500 max-w-sm">
          This project is in internal development or deployed on a private cluster. You can review the complete codebase and architecture in the repository.
        </p>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <span>View GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 overflow-hidden shadow-inner flex flex-col">
      {/* Browser Chrome Header Bar */}
      <div className="px-3 py-2 bg-neutral-200/90 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 flex items-center justify-between gap-2 text-xs select-none">
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 inline-block"></span>
        </div>

        {/* URL Bar */}
        <div className="flex flex-1 max-w-[320px] mx-auto px-2.5 py-0.5 rounded-md bg-white/95 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-300 items-center justify-between gap-1 shadow-2xs">
          <div className="flex items-center gap-1 truncate">
            <Globe className="w-3 h-3 text-sky-500 shrink-0" />
            <span className="truncate">
              {project.liveUrl.replace(/^https?:\/\//, '')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shrink-0"
            title="Refresh frame"
            aria-label="Refresh frame"
          >
            <RotateCw className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Header Right: Zoom Controls & Open External */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 bg-neutral-300/70 dark:bg-neutral-800/80 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-neutral-700 dark:text-neutral-300">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
              disabled={zoom <= 0.4}
              className="px-1 hover:text-sky-600 dark:hover:text-sky-400 font-bold disabled:opacity-30 transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="px-1 select-none min-w-[34px] text-center font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(1.2, Number((prev + 0.1).toFixed(1))))}
              disabled={zoom >= 1.2}
              className="px-1 hover:text-sky-600 dark:hover:text-sky-400 font-bold disabled:opacity-30 transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
            {zoom !== defaultZoom && (
              <button
                type="button"
                onClick={() => setZoom(defaultZoom)}
                className="ml-0.5 px-1 text-[9px] text-sky-600 dark:text-sky-400 hover:underline"
                title="Reset zoom"
              >
                Reset
              </button>
            )}
          </div>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Live Preview Container */}
      <div className={`relative w-full ${heightClass} bg-neutral-950 overflow-hidden`}>
        <div className="relative w-full h-full overflow-hidden bg-white">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-neutral-900/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-neutral-300 text-xs">
              <RotateCw className="w-5 h-5 text-sky-400 animate-spin" />
              <span className="font-mono text-[11px]">Connecting to live application...</span>
              <span className="text-[10px] text-neutral-400 max-w-xs text-center px-4">
                Rendering deployment directly from {project.liveUrl}
              </span>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={project.liveUrl}
            title={`${project.name} live preview`}
            onLoad={() => setIsLoading(false)}
            className="border-0 bg-white"
            style={{
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            tabIndex={-1}
          />

          {/* Bottom helper bar */}
          <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 border-t border-neutral-800 px-3 py-1 flex items-center justify-between text-[10px] text-neutral-400 font-mono z-20">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate">Live Deployment: {project.liveUrl.replace(/^https?:\/\//, '')}</span>
              <span className="text-neutral-500 font-normal">({Math.round(zoom * 100)}% scale)</span>
            </span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 underline text-[9px] flex items-center gap-1"
            >
              <span>Open in new tab</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
