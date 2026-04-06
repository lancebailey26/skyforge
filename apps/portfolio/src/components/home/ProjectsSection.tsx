'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Crawler, Tag } from '@lancebailey26/skyforge-ui';
import { Project } from '@/types/project';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const signalLabels = ['Shipped work', 'Live products', 'Polish & detail'];

type DeckItem =
  | { kind: 'project'; project: Project }
  | { kind: 'filler' };

function MoreToComeCard() {
  return (
    <Card
      title="More to come soon"
      description="Additional projects and case studies will show up here. Stay tuned!."
      subject={{ color: 'color-mix(in oklch, var(--color-primary) 8%, var(--color-container-high))' }}
      type="glass"
      size="medium"
      style={{ height: '100%' }}
    />
  );
}

function ProjectCard({ project }: { project: Project }) {
  const subjectContent = project.imageUrl ? { src: project.imageUrl, alt: project.title } : null;

  return (
    <Card
      title={project.title}
      subject={subjectContent ?? { color: 'var(--color-container-high)' }}
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
}

function DeckCard({ item }: { item: DeckItem }) {
  if(item.kind === 'filler') {
    return <MoreToComeCard />;
  }
  return <ProjectCard project={item.project} />;
}

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

  const deck = useMemo((): DeckItem[] => {
    const items: DeckItem[] = projects.map((project) => ({ kind: 'project' as const, project }));
    if(projects.length < 3) {
      items.push({ kind: 'filler' });
    }
    return items;
  }, [projects]);

  return (
    <section
      id="projects"
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient tech-marquee-section"
      data-ambient="2"
      aria-labelledby="projects-heading"
    >
      <div className="tech-marquee-shell tech-marquee-shell--flip">
        <div className="tech-marquee-visual tech-marquee-visual--bleed-start">
          <div className="tech-marquee-stage">
            <p className="tech-marquee-stage-kicker">On the record</p>
            <div className="tech-marquee-track">
              {deck.length <= 1 ?
(
                <div className="tech-marquee-single-slot">
                  <div className="tech-marquee-single-slot-inner">
                    <DeckCard item={deck[0]} />
                  </div>
                </div>
              ) :
(
                <Crawler orientation="horizontal" speed={32} gap="clamp(1rem, 3vw, 2rem)" pauseOnHover>
                  {deck.map((item) => (
                    <div
                      key={item.kind === 'project' ? (item.project._id ?? item.project.slug) : 'more-soon'}
                      className="tech-marquee-crawler-card"
                    >
                      <DeckCard item={item} />
                    </div>
                  ))}
                </Crawler>
              )}
            </div>
          </div>
        </div>

        <div className="tech-marquee-copy">
          <header className="tech-marquee-header">
            <p className="tech-marquee-eyebrow">Portfolio</p>
            <h2 id="projects-heading" className="tech-marquee-title">
              Projects
            </h2>
            <p className="tech-marquee-subtitle">
              Things I&apos;ve built or shaped end to end. Product work, side quests, and ideas pushed close to the
              finish line.
            </p>
          </header>

          <ul className="tech-marquee-tags" aria-label="Project themes">
            {signalLabels.map((label) => (
              <li key={label}>
                <span className="tech-marquee-tag">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}