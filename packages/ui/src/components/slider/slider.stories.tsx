import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { fn } from '@storybook/test';
import { Slider } from './slider';

function SliderStateful(props: ComponentProps<typeof Slider>) {
  const [value, setValue] = useState(props.value ?? 42);
  return <Slider {...props} value={value} onChange={(v) => { setValue(v); props.onChange?.(v); }} />;
}

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Amount',
    min: 0,
    max: 100,
    step: 1,
    value: 42,
    showValue: true,
    onChange: fn(),
  },
  render: (args) => <SliderStateful {...args} />,
  decorators: [(Story) => <div style={{ width: 'min(380px, 92vw)' }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};