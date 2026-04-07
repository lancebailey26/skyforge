import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';
import { WorkflowBuilder } from './workflow';

const meta = {
  title: 'Components/WorkflowBuilder',
  component: WorkflowBuilder,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 'min(960px, 98vw)', height: 440, borderRadius: 8, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkflowBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: 'Pipeline',
    inputs: [
      { id: 'in1', label: 'Source A', onToggle: fn(), enabled: true, icon: faRightLong },
    ],
    outputs: [
      { id: 'out1', label: 'Destination', enabled: true },
    ],
    nodes: [
      { id: 'p1', label: 'Transform', variant: 'customized' as const, onClick: fn() },
    ],
    junctions: [],
    connections: [
      { from: 'in1', to: 'p1', enabled: true },
      { from: 'p1', to: 'out1', enabled: true },
    ],
    onInputToggle: fn(),
    onOutputToggle: fn(),
    onWorkflowConnect: fn(),
  },
};

export const Minimal: Story = {
  args: {
    title: 'I/O only',
    inputs: [{ id: 'i1', label: 'In', onToggle: fn(), enabled: true }],
    outputs: [{ id: 'o1', label: 'Out', enabled: true }],
    connections: [{ from: 'i1', to: 'o1' }],
  },
};