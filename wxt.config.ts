import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'TabSwap',
    description: 'Sidebar tab manager: Sleep and Stash tabs.',
    permissions: ['tabs', 'storage', 'sidePanel'],
    action: {},
    side_panel: {
      default_path: 'sidepanel.html',
    },
  },
});
