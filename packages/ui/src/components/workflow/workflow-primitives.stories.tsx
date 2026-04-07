import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { WorkflowNode } from './node/node';
import { ProcessingNode } from './processing-node/processing-node';
import { Junction } from './junction/junction';

function WorkflowNodeInputDemo() {
  const [enabled, setEnabled] = useState(true);
  return (
    <WorkflowNode
      id="demo-in"
      label="Input port"
      variant="input"
      icon={faBolt}
      enabled={enabled}
      onToggle={setEnabled}
    />
  );
}

function WorkflowNodeOutputDemo() {
  const [enabled, setEnabled] = useState(false);
  return (
    <WorkflowNode
      id="demo-out"
      label="Output port"
      variant="output"
      enabled={enabled}
      onToggle={setEnabled}
    />
  );
}

const meta = {
  title: 'Components/Workflow primitives',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const WorkflowNodeInput: StoryObj = {
  name: 'WorkflowNode (input)',
  render: () => <WorkflowNodeInputDemo />,
};

export const WorkflowNodeOutput: StoryObj = {
  name: 'WorkflowNode (output)',
  render: () => <WorkflowNodeOutputDemo />,
};

export const Processing: StoryObj = {
  name: 'ProcessingNode',
  render: () => (
    <ProcessingNode id="demo-proc" label="Process" variant="customized" icon={faBolt} onClick={fn()} />
  ),
};

export const JunctionBlock: StoryObj = {
  name: 'Junction',
  render: () => <Junction id="demo-j" inputCount={2} outputCount={3} />,
};