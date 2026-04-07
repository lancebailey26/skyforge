import { test, expect } from '@playwright/experimental-ct-react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { WorkflowNode } from './node/node';
import { ProcessingNode } from './processing-node/processing-node';
import { Junction } from './junction/junction';

test('Workflow primitives: labels render', async ({ mount, page }) => {
  const a = await mount(
    <WorkflowNode id="n" label="Port" variant="input" enabled onToggle={() => {}} icon={faBolt} />,
  );
  await expect(page.getByText('Port')).toBeVisible();
  await a.unmount();

  const b = await mount(<ProcessingNode id="p" label="Step" variant="customized" />);
  await expect(page.getByText('Step')).toBeVisible();
  await b.unmount();

  await mount(<Junction id="j" inputCount={1} outputCount={2} />);
  await expect(page.getByText('1 in | 2 out')).toBeVisible();
});
