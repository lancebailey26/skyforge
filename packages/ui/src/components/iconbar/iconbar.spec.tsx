import { test, expect } from '@playwright/experimental-ct-react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { IconBar } from './iconbar';

test('IconBar: social link names', async ({ mount, page }) => {
  await mount(
    <IconBar
      icons={[{ icon: faGithub, href: 'https://github.com/example', ariaLabel: 'GitHub profile' }]}
    />,
  );
  await expect(page.getByRole('link', { name: 'GitHub profile' })).toBeVisible();
});
