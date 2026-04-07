import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Notification } from './notification';

const meta = {
  title: 'Components/Notification',
  component: Notification,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['success', 'error', 'warning', 'info'] },
    placement: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
    onClose: { action: 'close' },
  },
  args: {
    title: 'Heads up',
    description: 'Something happened that you might want to know about.',
    type: 'info',
    onClose: fn(),
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    placement: 'top-right',
  },
};

export const ErrorToast: Story = {
  args: {
    type: 'error',
    title: 'Something went wrong',
    description: 'Try again in a moment.',
  },
};