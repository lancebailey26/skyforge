import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../button/button';
import { Tooltip } from './tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'default'] },
    onVisibleChange: { action: 'visibleChange' },
  },
  args: {
    content: 'Tooltip copy',
    placement: 'top',
    showDelay: 200,
    defaultVisible: true,
    onVisibleChange: fn(),
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button text="Hover or focus me" subColor="outline" />
    </Tooltip>
  ),
};