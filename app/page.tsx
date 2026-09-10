import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { EducationSection } from '@/components/education-section';
import { ContactSection } from '@/components/contact-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}