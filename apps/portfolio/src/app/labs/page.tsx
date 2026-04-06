'use client';
import { useTitle } from '@/hooks/useTitle';
import { LabsSection } from '@/components/home/LabsSection';

export default function LabsPage() {
  useTitle('Labs');
  return <LabsSection />;
}