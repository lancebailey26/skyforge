import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Tag } from './tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error', 'warning', 'info', 'success'],
    },
    size: { control: 'select', options: ['tiny', 'small', 'medium', 'large'] },
    onClick: { action: 'clicked' },
    onRemove: { action: 'removed' },
  },
  args: {
    text: 'Tag',
    color: 'primary',
    size: 'medium',
    onClick: fn(),
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = {
  args: {
    text: 'Featured',
    icon: faStar,
  },
};

export const Removable: Story = {
  args: {
    text: 'Filter',
    removable: true,
    onRemove: fn(),
  },
};