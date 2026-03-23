---
title: "开发环境"
description: "Keycast Windows 开发环境配置指南"
author: "Keycast Team"
date: 2026-03-23
---

# 开发环境

配置你的开发环境以构建和运行 Keycast Windows。

## 系统要求

### 操作系统

- **Windows 10** (版本 1809 或更高)
- **Windows 11**

### 必需软件

<BadgeList>
  <BadgeList.Badge variant="success">Node.js 18+</BadgeList.Badge>
  <BadgeList.Badge variant="success">pnpm 9+</BadgeList.Badge>
  <BadgeList.Badge variant="success">Rust 1.70+</BadgeList.Badge>
  <BadgeList.Badge variant="success">Git</BadgeList.Badge>
</BadgeList>

## 安装 Node.js

### 下载和安装

1. 访问 [nodejs.org](https://nodejs.org/)
2. 下载 LTS 版本
3. 运行安装程序

### 验证安装

```bash
node --version
npm --version
```

## 安装 pnpm

### 使用 npm 安装

```bash
npm install -g pnpm
```

### 验证安装

```bash
pnpm --version
```

## 安装 Rust

### 使用 rustup 安装

1. 访问 [rustup.rs](https://rustup.rs/)
2. 下载 rustup-init.exe
3. 运行安装程序

### 验证安装

```bash
rustc --version
cargo --version
```

<Alert type="info">
Rust 首次安装会下载必要的组件，可能需要几分钟时间。
</Alert>

## 安装 Git

### 下载和安装

1. 访问 [git-scm.com](https://git-scm.com/)
2. 下载 Windows 版本
3. 运行安装程序

### 验证安装

```bash
git --version
```

## 克隆项目

```bash
git clone https://github.com/shenjianZ/keycast-windows.git
cd keycast-windows
```

## 安装依赖

### 前端依赖

```bash
pnpm install
```

### Rust 依赖

Rust 依赖会自动构建，首次运行可能需要较长时间。

## 推荐 IDE

### Zed

推荐的扩展：

<BadgeList>
  <BadgeList.Badge variant="info">rust-analyzer</BadgeList.Badge>
  <BadgeList.Badge variant="info">ESLint</BadgeList.Badge>
  <BadgeList.Badge variant="info">Prettier</BadgeList.Badge>
  <BadgeList.Badge variant="info">Tailwind CSS IntelliSense</BadgeList.Badge>
</BadgeList>


## 环境变量

如果需要测试自动更新，需要注入环境变量 `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`

```powershell
pnpm tauri signer generate -w $HOME/.tauri/keycast-windows.key
```

- 生成后对应关系：
  - `$HOME/.tauri/keycast-windows.key.pub` 文件内容 -> `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`
  - `$HOME/.tauri/keycast-windows.key` 文件内容 -> `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY`
  - 生成私钥时输入的密码 -> `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Release 会额外上传 `latest.json`、Windows `setup.exe` 和对应的 `.exe.sig` 文件，供应用内更新使用。

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

## 验证环境

运行以下命令验证环境配置：

```bash
# 检查 Node.js
node --version

# 检查 pnpm
pnpm --version

# 检查 Rust
rustc --version
cargo --version

# 检查 Git
git --version
```

**下一步**: 了解如何 [本地运行](docs/development/local-development) 项目。
