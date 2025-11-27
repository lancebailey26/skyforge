'use client';
import { Container, Button, Card } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconBar } from '@skyforge/ui';
import Link from 'next/link';

const technologies = [
    {
        name: 'TypeScript',
        logo: 'https://skillicons.dev/icons?i=ts',
        fallbackColor: '#3178C6'
    },
    {
        name: 'React',
        logo: 'https://skillicons.dev/icons?i=react',
        fallbackColor: '#61DAFB'
    },
    {
        name: 'Next.js',
        logo: 'https://skillicons.dev/icons?i=nextjs',
        fallbackColor: '#000000'
    },
    {
        name: 'Node.js',
        logo: 'https://skillicons.dev/icons?i=nodejs',
        fallbackColor: '#339933'
    },
    {
        name: 'MongoDB',
        logo: 'https://skillicons.dev/icons?i=mongodb',
        fallbackColor: '#47A248'
    }
];

function getTechSubject(tech: typeof technologies[0]) {
    return {
        src: tech.logo,
        alt: `${tech.name} logo`
    };
}

export default function AboutPage() {
    useTitle('About');

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <Container size="large" padding="lg" glass={true}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            margin: 0
                        }}>
                            About
                        </h1>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <IconBar
                                size="large"
                                icons={[
                                    {
                                        icon: faGithub,
                                        href: 'https://github.com/lancebailey26',
                                        ariaLabel: 'GitHub profile'
                                    },
                                    {
                                        icon: faLinkedin,
                                        href: 'https://linkedin.com/in/lance-bailey',
                                        ariaLabel: 'LinkedIn profile'
                                    }
                                ]}
                            />
                            <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button
                                    text="View Resume"
                                    icon={faFilePdf}
                                    size="medium"
                                    color="primary"
                                    subColor="outline"
                                />
                            </Link>
                        </div>
                    </div>

                    <section style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        alignItems: 'center'
                    }}>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--color-on-surface-alt)',
                            lineHeight: 1.8,
                            margin: 0,
                            textAlign: 'center'
                        }}>
                            Hi! I'm Lance. Welcome to Skyforge, which is a goofy name I use for my portfolio. Here you get a glimpse of the technologies I'm familiar with.
                            You'll also find some of the projects I've worked on, and some that are in active development.
                        </p>

                    </section>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'stretch'
                    }}>

                        {technologies.map((tech) => {
                            const subject = getTechSubject(tech);
                            return (
                                <Card
                                    key={tech.name}
                                    description={tech.name}
                                    subject={subject}
                                    size="medium"
                                    type="glass"
                                    style={{
                                        height: '100%',
                                        flex: '0 1 calc(20% - 1.2rem)',
                                        minWidth: '180px',
                                        maxWidth: '200px'
                                    }}
                                    subjectStyle={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1.5rem',
                                        backgroundColor: 'var(--color-container-high)',
                                        overflow: 'visible'
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </Container>
        </div>
    );
}