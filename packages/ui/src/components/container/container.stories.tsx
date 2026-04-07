import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './container';
import { Tag } from '../tag/tag';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'xlarge', 'full'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    glass: { control: 'boolean' },
  },
  args: {
    glass: false,
    size: 'medium',
    padding: 'md',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Container {...args}>
      <p style={{ margin: 0 }}>Content inside the container. Resize the viewport to see max-width.</p>
      <Tag text="Chip" style={{ marginTop: '0.75rem' }} />
    </Container>
  ),
};

export const Glass: Story = {
  args: { glass: true },
  render: (args) => (
    <Container {...args}>
      <span>Glass panel</span>
    </Container>
  ),
};