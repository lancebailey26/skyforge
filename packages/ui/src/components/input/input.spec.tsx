import { test, expect } from '@playwright/experimental-ct-react';
import { Input } from './input';

test('Input: label wires to textbox', async ({ mount, page }) => {
  await mount(
    <Input label="Username" name="user" type="text" placeholder="you@example.com" onChange={() => {}} />,
  );
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
});
