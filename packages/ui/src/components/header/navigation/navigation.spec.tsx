import { test, expect } from '@playwright/experimental-ct-react';
import { Navigation } from './navigation';

test('Navigation: links list', async ({ mount, page }) => {
  await mount(
    <Navigation
      items={[
        { label: 'Home', href: '/' },
        { label: 'Docs', href: '/docs' },
      ]}
    />,
  );
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
});
