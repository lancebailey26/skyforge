import { test, expect } from '@playwright/experimental-ct-react';
import { Header } from './header';

test('Header: banner and title link', async ({ mount, page }) => {
  await mount(
    <Header
      title="Skyforge"
      navigation={{
        items: [{ label: 'About', href: '#about' }],
      }}
    />,
  );
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Skyforge' })).toBeVisible();
});
