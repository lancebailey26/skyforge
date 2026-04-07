import '../src/theme/tokens.css';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--color-bg)' },
        { name: 'dark', value: 'oklch(0.18 0.02 264)' },
      ],
    },
  },
};

export default preview;
