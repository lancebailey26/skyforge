import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './button';

test('Button: click and submit shape', async ({ mount, page }) => {
  let clicked = false;
  const first = await mount(<Button text="Submit" onClick={() => { clicked = true; }} />);
  const primary = page.getByRole('button', { name: 'Submit' });
  await expect(primary).toBeVisible();
  await primary.click();
  expect(clicked).toBeTruthy();
  await first.unmount();

  await mount(<Button text="Go" attributes={{ type: 'submit' }} />);
  await expect(page.getByRole('button', { name: 'Go' })).toBeEnabled();
});