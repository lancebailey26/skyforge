'use client';
import { useEffect, useState } from 'react';
import { Card, Tag } from '@skyforge/ui';
import { Project } from '@/types/project';
import { useTitle } from '@/hooks/useTitle';
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  useTitle("Projects");
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem',
        width: '100%',
        minWidth: 0
      }}>
        {projects.map((project) => {
          const subjectContent = project.imageUrl ?
            { src: project.imageUrl, alt: project.title } :
            null;

          return (
            <Card
              key={project._id}
              title={project.title}
              subject={subjectContent}
              description={project.description}
              onClick={() => project.url && window.open(project.url, '_blank')}
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
    </div>
  );
}