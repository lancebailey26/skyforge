import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'tel', 'url', 'datetime-local'] },
    style: { control: 'select', options: ['fill', 'outline'] },
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Label',
    type: 'text',
    onChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: 'min(360px, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    placeholder: 'Type here…',
    style: 'fill',
  },
};

export const Outline: Story = {
  args: {
    placeholder: 'Outline field',
    style: 'outline',
  },
};