import { beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

// Reset the in-memory fake browser (storage, tabs, listeners) before each test
// so cases stay isolated.
beforeEach(() => {
  fakeBrowser.reset();
});
