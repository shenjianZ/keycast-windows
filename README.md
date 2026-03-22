# Keycast Windows

Windows 桌面按键屏显工具。

## Features

- 全局按键监听
- 透明屏显窗口
- 主题、颜色、横线可配置
- 开机自启
- 中英文界面

## 技术栈

- Tauri 2
- React 19
- TypeScript
- pnpm
- Rust

## Bridge

- Frontend -> Rust: Tauri commands
- Rust -> Frontend: Tauri events
- 主窗口配置、按键状态、语言设置通过 bridge 同步

## Structure

- `src/`: React UI
- `src-tauri/`: Rust backend and Tauri config
- `src-tauri/icons/`: App icons
- `.github/workflows/`: CI build workflows

## Dev

```bash
pnpm install
pnpm tauri dev
```

## Build

```bash
pnpm tauri build
```

Windows 打包产物位于 `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/`。
