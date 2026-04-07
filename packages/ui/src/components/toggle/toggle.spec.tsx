import { test, expect } from '@playwright/experimental-ct-react';
import { Toggle } from './toggle';

test('Toggle: label toggles checkbox', async ({ mount, page }) => {
  await mount(<Toggle label="Feature" defaultChecked={false} onChange={() => {}} />);
  const box = page.getByRole('checkbox', { name: 'Feature' });
  await expect(box).toBeAttached();
  await expect(box).not.toBeChecked();
  await page.getByText('Feature').click();
  await expect(box).toBeChecked();
});
