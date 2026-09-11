'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import {
  Globe,
  ExternalLink,
  RotateCw,
  ShoppingBag,
  Clock,
  Disc3,
  CheckCircle2,
  Monitor,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface WebPreviewFrameProps {
  project: Project;
  heightClass?: string; // e.g. 'h-[260px]' for cards, 'h-[500px]' for case study
  defaultMode?: 'live' | 'mockup';
}

export function WebPreviewFrame({
  project,
  heightClass = 'h-[260px]',
  defaultMode = 'live'
}: WebPreviewFrameProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'mockup'>(
    project.liveUrl ? defaultMode : 'mockup'
  );
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isKuya = project.slug === 'kuya-pahipak';

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

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

        {/* View Mode Toggle: Live Site vs Interactive Mockup */}
        <div className="flex items-center gap-1 bg-neutral-300/70 dark:bg-neutral-800/80 p-0.5 rounded-lg text-[11px] font-medium">
          {project.liveUrl && (
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'live'
                  ? 'bg-white dark:bg-neutral-700 text-sky-600 dark:text-sky-300 font-semibold shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="View live site inside embedded browser"
            >
              <Monitor className="w-3 h-3" />
              <span>Live Site</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('mockup')}
            className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'mockup'
                ? 'bg-white dark:bg-neutral-700 text-sky-600 dark:text-sky-300 font-semibold shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
            title="View simulated responsive UI mockup"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>UI Mockup</span>
          </button>
        </div>

        {/* URL Bar */}
        <div className="hidden sm:flex flex-1 max-w-[280px] mx-auto px-2.5 py-0.5 rounded-md bg-white/95 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-300 items-center justify-between gap-1 shadow-2xs">
          <div className="flex items-center gap-1 truncate">
            <Globe className="w-3 h-3 text-sky-500 shrink-0" />
            <span className="truncate">
              {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : 'local/preview'}
            </span>
          </div>
          {activeTab === 'live' && (
            <button
              type="button"
              onClick={handleRefresh}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shrink-0"
              title="Refresh frame"
            >
              <RotateCw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {/* Launch External Link Button */}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-medium transition-colors shadow-2xs shrink-0"
            title="Open website in new tab"
          >
            <span>Open</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      {/* Main Preview Container */}
      <div className={`relative w-full ${heightClass} bg-neutral-950 overflow-hidden`}>
        {activeTab === 'live' && project.liveUrl ? (
          /* Live iFrame View */
          <div className="relative w-full h-full">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-neutral-900/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-neutral-300 text-xs">
                <RotateCw className="w-5 h-5 text-sky-400 animate-spin" />
                <span className="font-mono text-[11px]">Connecting to live server...</span>
                <span className="text-[10px] text-neutral-400 max-w-xs text-center px-4">
                  Loading actual contents from {project.liveUrl}
                </span>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={project.liveUrl}
              title={`${project.name} live preview`}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />

            {/* Bottom helper bar for embedded view */}
            <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 border-t border-neutral-800 px-3 py-1 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live embed: {project.liveUrl.replace(/^https?:\/\//, '')}</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('mockup')}
                  className="hover:text-sky-400 underline text-[9px]"
                >
                  Switch to Mockup
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive High-Fidelity UI Mockup */
          isKuya ? (
            /* Kuya Pahipak Simulated Storefront */
            <div className="w-full h-full p-4 bg-neutral-900 text-neutral-100 text-xs font-sans select-none flex flex-col justify-between overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span className="font-bold tracking-tight text-white text-xs sm:text-sm">
                    Kuya Pahipak Vape Shop
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                    450 Reward Pts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    Cart (2 items)
                  </span>
                </div>
              </div>

              {/* Loyalty Wheel Banner */}
              <div className="my-3 p-3 rounded-lg bg-linear-to-r from-amber-950/50 via-neutral-800 to-sky-950/40 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Daily Loyalty Roulette Wheel</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Server-validated anti-tamper RNG system connected to Firestore
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold shrink-0 shadow-xs">
                  Spin Wheel
                </span>
              </div>

              {/* Product Shelf Grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80 hover:border-amber-500/50 transition-colors">
                  <div className="font-semibold text-neutral-200 truncate">GeekVape Aegis Legend</div>
                  <div className="text-amber-400 font-mono font-bold mt-0.5">₱1,450.00</div>
                  <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    In Stock (12 units)
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80 hover:border-amber-500/50 transition-colors">
                  <div className="font-semibold text-neutral-200 truncate">Oxva Xlim Pro Kit</div>
                  <div className="text-amber-400 font-mono font-bold mt-0.5">₱1,200.00</div>
                  <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    In Stock (8 units)
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80 hover:border-amber-500/50 transition-colors">
                  <div className="font-semibold text-neutral-200 truncate">Relx Pods 2ct Box</div>
                  <div className="text-amber-400 font-mono font-bold mt-0.5">₱320.00</div>
                  <div className="text-[9px] text-amber-400 font-mono flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    3 boxes left
                  </div>
                </div>
              </div>

              {/* Store metadata */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span>Vercel + Google Cloud Firestore + Cloudinary</span>
                <span className="text-emerald-400">● 100% Operational</span>
              </div>
            </div>
          ) : (
            /* DTR ni Latch Simulated Attendance Dashboard */
            <div className="w-full h-full p-4 bg-neutral-900 text-neutral-100 text-xs font-sans select-none flex flex-col justify-between overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span className="font-bold tracking-tight text-white text-xs sm:text-sm">
                    DTR ni Latch — RTU Attendance Tracker
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Duty Active
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                    BSIT 4th Year
                  </span>
                </div>
              </div>

              {/* Aggregation Metric Stats */}
              <div className="my-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                    Total Hours Logged
                  </div>
                  <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">168.5 hrs</div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                    Required Quota
                  </div>
                  <div className="text-sm font-bold text-neutral-200 font-mono mt-0.5">200.0 hrs</div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700/80">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                    Audit Status
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Compliant (84%)
                  </div>
                </div>
              </div>

              {/* Punch Logs List */}
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between p-1.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/40">
                  <span>Fri: 07:54 AM – 05:01 PM</span>
                  <span className="text-emerald-400">8.1 hrs • Verified Punch</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-neutral-800/60 text-neutral-300 border border-neutral-700/40">
                  <span>Thu: 07:58 AM – 05:04 PM</span>
                  <span className="text-emerald-400">8.0 hrs • Verified Punch</span>
                </div>
              </div>

              {/* Footer Audit info */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span>Cloudflare Workers + Node.js + MongoDB Aggregation</span>
                <span className="text-sky-400 font-semibold">Printable Civil Service Ready</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
