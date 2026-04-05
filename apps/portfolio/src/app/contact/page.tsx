'use client';
import { useTitle } from '@/hooks/useTitle';
import { ContactSection } from '@/components/home/ContactSection';

export default function ContactPage() {
  useTitle('Contact');
  return <ContactSection />;
}
