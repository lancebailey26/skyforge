import type { Meta, StoryObj } from '@storybook/react';
import { Crawler } from './crawler';
import { Tag } from '../tag/tag';

const items = ['TypeScript', 'React', 'Next.js', 'Node', 'MongoDB'];

const meta = {
  title: 'Components/Crawler',
  component: Crawler,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    draggable: { control: 'boolean' },
    noScroll: { control: 'boolean' },
    noScrollAlign: {
      control: 'select',
      options: ['start', 'end', 'center'],
      if: { arg: 'noScroll', truthy: true },
    },
    pauseOnHover: { control: 'boolean' },
    reverse: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(520px, 94vw)', border: '1px dashed color-mix(in oklch, var(--color-on-surface) 22%, transparent)', borderRadius: 8, padding: 4 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    orientation: 'horizontal',
    speed: 32,
    gap: '0.75rem',
    pauseOnHover: true,
    draggable: true,
    noScroll: false,
    noScrollAlign: 'center',
    reverse: false,
  },
} satisfies Meta<typeof Crawler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Crawler {...args}>
      {items.map((name) => (
        <Tag key={name} text={name} color="secondary" size="small" />
      ))}
    </Crawler>
  ),
};

export const NoScroll: Story = {
  args: {
    noScroll: true,
    noScrollAlign: 'center',
    speed: 32,
  },
  render: (args) => (
    <Crawler {...args}>
      {['Alpha', 'Beta'].map((name) => (
        <Tag key={name} text={name} color="primary" size="small" />
      ))}
    </Crawler>
  ),
};

export const NoScrollAnchoredStart: Story = {
  args: {
    noScroll: true,
    noScrollAlign: 'start',
    speed: 32,
  },
  render: (args) => (
    <Crawler {...args}>
      {['Alpha', 'Beta'].map((name) => (
        <Tag key={name} text={name} color="primary" size="small" />
      ))}
    </Crawler>
  ),
};

export const NoScrollAnchoredEnd: Story = {
  args: {
    noScroll: true,
    noScrollAlign: 'end',
    speed: 32,
  },
  render: (args) => (
    <Crawler {...args}>
      {['Alpha', 'Beta'].map((name) => (
        <Tag key={name} text={name} color="primary" size="small" />
      ))}
    </Crawler>
  ),
};