import type { ProjectStatus } from './project';

/** Entry in the home #reference section; each item links to an in-app detail route under /work/. */
export interface ReferenceWorkItem {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  tags: string[];
  featured: boolean;
  priority: number;
  status: ProjectStatus;
  route: string;
  imageUrl?: string;
  /** Optional external reference (e.g. designer write-up). */
  referenceUrl?: string;
  referenceLabel?: string;
}
