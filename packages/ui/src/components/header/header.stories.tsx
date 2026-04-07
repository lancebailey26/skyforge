import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../button/button';
import { Header } from './header';

const nav = {
  items: [
    { label: 'About', href: '#about' },
    { label: 'Stack', href: '#stack' },
    { label: 'Contact', href: '#contact' },
  ],
};

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: 'Skyforge',
    navigation: nav,
    actions: <Button text="Action" size="small" subColor="tonal" onClick={fn()} />,
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Skyforge',
  },
};