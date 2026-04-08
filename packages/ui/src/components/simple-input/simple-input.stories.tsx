import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SimpleInput } from './simple-input';

const meta = {
  title: 'Components/SimpleInput',
  component: SimpleInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'change' },
  },
  args: {
    placeholder: 'Type here…',
    onChange: fn(),
  },
  decorators: [(Story) => <div style={{ width: 'min(360px, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof SimpleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Label',
  },
};

export const NoLabel: Story = {
  args: {
    label: undefined,
    'aria-label': 'Search',
  },
};

export const Invalid: Story = {
  args: {
    label: 'Email',
    invalid: true,
    defaultValue: 'not-an-email',
  },
};
