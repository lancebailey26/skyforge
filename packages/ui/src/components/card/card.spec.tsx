import { test, expect } from '@playwright/experimental-ct-react';
import { Card } from './card';

test('Card: title and subject paint', async ({ mount, page }) => {
  await mount(
    <Card
      title="Alpha"
      tagline="Beta"
      description="Gamma"
      subject={{ color: 'oklch(0.55 0.12 264)' }}
    />,
  );
  await expect(page.getByRole('heading', { level: 3, name: 'Alpha' })).toBeVisible();
  await expect(page.getByText('Gamma')).toBeVisible();
});
