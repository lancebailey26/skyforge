import { test, expect } from '@playwright/experimental-ct-react';
import { Slider } from './slider';

test('Slider: range input and label', async ({ mount, page }) => {
  await mount(<Slider label="Level" min={0} max={100} value={40} onChange={() => {}} />);
  await expect(page.getByRole('slider')).toBeVisible();
  await expect(page.getByText('Level')).toBeVisible();
});
