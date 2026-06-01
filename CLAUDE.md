# Stow — AI 助手指南

> 本文件面向 AI 助手（Claude 等），描述项目结构、开发工作流与核心约定。
> **修改 UI 前必须先阅读 [`PRODUCT.md`](PRODUCT.md) 和 [`DESIGN.md`](DESIGN.md)。**
> **熟悉术语前先阅读 [`CONTEXT.md`](CONTEXT.md)。**

---

## 项目简介

**Stow** 是一个 Chrome 浏览器扩展（Manifest V3），以侧边栏（Side Panel）形式提供标签页管理。核心有两个动作：

| 动作 | 英文 | 含义 |
|------|------|------|
| 休眠 | Sleep | 调用 `chrome.tabs.discard()` 释放标签页内存，标签仍留在标签栏 |
| 存档 | Stash | 将标签页元数据持久化到扩展存储后关闭，可随时恢复 |

品牌基调：**冷静、整洁、有序**，每个操作都可撤销。注册词（Register）为 `product`（中性、工具性）。

---

## 代码库结构

```
Stow/
├── entrypoints/          # Chrome 扩展入口点（UI 层，可访问 chrome.* API）
│   ├── background.ts     # Service Worker：定时器、自动休眠驱动
│   ├── sidepanel/        # 主侧边栏 UI（React）
│   │   ├── App.tsx       # 根组件
│   │   ├── components/   # UI 组件
│   │   ├── hooks/        # 自定义 React Hooks
│   │   ├── dnd/          # 拖拽原语（Pragmatic DnD）
│   │   └── undo/         # 撤销状态管理
│   └── options/          # 设置页面 UI
├── src/                  # 核心业务逻辑（不可访问 chrome.* API，可单元测试）
│   ├── domain/           # 纯领域模型与算法
│   │   ├── sleep-policy.ts   # 自动休眠策略（超时规则、排除域名）
│   │   └── stash.ts          # 存档条目操作与排序
│   ├── lock/             # Keep-awake 锁（内存中，会话级）
│   ├── storage/          # chrome.storage.local 抽象层
│   │   ├── storage.ts    # stashStore、settingsStore
│   │   └── live-value.ts # 响应式 Store 包装器
│   ├── services/         # 业务服务（使用 Chrome API）
│   │   ├── auto-sleep.ts     # 后台自动休眠引擎
│   │   ├── bulk-actions.ts   # 批量操作（全部休眠/存档）
│   │   ├── stash-actions.ts  # 单条目存档操作
│   │   └── tabs.ts           # 标签页状态查询
│   └── test/
│       └── setup.ts      # Vitest 全局配置（fake-browser mock）
├── docs/
│   ├── adr/              # 架构决策记录（ADR）
│   ├── agents/           # AI 助手指导文档
│   └── prd-stow.md       # 完整产品需求文档
├── CLAUDE.md             # 本文件
├── CONTEXT.md            # 术语表（中英文）
├── PRODUCT.md            # 品牌、用户、设计原则
├── DESIGN.md             # 视觉系统（配色、排版、组件）
├── wxt.config.ts         # WXT 扩展配置（Manifest 生成）
├── tsconfig.json         # TypeScript 配置
├── vitest.config.ts      # 测试配置
└── package.json          # 依赖与脚本
```

---

## 技术栈

| 类别 | 选型 | 版本 |
|------|------|------|
| 语言 | TypeScript | 5.7 |
| 扩展框架 | WXT | 0.19 |
| UI 框架 | React + React DOM | 19 |
| 样式 | CSS Modules | — |
| 拖拽 | Pragmatic drag-and-drop (Atlassian) | 1.5 |
| 图标 | lucide-react | 1.17 |
| 测试 | Vitest | 2.1 |
| Chrome API Mock | @webext-core/fake-browser | 1.3.2 |

**WXT** 负责处理 Manifest V3 自动生成、多入口点配置与热重载（HMR）。

**Pragmatic DnD** 而非 dnd-kit 的原因：提交即放下（commit-on-drop）行为，支持 Open ⇄ Stash 跨区域移动。见 `docs/adr/0003-frontend-build-stack.md`。

---

## 开发工作流

### 常用命令

```bash
npm run dev          # 启动开发服务器（WXT + HMR）
npm run build        # 生产构建 → .output/
npm run zip          # 打包 .zip 用于 Chrome Web Store 发布
npm run test         # 单次测试（vitest run）
npm run test:watch   # 监听模式测试（vitest）
npm run compile      # 类型检查（tsc --noEmit，不输出文件）
```

### 开发流程

1. `npm run dev` 启动后在 Chrome 加载 `.output/chrome-mv3/`（开发版）
2. 修改 `src/` 中的业务逻辑需要配套单元测试
3. 修改 UI 时先读 `PRODUCT.md` + `DESIGN.md` 确认设计约束
4. 所有测试通过后再提交：`npm run test && npm run compile`

### CI/CD

- **`.github/workflows/release.yml`**：打 `v*` tag 时自动触发
  1. `npm ci` 安装依赖
  2. `npm run zip` 打包
  3. 上传到 GitHub Release（自动生成 Release Notes）

---

## 架构约定

### 分层原则

```
chrome.* API 限制层
├── entrypoints/   ← 可自由使用 chrome.* API
│   ├── background.ts
│   └── sidepanel/、options/
│
└── src/           ← 禁止直接使用 chrome.* API（仅通过注入/参数传入）
    ├── domain/    ← 纯函数，无副作用，最易测试
    ├── storage/   ← 通过 fake-browser mock 测试
    └── services/  ← 业务服务，组合 domain + storage
```

- `src/domain/` 只包含纯计算逻辑，无任何 I/O
- `src/storage/` 封装 `chrome.storage.local`，不直接散落在组件里
- `src/services/` 调用 Chrome API，可组合使用 domain 和 storage
- `entrypoints/` 的 hooks 消费 storage store，不直接操作 Chrome API

### 状态管理

- `liveValue()` — 轻量响应式 Store（类 Zustand），位于 `src/storage/live-value.ts`
- `stashStore` — 存档条目的响应式存储（按 `order` 自动排序）
- `settingsStore` — 用户设置（idleMinutes、excludedDomains、stashCollapsed）
- `undoStore` — 撤销栈（单槽，Toast 展示）
- Keep-awake 锁 — 内存中，重启即清除（见 ADR-0002）

### 数据持久化

- **全部使用 `chrome.storage.local`**，不使用 `chrome.storage.sync`
- 原因：sync 有配额限制，跨设备同步需求已被明确拒绝（见 ADR-0001）

---

## 测试约定

- 测试文件与源文件**同目录同名**，后缀 `.test.ts`，例如：
  - `src/domain/stash.ts` → `src/domain/stash.test.ts`
- 测试框架：Vitest，`src/test/setup.ts` 全局注入 fake-browser
- **只测试 `src/` 中的代码**（`entrypoints/` 的 UI 组件不做单元测试）
- 使用 `@webext-core/fake-browser` mock `chrome.*` API，不要手动 mock
- 每个新增的业务逻辑函数都应有对应测试

---

## 组件结构（侧边栏）

```
App
├── Toolbar          ← 批量操作按钮（全部休眠、全部存档）+ 设置齿轮
├── OpenRegion       ← 当前窗口的标签页列表
│   └── TabRow[]     ← 单行：favicon、标题、状态徽章、4 个操作按钮
├── StashRegion      ← 存档条目列表（可折叠）
│   └── StashEntryRow[] ← 单行：favicon、标题、恢复/复制/删除
└── UndoToast        ← 浮动撤销提示（单槽，关闭/删除后显示）
```

**拖拽**：Open ⇄ Stash 跨区域移动，区域内重新排序。
使用 `useListItemDnd()`（每行）、`useRegionDropTarget()`（区域）、`useDropMonitor()`（全局）。

---

## 设计约束（必读）

详见 [`DESIGN.md`](DESIGN.md)，修改 UI 前必须遵守：

- **One Blue Rule**：整个 UI 只有一种蓝色 `#4c9aff`（signal-blue），用于主要交互焦点
- **Coral-On-Hover-Only Rule**：警告红 `#ff6b6b` 仅在 hover 删除/关闭类操作时出现，不作常驻颜色
- **System-Native Rule**：不使用 Web 字体，仅 `system-ui`
- **Rem-Sized Rule**：字体大小用 `rem`，不用 `px`
- **扁平优先**：默认无阴影无渐变，按状态变化驱动视觉
- **不加装饰性动画**：只允许状态驱动的过渡效果

配色：
- 背景：`#1e1e1e`（charcoal）
- 面板：`#2a2a2a`（slate-panel）
- 主色调：`#4c9aff`（signal-blue）
- 危险：`#ff6b6b`（warning-coral，hover-only）

---

## 关键术语（中英对照）

完整术语表见 [`CONTEXT.md`](CONTEXT.md)，以下是常用核心词：

| 中文 | 英文 | 说明 |
|------|------|------|
| 标签页 | Tab | 浏览器标签 |
| 休眠 | Sleep | 释放内存，标签留在栏中 |
| 存档 | Stash | 持久化后关闭 |
| 唤醒 | Wake | Sleep 的逆操作（不常用） |
| 打开区域 | Open region | 当前窗口标签列表 |
| 存档区域 | Stash region | 存档条目列表 |
| 弹出恢复 | Pop restore | 从存档恢复并移除条目 |
| 复制恢复 | Copy restore | 从存档恢复但保留条目 |
| 自动休眠 | Auto-sleep | 定时自动休眠空闲标签 |
| 保持唤醒锁 | Keep-awake lock | 防止某标签被自动休眠 |
| 撤销提示 | Undo toast | 操作后浮现的撤销通知 |

**重要**：Chrome API 的 `discard` 仅指 `chrome.tabs.discard()` 方法，用户可见动作统一称 **Sleep**，不要混用。

---

## 架构决策记录（ADR）

| ADR | 决策 |
|-----|------|
| [ADR-0001](docs/adr/0001-local-only-storage.md) | 只用 `chrome.storage.local`，拒绝 sync |
| [ADR-0002](docs/adr/0002-session-only-keep-awake-lock.md) | Keep-awake 锁只在内存中，重启清除 |
| [ADR-0003](docs/adr/0003-frontend-build-stack.md) | 选型 WXT + React + Pragmatic DnD |
| [ADR-0004](docs/adr/0004-undo-close-reopens-url.md) | 撤销关闭只重新打开 URL，不恢复 session |

---

## Agent 技能

### Issue 追踪

Issues 在 GitHub Issues 中管理。详见 [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md)。

### 分诊标签

默认标签词汇（needs-triage、needs-info、ready-for-agent、ready-for-human、wontfix）。详见 [`docs/agents/triage-labels.md`](docs/agents/triage-labels.md)。

### 领域文档

单一上下文仓库 — 根目录一个 `CONTEXT.md` + `docs/adr/`。详见 [`docs/agents/domain.md`](docs/agents/domain.md)。

---

## 设计上下文

战略设计上下文在 [`PRODUCT.md`](PRODUCT.md)（注册词、用户、品牌个性、反参考、设计原则），视觉系统在 [`DESIGN.md`](DESIGN.md)（色板、排版、组件）。**修改 UI 前必须同时阅读两者。** 注册词为 `product`；核心感受是冷静整洁，每个操作可撤销。
