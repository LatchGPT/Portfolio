'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, User } from 'lucide-react';
import { personalInfo } from '@/data/personal';

export function HeroPortrait() {
  const [imgSrc, setImgSrc] = useState<string>('/profile.png');
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check local storage for persistent custom uploaded avatar
    try {
      const stored = localStorage.getItem('latch-portfolio-avatar');
      if (stored) {
        setImgSrc(stored);
        setHasError(false);
        return;
      }
    } catch {
      // ignore
    }

    // Default to /profile.png or fallback
    if (personalInfo.avatarUrl) {
      setImgSrc(personalInfo.avatarUrl);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);

    // Read local data URL for instant display
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImgSrc(result);
        setHasError(false);
        try {
          localStorage.setItem('latch-portfolio-avatar', result);
        } catch {
          // ignore quota error
        }
      }
    };
    reader.readAsDataURL(file);

    // Also persist file to public/profile.png on the server
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Stored successfully
        }
      }
    } catch (err) {
      console.error('Failed to upload avatar to server:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-4/5 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-md group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      title="Click or drag & drop to update profile photo"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile image"
      />

      {/* Portrait Image Display */}
      {!hasError ? (
        <Image
          src={imgSrc}
          alt={personalInfo.name}
          fill
          priority
          unoptimized={imgSrc.startsWith('data:')}
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 360px"
          onError={() => {
            // If /profile.png or custom image fails to load, try /Image.png or show friendly upload placeholder
            if (imgSrc === '/profile.png') {
              setImgSrc('/Image.png');
            } else {
              setHasError(true);
            }
          }}
        />
      ) : (
        /* Clean fallback state if no image uploaded yet */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950">
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {personalInfo.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[200px]">
            Click or drag &amp; drop your photo here to attach
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Select Photo</span>
          </div>
        </div>
      )}

      {/* Dragging Active Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-sky-500/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-150">
          <Upload className="w-10 h-10 mb-2 animate-bounce" />
          <p className="text-sm font-bold">Drop photo to attach</p>
        </div>
      )}

      {/* Subtle hover prompt */}
      {!isDragging && isHovered && !isUploading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center text-white z-10 transition-opacity duration-200">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white mb-2 shadow-lg">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-white/90 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
            Click or drop to change photo
          </span>
        </div>
      )}

      {/* Uploading progress indicator */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs font-medium">Attaching photo...</p>
        </div>
      )}
    </div>
  );
}
