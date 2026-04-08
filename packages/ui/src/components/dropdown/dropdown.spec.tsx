import { test, expect } from '@playwright/experimental-ct-react';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from './dropdown';
import { SimpleInput } from '../simple-input/simple-input';

test('Dropdown: listbox is portaled when open', async ({ mount, page }) => {
  await mount(
    <Dropdown open onOpenChange={() => {}}>
      <DropdownTrigger>
        <SimpleInput readOnly value="A" aria-label="Pick" />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem onSelect={() => {}}>A</DropdownItem>
        <DropdownItem onSelect={() => {}}>B</DropdownItem>
      </DropdownContent>
    </Dropdown>,
  );
  await expect(page.getByRole('listbox')).toBeVisible();
  await expect(page.getByRole('option', { name: 'B' })).toBeVisible();
});
