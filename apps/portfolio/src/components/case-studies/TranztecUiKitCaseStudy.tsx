'use client';

import Link from 'next/link';
import { Button, Card, Container, Input } from '@lancebailey26/skyforge-ui';
import {
  CaseStudyCallout,
  CaseStudyDiagram,
  CaseStudyImage,
  CaseStudySection,
  CodeExample,
} from './CaseStudyBlocks';
import { metadata } from '@/app/work/tranztec-ui-kit/metadata';

const REPRESENTATIVE_NOTE =
  'The implementation examples shown here come from my personal `/packages/ui` library (`@lancebailey26/skyforge-ui`), which follows the same architectural patterns I used at Tranztec. The original Tranztec source code is proprietary.';

const FLOW_DIAGRAM = `Design system
  ↓
CSS variables / tokens
  ↓
Theme provider
  ↓
React + TypeScript components
  ↓
Storybook documentation
  ↓
Private npm package
  ↓
Next-gen Tranztec apps`;

const PACKAGE_DIAGRAM = `@tranztec/ui-kit
├─ React + TypeScript components
├─ CSS Modules
├─ CSS variable color library
├─ ThemeProvider
├─ Storybook documentation
└─ Private npm package
      ↓
Next-gen apps + retrofitted older screens`;

const PORTFOLIO_PACKAGE_DIAGRAM = `@lancebailey26/skyforge-ui
├─ src/components/     (Button, Input, Card, Container, …)
├─ src/theme/tokens.css
├─ index.ts            (barrel + tokens.css side-effect)
├─ *.module.css        (per-component styling)
├─ *.stories.tsx       (Storybook catalog)
└─ dist/               (published package)
      ↓
Portfolio app + future consumers`;

const IMPORT_SNIPPET = `import { Button, Card, Container, Input } from "@lancebailey26/skyforge-ui";
import "@lancebailey26/skyforge-ui/theme/tokens.css";`;

const INDEX_EXPORTS_SNIPPET = `import "./theme/tokens.css";
export { Button } from "./components/button/button";
export type { ButtonProps } from "./components/button/button";
export { Input } from "./components/input/input";
export { Card } from "./components/card/card";
export { Container } from "./components/container/container";
// …additional primitives and workflow components`;

const BUTTON_PROPS_SNIPPET = `export interface ButtonProps {
  icon?: IconProp;
  text?: string;
  shape?: 'pill' | 'circle';
  size?: 'tiny' | 'small' | 'medium' | 'large';
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  subColor?: 'filled' | 'tonal' | 'outline' | 'surface' | 'clear' | 'underline';
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  // …
}`;

const BUTTON_MODULE_SNIPPET = `:global(.primary.filled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

:global(.primary.tonal) {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}`;

const INPUT_PROPS_SNIPPET = `interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  errored?: boolean;
  disabled?: boolean;
  style?: 'fill' | 'outline';
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'datetime-local';
  onChange?: (value: string) => void;
  // …
}`;

const TOKENS_SNIPPET = `:root,
html:not(.dark) {
  --color-primary: oklch(0.58 0.2 264);
  --color-primary-soft: oklch(0.95 0.04 264);
  --color-bg: oklch(0.985 0.004 264);
  --color-surface: oklch(1 0 0);
  /* …semantic tokens */
}

html.dark {
  --color-primary: oklch(0.68 0.16 264);
  --color-bg: oklch(0.19 0.01 264);
  /* …dark overrides */
}`;

const THEME_WIRING_SNIPPET = `// Portfolio app — next-themes toggles html.dark; tokens respond in CSS
import "@lancebailey26/skyforge-ui/theme/tokens.css";
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>`;

const STORYBOOK_SNIPPET = `const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['tiny', 'small', 'medium', 'large'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'error'] },
    subColor: {
      control: 'select',
      options: ['filled', 'tonal', 'outline', 'surface', 'clear', 'underline'],
    },
  },
} satisfies Meta<typeof Button>;`;

const USAGE_SNIPPET = `// Representative consumer code (personal UI package)
<Container size="medium" padding="md">
  <Input label="Account" type="text" placeholder="Search shipments…" />
  <Button text="Save" color="primary" subColor="filled" size="medium" />
</Container>`;

const HIGHLIGHTS = [
  'Built every initial React component in the production kit',
  'Fully WCAG 2.1 compliant across the component set',
  'Reusable foundation with TypeScript and CSS Modules',
  'CSS-variable theming through shared tokens',
  'Storybook documentation for adoption',
  'Standard for all new Tranztec apps',
  'Faster UI work and design/dev handoff',
];

export function TranztecUiKitCaseStudy() {
  return (
    <>
      <div className="case-study-intro">
        <CaseStudyCallout>
          <p>{REPRESENTATIVE_NOTE}</p>
        </CaseStudyCallout>

        {metadata.referenceUrl ? (
          <p className="case-study-meta-bar">
            <a href={metadata.referenceUrl} target="_blank" rel="noopener noreferrer">
              {metadata.referenceLabel ?? 'External reference'}
            </a>
          </p>
        ) : null}
      </div>

      <CaseStudySection id="overview" title="Overview">
        <p>
          Tranztec&apos;s UI Kit was the shared design and component system for the company&apos;s next-generation React
          applications. <strong>Anthony Pietramala</strong> designed the visual system; I built the initial production
          implementation in React and TypeScript — component APIs, CSS Module styling, CSS-variable-driven themes,
          theme provider integration, Storybook documentation, and the private package structure that let every new app
          import the same primitives. The shipped kit was <strong>fully WCAG 2.1 compliant</strong> — accessibility was built
          into the components, not bolted on per screen.
        </p>
        <p>
          The kit became the default foundation for product UI: developers imported controls instead of reinventing them,
          and the product surface felt cohesive and accessible across apps.
        </p>
        {metadata.imageUrl ? (
          <CaseStudyImage
            src={metadata.imageUrl}
            alt="Tranztec UI Kit component library overview"
            caption="UI Kit visual system — designed by Anthony Pietramala"
          />
        ) : null}
        <ul className="case-study-highlights" aria-label="Project highlights">
          {HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CaseStudySection>

      <CaseStudySection id="problem" title="The Problem">
        <p>
          Before the UI Kit, product UI was often bespoke. Developers repeatedly rebuilt common controls. Styling decisions
          happened screen by screen. There was no shared implementation layer for tokens, states, accessibility patterns, or
          component behavior. Feature work slowed down, and the product felt less cohesive.
        </p>
      </CaseStudySection>

      <CaseStudySection id="role" title="My Role">
        <p>
          <strong>I built every React component in the initial production kit.</strong> I was one of the principal developers
          responsible for translating the design system into a reusable library that became the foundation for Tranztec&apos;s
          next-generation apps.
        </p>
        <ul>
          <li>Implemented the initial React + TypeScript component library</li>
          <li>Built reusable components for common product UI patterns</li>
          <li>Implemented accessibility so the kit met WCAG 2.1 (keyboard, focus, contrast, labels, and ARIA patterns)</li>
          <li>Styled components with CSS Modules</li>
          <li>Wired components into a CSS-variable color and token system</li>
          <li>Integrated theme support through a provider</li>
          <li>Documented components and usage patterns in Storybook</li>
          <li>Helped package the kit for internal reuse as a private npm package</li>
          <li>Supported adoption across new apps and gradual migration into older apps</li>
          <li>Used PR reviews to identify reusable patterns and move them into the kit</li>
        </ul>
      </CaseStudySection>

      <CaseStudySection id="architecture" title="Architecture">
        <p>At Tranztec, the kit followed a predictable pipeline from design tokens to shipped product UI:</p>
        <CaseStudyDiagram title="Production pipeline">{FLOW_DIAGRAM}</CaseStudyDiagram>
        <CaseStudyDiagram title="Tranztec package (conceptual)">{PACKAGE_DIAGRAM}</CaseStudyDiagram>
        <p>
          My current portfolio UI package mirrors that structure. It lives in <code>packages/ui</code>, publishes as{' '}
          <code>@lancebailey26/skyforge-ui</code>, and ships tokens as a subpath export so consumers load the same CSS
          contract:
        </p>
        <CaseStudyDiagram title="Portfolio package layout">{PORTFOLIO_PACKAGE_DIAGRAM}</CaseStudyDiagram>
        <CodeExample title="Representative import — @lancebailey26/skyforge-ui">{IMPORT_SNIPPET}</CodeExample>
        <CodeExample title="Barrel exports — packages/ui/src/index.ts">{INDEX_EXPORTS_SNIPPET}</CodeExample>
      </CaseStudySection>

      <CaseStudySection id="implementation" title="Component Implementation">
        <p>
          Components were typed React modules with co-located CSS Modules. Variants mapped to explicit props; styles consumed
          shared CSS variables so product teams did not hard-code colors per screen. Shared primitives carried focus rings,
          keyboard interaction, and labeling conventions so new screens inherited WCAG 2.1 compliance by default.
        </p>
        <div className="case-study-showcase">
          <p className="tech-marquee-stage-kicker">Live examples — personal UI package</p>
          <div className="case-study-showcase-grid">
            <Container size="small" padding="md" className="case-study-showcase-cell">
              <p className="case-study-showcase-label">Button</p>
              <Button text="Primary" color="primary" subColor="filled" size="medium" />
              <Button text="Tonal" color="primary" subColor="tonal" size="small" />
            </Container>
            <Container size="small" padding="md" className="case-study-showcase-cell">
              <p className="case-study-showcase-label">Input</p>
              <Input label="Label" type="text" placeholder="Value" style="fill" />
            </Container>
            <Container size="small" padding="md" className="case-study-showcase-cell">
              <p className="case-study-showcase-label">Card</p>
              <Card
                title="Shipment"
                description="Representative product card using shared primitives."
                subject={{ color: 'var(--color-container-high)' }}
                size="small"
                type="flat"
              />
            </Container>
          </div>
        </div>
        <CodeExample title="ButtonProps — packages/ui/src/components/button/button.tsx">{BUTTON_PROPS_SNIPPET}</CodeExample>
        <CodeExample title="Variant styling via CSS variables — button.module.css">{BUTTON_MODULE_SNIPPET}</CodeExample>
        <CodeExample title="InputProps — packages/ui/src/components/input/input.tsx">{INPUT_PROPS_SNIPPET}</CodeExample>
        <CodeExample title="Representative screen assembly">{USAGE_SNIPPET}</CodeExample>
      </CaseStudySection>

      <CaseStudySection id="theming" title="Theming">
        <p>
          Theme and shared tokens lived above individual components, so product teams could assemble screens without manually
          restyling every control. Components inherited the correct colors, spacing, and interaction states from shared
          context and CSS variables.
        </p>
        <p>
          At Tranztec, theme context was provided through a dedicated provider. My current portfolio UI package demonstrates
          the same token-driven approach, though the exact implementation differs from the proprietary Tranztec code: semantic
          tokens live in <code>tokens.css</code>, and the portfolio app toggles <code>html.dark</code> via{' '}
          <code>next-themes</code>.
        </p>
        <CodeExample title="Semantic tokens — packages/ui/src/theme/tokens.css">{TOKENS_SNIPPET}</CodeExample>
        <CodeExample title="Theme wiring — apps/portfolio/src/app/layout.tsx">{THEME_WIRING_SNIPPET}</CodeExample>
      </CaseStudySection>

      <CaseStudySection id="storybook" title="Storybook and Documentation">
        <p>
          Storybook was a core part of adoption. It made components discoverable, let developers inspect variants and props,
          and gave the team a shared source of truth for usage patterns — component variants, Controls, theme examples, usage
          notes, faster onboarding, and easier design/dev handoff.
        </p>
        <p>
          This repo carries the same idea forward: colocated <code>*.stories.tsx</code> files under{' '}
          <code>packages/ui/src/components</code>, runnable with <code>npm run storybook</code> in the UI package.
        </p>
        <CodeExample title="Storybook meta — packages/ui/src/components/button/button.stories.tsx">
          {STORYBOOK_SNIPPET}
        </CodeExample>
      </CaseStudySection>

      <CaseStudySection id="adoption" title="Adoption">
        <p>
          The kit lived in the next-gen app monorepo and was distributed as a private npm package. It became the standard for
          every new Tranztec app going forward and was gradually adopted into older projects.
        </p>
        <p>
          <strong>Adoption did not happen only through packaging.</strong> It happened through code review. When new product
          work introduced a reusable pattern, I often pushed for it to be added to the UI Kit instead of staying buried in a
          one-off screen.
        </p>
      </CaseStudySection>

      <CaseStudySection id="impact" title="Impact">
        <blockquote className="case-study-impact-quote">
          The biggest impact was speed. Once the kit existed, building product UI became dramatically faster. If I needed an
          input, button, card, or layout primitive, I could import the component, set the props, and focus on the product logic
          instead of rebuilding the interface from scratch.
        </blockquote>
        <ul>
          <li>UI implementation became significantly faster — roughly twice as fast from a developer-experience standpoint</li>
          <li>Design handoff and implementation became easier with shared primitives and Storybook</li>
          <li>New apps felt more cohesive and modern; customers responded positively to the updated look</li>
          <li>Product UI met a consistent WCAG 2.1 bar without re-auditing every control on every feature</li>
          <li>The kit became the default foundation for future product work</li>
        </ul>
      </CaseStudySection>

      <CaseStudySection id="reflection" title="Reflection">
        <p className="case-study-reflection">
          This project changed how I think about frontend work. A good component library is not just a folder of reusable UI. It
          is product infrastructure. It gives designers and engineers a shared language, keeps teams from solving the same
          problem repeatedly, and lets developers spend more time on the actual product.
        </p>
        <p className="case-study-footer-nav">
          <Link href="/#reference">← Back to reference work</Link>
        </p>
      </CaseStudySection>
    </>
  );
}
