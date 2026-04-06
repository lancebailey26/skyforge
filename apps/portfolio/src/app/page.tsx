'use client';
import { Notification } from '@lancebailey26/skyforge-ui';
import { useTitle } from '../hooks/useTitle';
import { AboutSection } from '../components/home/AboutSection';
import { TechCrawlerSection } from '../components/home/TechCrawlerSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { LabsSection } from '../components/home/LabsSection';
import { ContactSection } from '../components/home/ContactSection';

export default function HomePage() {
  useTitle('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
      {process.env.NODE_ENV === 'development' && (
        <Notification
          title="Welcome to Skyforge"
          description={
            'You are viewing the development version of my portfolio. Some features may not be available yet, ' +
            'and some may be buggy, because this is in active development.'
          }
          type="info"
          timeout={5000}
          placement="top-right"
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