import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    slug: 'kuya-pahipak',
    name: 'Kuya Pahipak',
    tagline: 'Full-stack Point-of-Sale (POS), rewards system, and inventory management platform.',
    description: 'A dedicated retail management web application built to streamline physical retail operations, maintain transactional integrity in stock management, and drive recurring customer retention via gamified loyalty mechanics.',
    status: 'In active development / Not publicly deployed',
    category: 'Full-Stack Web Application',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Firebase Authentication',
      'Google Cloud Firestore',
      'Cloudinary',
      'Framer Motion',
      'Recharts'
    ],
    features: [
      'Product catalog with transparent and non-transparent categorization',
      'Real-time product stock and availability tracking',
      'Customer loyalty tracking with Buy 10 Get 1 Free reward milestones',
      'Two-stage reward roulette engine generating unique reward ticket codes',
      'Atomic POS checkout ensuring transaction-safe inventory decrements',
      'Complete customer order and purchase audit history',
      'Admin dashboard with role-based access for inventory mutations',
      'Integrated product image media pipeline via Cloudinary',
      'Sales analytics dashboard with Recharts visual reporting',
      'Excel-compatible report export for periodic bookkeeping'
    ],
    technicalHighlights: [
      'Engineered Firestore atomic transactions during checkout to prevent concurrency conflicts and inventory drift.',
      'Implemented real-time snapshot listeners for live inventory state and instant order tracking across client sessions.',
      'Hardened database access using fine-grained Firestore security rules matching role claims.',
      'Built a deterministic, weighted reward roulette algorithm with server-side validation to avoid reward manipulation.',
      'Managed optimized asset streaming using Cloudinary transformation parameters.'
    ],
    githubUrl: 'https://github.com/doublecarry/KuyaPahipak'
  },
  {
    slug: 'dtr-ni-latch',
    name: 'DTR ni Latch',
    tagline: 'Daily Time Record and attendance tracking application for work and internship/OJT hour tracking.',
    description: 'A full-featured attendance management and audit platform engineered to track rendered hours, calculate deductions accurately, project completion milestones, and export standardized documentation for internship and professional compliance.',
    status: 'API Deployed on Render / Frontend in repository',
    category: 'Full-Stack Web Application (REST Architecture)',
    technologies: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6 Modules)',
      'Node.js',
      'Express',
      'Mongoose',
      'MongoDB Atlas',
      'JWT',
      'bcryptjs'
    ],
    features: [
      'Precise time-in/time-out logging with automatic duration computation',
      'Automated overtime and undertime classification',
      'Built-in Philippine official holiday detection and custom adjustments',
      'Automatic mandatory lunch-break deduction algorithms',
      'Target completion date projection based on remaining rendered hours',
      'Bulk attendance data import supporting CSV and TXT files',
      'Form-accurate printable DTR document output for formal compliance submission',
      'One-click CSV exports for payroll and audit ingestion',
      'Role-based access control (RBAC) separating regular personnel and administrative reviewers',
      'Comprehensive record auditing logs for manual time adjustments'
    ],
    architecture: 'Vanilla ES6+ Modular Frontend → Express REST API → MongoDB Atlas Database Cluster',
    technicalHighlights: [
      'Designed modular RESTful endpoints handling JWT authentication, bcrypt password hashing, and rate limiting.',
      'Implemented business rules for Philippine labor calendar adjustments and non-working holiday calculations.',
      'Constructed MongoDB aggregation pipelines for instant computation of total rendered hours, undertime, and overtime.',
      'Standardized print stylesheets for exact physical layout reproduction conforming to standard government/corporate DTR forms.'
    ],
    notes: 'The backend service is hosted at https://dtrproj.onrender.com/api (REST API endpoint).'
  }
];