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

test('Crawler: noScroll renders one copy of each child', async ({ mount, page }) => {
  await mount(
    <Crawler noScroll orientation="horizontal" pauseOnHover={false}>
      <span>Alpha</span>
      <span>Beta</span>
    </Crawler>,
  );
  await expect(page.getByRole('region', { name: 'Content' })).toBeVisible();
  await expect(page.getByText('Alpha')).toHaveCount(1);
  await expect(page.getByText('Beta')).toHaveCount(1);
});

test('Crawler: noScrollAlign start anchors strip to the left', async ({ mount, page }) => {
  await mount(
    <Crawler noScroll noScrollAlign="start" orientation="horizontal" pauseOnHover={false}>
      <span>Alpha</span>
      <span>Beta</span>
    </Crawler>,
  );

  const track = page.locator('[class*="noScrollAlignStart"] [class*="track"]');
  await expect(track).toBeVisible();
  await expect(track).toHaveCSS('justify-content', 'flex-start');
});
