'use client';

export function AboutSection() {
  return (
    <section
      id="about"
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient about-hero-section"
      data-ambient="1"
      style={{ display: 'flex' }}
    >
      <div className="about-hero-inner">
        <div className="about-hero-text">
          <h1 className="about-hero-title">Lance Bailey</h1>
          <p className="about-hero-lead">Web Developer · Product-Minded Builder · UX Enthusiast</p>
          <p className="about-hero-body">
          I design and ship interfaces people actually enjoy using — polished product UI, practical APIs, and thoughtful user experiences.
          </p>
        </div>
      </div>
    </section>
  );
}