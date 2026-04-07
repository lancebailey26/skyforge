import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../button/button';
import { Tooltip } from './tooltip';

test('Tooltip: shows copy when defaultVisible', async ({ mount, page }) => {
  await mount(
    <Tooltip content="Helpful hint" defaultVisible>
      <Button text="Target" subColor="outline" />
    </Tooltip>,
  );
  await expect(page.getByText('Helpful hint')).toBeVisible();
});
