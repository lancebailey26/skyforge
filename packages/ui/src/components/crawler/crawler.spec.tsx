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

test('Crawler: scroll buttons advance one item', async ({ mount, page }) => {
  await page.setViewportSize({ width: 900, height: 480 });

  await mount(
    <Crawler orientation="horizontal" speed={0} draggable={false} pauseOnHover={false} gap="16px">
      <span style={{ display: 'inline-block', width: 220 }}>Alpha</span>
      <span style={{ display: 'inline-block', width: 220 }}>Beta</span>
      <span style={{ display: 'inline-block', width: 220 }}>Gamma</span>
    </Crawler>,
  );

  const track = page.locator('[class*="track"]').first();
  const readOffset = () =>
    track.evaluate((el) => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return Math.abs(matrix.m41);
    });

  const before = await readOffset();
  await page.getByRole('button', { name: 'Scroll back' }).click();

  await expect.poll(readOffset, { timeout: 1000 }).toBeGreaterThan(before + 200);

  const after = await readOffset();
  const delta = after - before;

  expect(delta).toBeGreaterThan(200);
  expect(delta).toBeLessThan(250);
});
