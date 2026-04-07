import { test, expect } from '@playwright/experimental-ct-react';
import { Tag } from './tag';

test('Tag: text shows', async ({ mount, page }) => {
  await mount(<Tag text="TypeScript" color="primary" />);
  await expect(page.getByText('TypeScript')).toBeVisible();
});
