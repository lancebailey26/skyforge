'use client';
import { useEffect, useState } from 'react';
import { Notification } from '@lancebailey26/skyforge-ui';
import { useTitle } from '../hooks/useTitle';
import { AboutSection } from '../components/home/AboutSection';
import { TechCrawlerSection } from '../components/home/TechCrawlerSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { LabsSection } from '../components/home/LabsSection';
import { ContactSection } from '../components/home/ContactSection';
import { consumeNotFoundRedirectFlag } from '@/lib/notFoundRedirect';

export default function HomePage() {
  useTitle('');
  const [showNotFoundNotice, setShowNotFoundNotice] = useState(false);

  useEffect(() => {
    if(consumeNotFoundRedirectFlag()) {
      setShowNotFoundNotice(true);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
      {showNotFoundNotice && (
        <Notification
          title="Route not found"
          description="That path isn&apos;t in the build—you&apos;re back on home base. If you were fuzzing routes: hi, I noticed."
          type="warning"
          timeout={8000}
          placement="top-right"
          onClose={() => setShowNotFoundNotice(false)}
        />
      )}
      <AboutSection />
      <TechCrawlerSection />
      <ProjectsSection />
      <LabsSection />
      <ContactSection />
    </div>
  );
}