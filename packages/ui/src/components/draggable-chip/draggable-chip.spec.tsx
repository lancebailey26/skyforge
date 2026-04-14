import { test, expect } from '@playwright/experimental-ct-react';
import { DraggableChip } from './draggable-chip';

test('DraggableChip: text shows', async ({ mount, page }) => {
  await mount(<DraggableChip text="Pipeline stage" />);
  await expect(page.getByText('Pipeline stage')).toBeVisible();
});

test('DraggableChip: id, draggable, and inline style pass through', async ({ mount, page }) => {
  await mount(
    <DraggableChip
      text="Block"
      id="node-a"
      draggable
      style={{ border: '3px solid crimson', backgroundColor: 'mistyrose' }}
    />,
  );
  const el = page.locator('#node-a');
  await expect(el).toBeVisible();
  await expect(el).toHaveAttribute('draggable', 'true');
  await expect(el).toHaveCSS('border-top-width', '3px');
});
