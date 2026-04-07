import { test, expect } from '@playwright/experimental-ct-react';
import { WorkflowBuilder } from './workflow';

/** Stable references — the CT host re-renders on state updates; fresh inline arrays/objects worsen unnecessary updates. */
const wfInputs = [
  { id: 'i1', label: 'In', onToggle: () => {}, enabled: true },
];
const wfOutputs = [{ id: 'o1', label: 'Out', enabled: true }];
const wfConnections = [{ from: 'i1', to: 'o1' }];
const wfStyle = { width: 800, height: 560 };

test('WorkflowBuilder: chrome and node labels', async ({ mount, page }) => {
  await mount(
    <WorkflowBuilder
      className="ct-workflow"
      style={wfStyle}
      title="CT Workflow"
      inputs={wfInputs}
      outputs={wfOutputs}
      connections={wfConnections}
    />,
  );
  await expect(page.getByRole('heading', { name: 'CT Workflow' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText('In', { exact: true })).toBeVisible({ timeout: 15_000 });
});
