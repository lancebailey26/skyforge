import type { Meta, StoryObj } from '@storybook/react';
import { DraggableChip } from './draggable-chip';

const meta = {
  title: 'Components/DraggableChip',
  component: DraggableChip,
  render: (args) => <DraggableChip {...args} />,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['tiny', 'small', 'medium', 'large'] },
    tone: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'error'] },
    fill: {
      control: 'select',
      options: ['filled', 'tonal', 'outline', 'surface', 'clear'],
    },
    elongated: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: {
    text: 'Drag me to the canvas',
    size: 'medium',
    tone: 'primary',
    fill: 'filled',
    elongated: true,
  },
} satisfies Meta<typeof DraggableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
};

/** Default look stays underneath — `style` overrides what you set (e.g. background, border). */
export const StyleOverride: Story = {
  args: {
    text: 'Custom chrome via style',
    tone: 'primary',
    fill: 'filled',
    elongated: true,
    draggable: true,
    style: {
      border: '2px dashed oklch(0.55 0.18 264)',
      background: 'linear-gradient(120deg, oklch(0.97 0.04 264), oklch(0.92 0.06 300))',
      fontFamily: 'Georgia, serif',
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: 'oklch(0.35 0.12 264)',
    },
  },
};

export const SecondaryTonal: Story = {
  args: {
    text: 'Reorder blocks',
    tone: 'secondary',
    fill: 'tonal',
    elongated: true,
    draggable: true,
    id: 'draggable-chip-demo',
    'data-testid': 'draggable-chip-drag',
  },
};

export const CompactPill: Story = {
  args: {
    text: 'Short label',
    tone: 'primary',
    fill: 'filled',
    elongated: false,
  },
};

export const LabelTypography: Story = {
  args: {
    text: 'Outer chrome vs label',
    tone: 'tertiary',
    fill: 'surface',
    labelStyle: {
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      fontWeight: 600,
    },
  },
};

export const CustomMarkup: Story = {
  render: (args) => (
    <DraggableChip
      {...args}
      style={{
        border: '1px solid #c4b5fd',
        background: '#f5f3ff',
        fontFamily: 'system-ui',
        ...args.style,
      }}
    >
      <strong>Step 3</strong>
      {' — '}
      Validate payload
    </DraggableChip>
  ),
  args: {
    elongated: false,
  },
};
