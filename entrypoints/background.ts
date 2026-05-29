export default defineBackground(() => {
  // Open the side panel when the toolbar icon is clicked. sidePanel is a
  // Chrome-only API not present on the webextension-polyfill `browser`.
  chrome.sidePanel
    ?.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.error('setPanelBehavior failed', err));
});
