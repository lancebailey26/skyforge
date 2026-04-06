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
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient tech-marquee-section"
      data-ambient="0"
      aria-labelledby="tech-stack-heading"
    >
      <div className="tech-marquee-shell">
        <div className="tech-marquee-copy">
          <header className="tech-marquee-header">
            <p className="tech-marquee-eyebrow">Stack</p>
            <h2 id="tech-stack-heading" className="tech-marquee-title">
              Tech I use
            </h2>
            <p className="tech-marquee-subtitle">
              Languages, frameworks, and tooling I reach for when building products and experiments.
            </p>
          </header>

          <ul className="tech-marquee-tags" aria-label="Technologies in this stack">
            {technologies.map((tech) => (
              <li key={tech.name}>
                <span className="tech-marquee-tag">{tech.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tech-marquee-visual">
          <div className="tech-marquee-stage">
            <p className="tech-marquee-stage-kicker">Along for the ride</p>
            <div className="tech-marquee-track">
              <Crawler orientation="horizontal" speed={36} gap="clamp(1rem, 3vw, 2.25rem)">
                {technologies.map((tech) => (
                  <div key={tech.name} className="tech-marquee-item" title={tech.name}>
                    <div className="tech-marquee-item-inner">
                      <img
                        src={tech.logo}
                        alt=""
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <span className="tech-marquee-name">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </Crawler>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}