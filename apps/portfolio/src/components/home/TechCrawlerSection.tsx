'use client';

import { Crawler } from '@lancebailey26/skyforge-ui';

const technologies = [
  { name: 'TypeScript', logo: 'https://skillicons.dev/icons?i=ts' },
  { name: 'React', logo: 'https://skillicons.dev/icons?i=react' },
  { name: 'Next.js', logo: 'https://skillicons.dev/icons?i=nextjs' },
  { name: 'Node.js', logo: 'https://skillicons.dev/icons?i=nodejs' },
  { name: 'MongoDB', logo: 'https://skillicons.dev/icons?i=mongodb' },
];

export function TechCrawlerSection() {
  return (
    <section
      id="tech-stack"
      className="portfolio-section-anchor portfolio-snap-section tech-marquee-section"
      aria-label="Technologies"
    >
      <div className="tech-marquee-inner">
        <Crawler orientation="horizontal" speed={36} gap="1.125rem">
          {technologies.map((tech) => (
            <div key={tech.name} className="tech-marquee-item" title={tech.name}>
              <img
                src={tech.logo}
                alt={`${tech.name} logo`}
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </Crawler>
      </div>
    </section>
  );
}