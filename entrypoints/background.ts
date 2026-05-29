import { runAutoSleep } from '@/src/services/auto-sleep';

const AUTO_SLEEP_ALARM = 'auto-sleep';

export default defineBackground(() => {
  // Open the side panel when the toolbar icon is clicked. sidePanel is a
  // Chrome-only API not present on the webextension-polyfill `browser`.
  chrome.sidePanel
    ?.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((err) => console.error('setPanelBehavior failed', err));

  // Drive the Auto-sleep engine on a one-minute alarm (survives SW unloads).
  chrome.alarms.create(AUTO_SLEEP_ALARM, { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === AUTO_SLEEP_ALARM) {
      runAutoSleep().catch((err) => console.error('auto-sleep failed', err));
    }
  });
});
