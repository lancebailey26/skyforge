import type { Meta, StoryObj } from '@storybook/react';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconBar } from './iconbar';

const sample = [
  { icon: faGithub, href: 'https://github.com', ariaLabel: 'GitHub' },
  { icon: faLinkedin, href: 'https://linkedin.com', ariaLabel: 'LinkedIn' },
];

const meta = {
  title: 'Components/IconBar',
  component: IconBar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['tiny', 'small', 'medium', 'large'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error', 'warning', 'info', 'success'],
    },
  },
  args: {
    icons: sample,
    size: 'large',
    color: 'primary',
  },
} satisfies Meta<typeof IconBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};