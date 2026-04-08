import { test, expect } from '@playwright/experimental-ct-react';
import { SimpleInput } from './simple-input';

test('SimpleInput: placeholder visible', async ({ mount, page }) => {
  await mount(<SimpleInput placeholder="Search…" aria-label="Search" />);
  await expect(page.getByPlaceholder('Search…')).toBeVisible();
});
