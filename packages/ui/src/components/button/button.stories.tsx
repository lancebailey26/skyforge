import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Button } from './button';

const meta = {
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
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    shape: { control: 'select', options: ['pill', 'circle'] },
    icon: { table: { disable: true }},
    onClick: { action: 'clicked' },
  },
  args: {
    onClick: fn(),
    shape: 'pill',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
  args: {
    text: 'Button',
    size: 'medium',
    color: 'primary',
    subColor: 'filled',
    disabled: false,
  },
};

export const WithIcon: Story = {
  args: {
    text: 'Send',
    icon: faPaperPlane,
    color: 'primary',
    subColor: 'filled',
  },
};

export const CircleIcon: Story = {
  args: {
    icon: faPaperPlane,
    shape: 'circle',
    color: 'primary',
    subColor: 'filled',
    attributes: { 'aria-label': 'Send' },
  },
};

export const AsLink: Story = {
  args: {
    text: 'Learn more',
    type: 'link',
    color: 'primary',
    subColor: 'underline',
  },
};