import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'xlarge'] },
    mode: { control: 'select', options: ['inlaid', 'popup'] },
    type: { control: 'select', options: ['flat', 'glass'] },
    captionAlign: { control: 'select', options: ['center', 'left', 'right'] },
    onClick: { action: 'clicked' },
    onClose: { action: 'closed' },
  },
  args: {
    title: 'Card title',
    tagline: 'Eyebrow',
    description: 'Short supporting copy for the card body when you need a bit more context.',
    subject: { color: 'oklch(0.55 0.18 264)' },
    onClick: fn(),
  },
  decorators: [(Story) => <div style={{ width: 'min(320px, 92vw)' }}><Story /></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Glass: Story = {
  args: {
    type: 'glass',
    title: 'Glass',
    description: 'Frosted surface variant.',
  },
};