import { test, expect } from '@playwright/experimental-ct-react';
import { FloatingActionLink } from './floating-action-link';

test('FloatingActionLink: link name', async ({ mount, page }) => {
  await mount(<FloatingActionLink href="#hello" label="Hello" ariaLabel="Jump to hello" />);
  await expect(page.getByRole('link', { name: 'Jump to hello' })).toBeVisible();
});
