import type { ReferenceWorkItem } from '@/types/reference-work';

/**
 * Home #reference section registry. Add an item here and a matching route at app/work/<slug>/.
 */
export const referenceWork: ReferenceWorkItem[] = [
  {
    slug: 'tranztec-ui-kit',
    title: 'Tranztec UI Kit',
    subtitle: 'Production React component library for Tranztec’s next-gen apps',
    description:
      // eslint-disable-next-line max-len
      'Built the initial React + TypeScript implementation of Tranztec’s UI Kit — a fully WCAG 2.1 compliant component library with reusable primitives, CSS Module styling, CSS-variable theming, Storybook documentation, and private package distribution across a monorepo of next-generation apps.',
    techStack: [
      'React',
      'TypeScript',
      'Design Systems',
      'WCAG 2.1',
      'Storybook',
      'CSS Modules',
      'Component Library',
      'Monorepo',
    ],
    tags: ['Case Study'],
    featured: true,
    priority: 0,
    status: 'live',
    route: '/work/tranztec-ui-kit',
    referenceUrl: 'https://www.acpietramala.com/work/tranztec-ui-kit-8eg4w',
    referenceLabel: 'Designer Case Study — Anthony Pietramala',
    imageUrl: 'https://8qucpr4gfdzluv7v.public.blob.vercel-storage.com/Frame%20513491.png'
  },
  {
    slug: 'fuzion',
    title: 'Fuzion',
    subtitle: 'Integration workspace that put AI-assisted mapping in users’ hands',
    description:
      // eslint-disable-next-line max-len
      'Worked extensively on Fuzion — Tranztec’s integration workspace. Shipped React UI that let end users connect external systems, configure data flow between connections, and use embedded AI mapping without writing code — collapsing implementation time from weeks to under a day.',
    techStack: [
      'React',
      'TypeScript',
      'Product Engineering',
      'AI Workflows',
      'Integrations',
      'Monorepo',
    ],
    tags: ['Case Study'],
    featured: true,
    priority: 1,
    status: 'live',
    route: '/work/fuzion',
    referenceUrl: 'https://www.acpietramala.com/work/fuzion',
    referenceLabel: 'Designer Case Study — Anthony Pietramala',
    imageUrl: 'https://8qucpr4gfdzluv7v.public.blob.vercel-storage.com/14c6570b-0883-46dd-b510-0ea2bb8cc579.png'
  },
];

export function getReferenceWorkBySlug(slug: string): ReferenceWorkItem | undefined {
  return referenceWork.find((item) => item.slug === slug);
}