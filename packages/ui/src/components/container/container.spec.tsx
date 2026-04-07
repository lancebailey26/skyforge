import { test, expect } from '@playwright/experimental-ct-react';
import { Container } from './container';

test('Container: renders child text', async ({ mount, page }) => {
  await mount(
    <Container size="small" padding="md">
      <p>Inside the box</p>
    </Container>,
  );
  await expect(page.getByText('Inside the box')).toBeVisible();
});
