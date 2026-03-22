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

## Updater

- 应用启动后会静默检查更新，有新版本时会在应用内自动下载更新包。
- 设置页支持手动检查、手动下载和安装更新。
- 运行时实际读取的公钥环境变量是 `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`。
- Tauri CLI 在构建更新包时固定读取：
  - `TAURI_SIGNING_PRIVATE_KEY`
  - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- GitHub Actions 中需要配置这些 repository secrets：
  - `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`
  - `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY`
  - `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- workflow 会这样映射：
  - `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY` -> 应用运行时公钥
  - `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY` -> `TAURI_SIGNING_PRIVATE_KEY`
  - `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY_PASSWORD` -> `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- 本地开发通常只在需要验证 updater 时注入：
  - `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`
- Windows 开发环境可通过 PowerShell 写入当前用户环境变量：

```powershell
[Environment]::SetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  (Get-Content $HOME\.tauri\keycast-windows.key.pub -Raw).Trim(),
  "User"
)
```

- 查看是否写入成功：

```powershell
[Environment]::GetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  "User"
)
```

- 删除该变量：

```powershell
[Environment]::SetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  $null,
  "User"
)
```

- 设置或删除后，重新打开一个新的终端窗口再执行 `pnpm tauri dev`。
- 本地构建带签名的更新包时需要再额外注入：
  - `TAURI_SIGNING_PRIVATE_KEY`
  - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- 本地生成密钥：

```powershell
pnpm tauri signer generate -w $HOME/.tauri/keycast-windows.key
```

- 生成后对应关系：
  - `$HOME/.tauri/keycast-windows.key.pub` 文件内容 -> `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`
  - `$HOME/.tauri/keycast-windows.key` 文件内容 -> `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY`
  - 生成私钥时输入的密码 -> `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Release 会额外上传 `latest.json`、`*-updater.zip` 和对应 `.sig` 文件，供应用内更新使用。
