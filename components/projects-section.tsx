import { projectsData } from '@/data/projects';
import { SectionHeading } from './ui/section-heading';
import { ProjectCard } from './project-card';

export function ProjectsSection() {
  return (
    <section id="projects" className="py-16 border-b border-neutral-200 dark:border-neutral-800">
      <SectionHeading
        number="02."
        title="Featured Projects"
        subtitle="In-depth, functional applications showcasing transactional integrity, authentication, and practical problem solving."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projectsData.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}