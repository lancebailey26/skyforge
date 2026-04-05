'use client';

export function AboutSection() {
  return (
    <section id="about" className="portfolio-section-anchor portfolio-snap-section about-hero-section" style={{
      backgroundImage: "var(--portfolio-bg-image)",
    }}>
      <div className="about-hero-inner">
        <div className="about-hero-text">
          <h2 className="about-hero-title">Skyforge</h2>
          <p className="about-hero-lead">Hi! I&apos;m Lance.</p>
          <p className="about-hero-body">
            Welcome to Skyforge, which is a goofy name I use for my portfolio. Here you get a glimpse of the technologies
            I&apos;m familiar with. You&apos;ll also find some of the projects I&apos;ve worked on, and some that are in
            active development.
          </p>
        </div>
      </div>
    </section>
  );
}