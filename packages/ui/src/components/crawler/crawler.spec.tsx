import { test, expect } from '@playwright/experimental-ct-react';
import { Crawler } from './crawler';

test('Crawler: region and children', async ({ mount, page }) => {
  await mount(
    <Crawler orientation="horizontal" speed={0} draggable={false} pauseOnHover={false}>
      <span>Alpha</span>
      <span>Beta</span>
    </Crawler>,
  );
  await expect(page.getByRole('region', { name: 'Scrolling content' })).toBeVisible();
  await expect(page.getByText('Alpha').first()).toBeVisible();
});
