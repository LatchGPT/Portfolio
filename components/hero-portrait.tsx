import Image from 'next/image';
import { personalInfo } from '@/data/personal';

export function HeroPortrait({ className = '' }: { className?: string }) {
  return (
    <div
      id="hero-portrait-card"
      className={`relative w-[240px] sm:w-[270px] md:w-[290px] lg:w-[320px] h-[320px] sm:h-[360px] md:h-[386px] lg:h-[426px] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-md shrink-0 ${className}`}
      style={{ aspectRatio: '3 / 4' }}
    >
      <Image
        id="hero-portrait-image"
        src="/Image.png"
        alt={personalInfo.name}
        fill
        priority
        unoptimized
        className="object-cover object-[center_20%]"
        sizes="(max-width: 640px) 240px, (max-width: 1024px) 290px, 320px"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
