import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Navigation } from './navigation';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    items: [
      { label: 'About', href: '#about' },
      { label: 'Labs', href: '#labs' },
      { label: 'Action', onClick: fn() },
    ],
  },
  decorators: [(Story) => <div style={{ padding: '1rem', background: 'var(--color-surface)' }}><Story /></div>],
};