'use client';
import { useTitle } from '@/hooks/useTitle';
import { AboutSection } from '@/components/home/AboutSection';

export default function AboutPage() {
  useTitle('About');
  return <AboutSection />;
}
