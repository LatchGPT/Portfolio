export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  category: string;
  technologies: string[];
  features: string[];
  technicalHighlights: string[];
  architecture?: string;
  githubUrl?: string;
  liveUrl?: string;
  notes?: string;
}

export interface EducationItem {
  institution: string;
  campus: string;
  degree: string;
  period: string;
  gwa: string;
  honors: string;
  relevantCoursework: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}