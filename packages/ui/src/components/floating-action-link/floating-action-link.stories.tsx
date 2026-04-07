import type { Meta, StoryObj } from '@storybook/react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FloatingActionLink } from './floating-action-link';

const meta = {
  title: 'Components/FloatingActionLink',
  component: FloatingActionLink,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    href: '#contact',
    label: 'Contact',
    ariaLabel: 'Go to contact',
    icon: faEnvelope,
  },
} satisfies Meta<typeof FloatingActionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IconOnly: Story = {
  args: {
    label: undefined,
    ariaLabel: 'Open mail',
    href: 'mailto:hello@example.com',
  },
};