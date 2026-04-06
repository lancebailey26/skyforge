'use client';
import { useTitle } from '@/hooks/useTitle';
import { ProjectsSection } from '@/components/home/ProjectsSection';

export default function ProjectsPage() {
  useTitle('Projects');
  return <ProjectsSection />;
}