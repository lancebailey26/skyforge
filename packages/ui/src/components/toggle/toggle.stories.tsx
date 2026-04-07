import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Toggle } from './toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Notifications',
    defaultChecked: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  args: {
    label: 'On / off',
    iconOn: faCheck,
    iconOff: faXmark,
    defaultChecked: true,
  },
};