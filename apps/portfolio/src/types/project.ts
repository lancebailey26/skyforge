export type ProjectStatus = 'live' | 'in-progress' | 'archived';

export interface Project {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  featured: boolean;
  priority: number;
  status: ProjectStatus;
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};