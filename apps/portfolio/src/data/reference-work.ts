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
      'Built Tranztec’s initial React UI Kit — WCAG 2.1 components, CSS Modules, theming, Storybook, and NPM distribution.',
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
      'Built React UI for Fuzion — no-code integrations, data flows, and AI mapping that cut implementation from weeks to a day.',
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