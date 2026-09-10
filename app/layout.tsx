import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { personalInfo } from '@/data/personal';

export const metadata: Metadata = {
  title: `${personalInfo.name} | ${personalInfo.role}`,
  description: `${personalInfo.name} — Aspiring Full-Stack Developer & BS Information Technology Student. Portfolio showcasing technical projects, software engineering capabilities, and QA experience.`,
  openGraph: {
    title: `${personalInfo.name} | ${personalInfo.role}`,
    description: personalInfo.headline,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}