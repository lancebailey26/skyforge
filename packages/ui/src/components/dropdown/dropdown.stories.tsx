import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  type DropdownProps,
} from './dropdown';
import { SimpleInput } from '../simple-input/simple-input';

const options = ['Neptune', 'Uranus', 'Saturn', 'Jupiter', 'Mars'];

type PlaygroundViewProps = Pick<DropdownProps, 'searchable' | 'className'> & {
  onOpenChange?: DropdownProps['onOpenChange'];
};

function PlaygroundView({ searchable, className, onOpenChange }: PlaygroundViewProps) {
  const [value, setValue] = useState(options[2]);
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      className={className}
      open={open}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        setOpen(next);
      }}
      searchable={searchable}
    >
      <DropdownTrigger>
        <SimpleInput value={value} label="Planet" placeholder="Choose…" />
      </DropdownTrigger>
      <DropdownContent searchPlaceholder="Filter planets…">
        {options.map((o) => (
          <DropdownItem key={o} selected={o === value} onSelect={() => setValue(o)}>
            {o}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    searchable: { control: 'boolean' },
  },
  args: {
    onOpenChange: fn(),
    searchable: false,
  },
  decorators: [(Story) => <div style={{ width: 'min(360px, 90vw)' }}><Story /></div>],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Toggle **searchable** in Controls to show or hide the panel filter field. */
export const Playground: Story = {
  render: (args) => (
    <PlaygroundView
      searchable={args.searchable ?? false}
      className={args.className}
      onOpenChange={args.onOpenChange}
    />
  ),
};

export const Uncontrolled: Story = {
  render: (args) => (
    <Dropdown
      defaultOpen={false}
      searchable={args.searchable ?? false}
      onOpenChange={args.onOpenChange}
      className={args.className}
    >
      <DropdownTrigger>
        <SimpleInput value="Saturn" label="Planet" />
      </DropdownTrigger>
      <DropdownContent searchPlaceholder="Filter…">
        <DropdownItem onSelect={fn()}>Neptune</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={fn()}>Mars</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};