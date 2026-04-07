import { test, expect } from '@playwright/experimental-ct-react';
import { Notification } from './notification';

test('Notification: title in document', async ({ mount, page }) => {
  await mount(
    <Notification title="Saved" description="Your changes are stored." type="success" />,
  );
  await expect(page.getByText('Saved')).toBeVisible();
  await expect(page.getByText('Your changes are stored.')).toBeVisible();
});
