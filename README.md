# Stow

[English](#english) · [中文](#中文)

---

<a name="english"></a>

A Chrome side-panel tab manager built on two reversible verbs: **Sleep** and **Stash**.

Stow lives in the browser's side panel. Open it while mid-task, thin out the noise, and bring tabs back whenever you need them. Nothing is ever lost.

## How it works

**Sleep** discards a tab from memory while leaving it in the tab strip. The window gets lighter; the tab is still there, reloading automatically when you click it.

**Stash** closes a tab and saves its metadata (URL, title, favicon) to the extension's local storage. The tab leaves the tab strip entirely and reappears in the Stash region, one click from return.

Both operations are reversible. Every destructive action has an undo toast.

## Features

- **Sleep** — free tab memory without losing the tab's place in the strip
- **Stash** — clear tabs into a saved list and restore them on demand
- **Pop restore / Copy restore** — restore a stash entry and remove it, or restore while keeping it
- **Keep-awake lock** — prevent a tab from being slept by any path (session-scoped; cleared on restart)
- **Auto-sleep** — background rule that sleeps tabs idle longer than a configured threshold; exempts pinned, audible, and locked tabs, plus any domain on the exclusion list
- **Bulk actions** — "Sleep others" and "Stash others" buttons act on the whole window at once
- **Drag-and-drop reorder** — reorder stash entries or move tabs between regions by dragging
- **Undo toast** — 8-second undo window after every Close or Delete; single-slot, so a new action commits the previous one

## Development

**Requirements**: Node.js ≥ 18, pnpm (or npm)

```bash
# Install dependencies
pnpm install

# Start dev server (hot-reloads into Chrome)
pnpm dev

# Type-check
pnpm compile

# Run tests
pnpm test

# Build for production
pnpm build

# Package as .zip for the Chrome Web Store
pnpm zip
```

### Loading the extension in Chrome

1. Run `pnpm dev` — WXT writes the built extension to `.output/chrome-mv3-dev/`
2. Open `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked** and select the `.output/chrome-mv3-dev/` directory
4. Open the side panel from the Chrome toolbar

## Architecture

```
src/
  domain/      # Pure business logic — no Chrome APIs (sleep policy, stash list ops)
  services/    # Chrome API adapters and orchestration (tabs, auto-sleep, bulk actions)
  storage/     # chrome.storage wrappers and reactive live-value observers
  lock/        # Keep-awake lock registry (session storage)
entrypoints/
  background.ts      # Service worker — initialises side panel, schedules auto-sleep
  sidepanel/         # React side-panel UI
  options/           # Settings page (idle timeout, excluded domains)
docs/
  adr/               # Architecture decision records
```

The domain layer has no dependency on Chrome APIs and is fully unit-tested. The services layer adapts and orchestrates; UI hooks subscribe to live storage values and re-render on change.

## Permissions

| Permission  | Why |
|-------------|-----|
| `tabs`      | Query, activate, close, and discard tabs |
| `storage`   | Persist stash entries and settings |
| `sidePanel` | Register and control the side-panel surface |
| `alarms`    | Run the auto-sleep engine on a per-minute schedule |

All data is stored locally (`chrome.storage.local`). Nothing is synced to the cloud or sent to any server.

## Tech stack

- [WXT](https://wxt.dev) — Chrome extension framework (Vite-based)
- React 19 + TypeScript
- [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/) — drag-and-drop
- CSS Modules — scoped component styles
- Vitest — unit tests

---

<a name="中文"></a>

# Stow（中文）

一个 Chrome 侧边栏标签页管理器，以两个可撤销的操作为核心：**休眠（Sleep）** 与 **暂存（Stash）**。

Stow 常驻浏览器侧边栏，随时可以在工作途中打开，清理当前窗口的干扰，需要时随时取回标签页。任何内容都不会丢失。

## 工作原理

**休眠（Sleep）** 将标签页从内存中释放，但保留其在标签栏的位置。窗口变得更轻，标签页仍在那里，点击后自动重新加载。

**暂存（Stash）** 关闭标签页，并将其元数据（URL、标题、favicon）保存到扩展的本地存储中。标签页从标签栏完全消失，以暂存条目的形式出现在 Stash 区域，一键即可恢复。

两种操作均可撤销。每个破坏性操作都有撤销提示。

## 功能列表

- **休眠（Sleep）** — 释放标签页内存，同时保留其在标签栏的位置
- **暂存（Stash）** — 将标签页收入暂存列表，按需恢复
- **弹出式恢复 / 复制式恢复** — 恢复并移除暂存条目，或恢复同时保留条目
- **禁止休眠锁（Keep-awake lock）** — 防止指定标签页被任何途径休眠（仅限当前会话，重启后清除）
- **自动休眠（Auto-sleep）** — 后台规则，将空闲超过设定时长的标签页自动休眠；固定标签页、正在播放音频的标签页、被锁定的标签页，以及排除域名列表中的标签页均不受影响
- **批量操作** — 工具栏中的「Sleep others」和「Stash others」按钮，一键处理整个窗口
- **拖放排序** — 拖动暂存条目重新排序，或将标签页在两个区域间移动
- **撤销提示（Undo toast）** — 关闭或删除操作后提供 8 秒的撤销窗口，单槽位设计，新操作会提交上一个操作

## 开发

**环境要求**：Node.js ≥ 18，pnpm（或 npm）

```bash
# 安装依赖
pnpm install

# 启动开发服务器（自动热更新到 Chrome）
pnpm dev

# 类型检查
pnpm compile

# 运行测试
pnpm test

# 生产构建
pnpm build

# 打包为 .zip（用于 Chrome 网上应用店）
pnpm zip
```

### 在 Chrome 中加载扩展

1. 运行 `pnpm dev` — WXT 会将构建产物输出到 `.output/chrome-mv3-dev/`
2. 打开 `chrome://extensions`，启用**开发者模式**
3. 点击**加载已解压的扩展程序**，选择 `.output/chrome-mv3-dev/` 目录
4. 从 Chrome 工具栏打开侧边栏

## 架构

```
src/
  domain/      # 纯业务逻辑，不依赖 Chrome API（休眠策略、暂存列表操作）
  services/    # Chrome API 适配与编排（标签页、自动休眠、批量操作）
  storage/     # chrome.storage 封装与响应式实时观察者
  lock/        # 禁止休眠锁注册表（会话存储）
entrypoints/
  background.ts      # Service Worker — 初始化侧边栏，调度自动休眠
  sidepanel/         # React 侧边栏 UI
  options/           # 设置页面（空闲超时、排除域名列表）
docs/
  adr/               # 架构决策记录
```

domain 层不依赖任何 Chrome API，拥有完整的单元测试覆盖。services 层负责适配与编排；UI hooks 订阅实时存储值，在数据变化时自动重新渲染。

## 权限说明

| 权限        | 用途 |
|-------------|------|
| `tabs`      | 查询、激活、关闭和休眠标签页 |
| `storage`   | 持久化暂存条目与设置 |
| `sidePanel` | 注册和控制侧边栏面板 |
| `alarms`    | 按分钟调度自动休眠引擎 |

所有数据仅存储在本地（`chrome.storage.local`），不同步至云端，不上传至任何服务器。

## 技术栈

- [WXT](https://wxt.dev) — Chrome 扩展框架（基于 Vite）
- React 19 + TypeScript
- [Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/) — 拖放功能
- CSS Modules — 组件样式隔离
- Vitest — 单元测试
