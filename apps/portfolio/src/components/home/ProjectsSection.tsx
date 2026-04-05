'use client';

import { useEffect, useState } from 'react';
import { Card, Tag } from '@lancebailey26/skyforge-ui';
import { Project } from '@/types/project';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section
      id="projects"
      className="portfolio-section-anchor portfolio-snap-section"
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        Projects
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%',
          minWidth: 0,
        }}
      >
        {projects.map((project) => {
          const subjectContent = project.imageUrl ? { src: project.imageUrl, alt: project.title } : null;

          return (
            <Card
              key={project._id}
              title={project.title}
              subject={subjectContent}
              description={project.description}
              onClick={() => project.url && window.open(project.url, '_blank')}
              headerControls={[
                { icon: faGithub, onClick: () => project.repoUrl && window.open(project.repoUrl, '_blank') },
              ]}
              type="glass"
              footer={
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.techStack?.map((tech, idx) => (
                    <Tag key={`tech-${idx}`} text={tech} size="tiny" color="info" />
                  ))}
                  {project.tags?.map((tag, idx) => (
                    <Tag key={`tag-${idx}`} text={tag} size="tiny" color="tertiary" />
                  ))}
                </div>
              }
              size="medium"
              style={{ height: '100%' }}
              footerStyle={{ padding: '1rem 1rem' }}
            />
          );
        })}
      </div>
    </section>
  );
}
