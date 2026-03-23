---
title: "Development Environment"
description: "Keycast Windows development environment setup guide"
author: "Keycast Team"
date: 2026-03-23
---

# Development Environment

Set up your development environment to build and run Keycast Windows.

## System Requirements

### Operating System

- **Windows 10** (version 1809 or higher)
- **Windows 11**

### Required Software

<BadgeList>
  <BadgeList.Badge variant="success">Node.js 18+</BadgeList.Badge>
  <BadgeList.Badge variant="success">pnpm 9+</BadgeList.Badge>
  <BadgeList.Badge variant="success">Rust 1.70+</BadgeList.Badge>
  <BadgeList.Badge variant="success">Git</BadgeList.Badge>
</BadgeList>

## Install Node.js

### Download and Install

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the installer

### Verify Installation

```bash
node --version
npm --version
```

## Install pnpm

### Install using npm

```bash
npm install -g pnpm
```

### Verify Installation

```bash
pnpm --version
```

## Install Rust

### Install using rustup

1. Visit [rustup.rs](https://rustup.rs/)
2. Download rustup-init.exe
3. Run the installer

### Verify Installation

```bash
rustc --version
cargo --version
```

<Alert type="info">
Rust first-time installation will download necessary components and may take a few minutes.
</Alert>

## Install Git

### Download and Install

1. Visit [git-scm.com](https://git-scm.com/)
2. Download the Windows version
3. Run the installer

### Verify Installation

```bash
git --version
```

## Clone Project

```bash
git clone https://github.com/shenjianZ/keycast-windows.git
cd keycast-windows
```

## Install Dependencies

### Frontend Dependencies

```bash
pnpm install
```

### Rust Dependencies

Rust dependencies will be built automatically, first run may take longer.

## Recommended IDE

### Zed

Recommended extensions:

<BadgeList>
  <BadgeList.Badge variant="info">rust-analyzer</BadgeList.Badge>
  <BadgeList.Badge variant="info">ESLint</BadgeList.Badge>
  <BadgeList.Badge variant="info">Prettier</BadgeList.Badge>
  <BadgeList.Badge variant="info">Tailwind CSS IntelliSense</BadgeList.Badge>
</BadgeList>


## Environment Variables

To test automatic updates, you need to inject the environment variable `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`

```powershell
pnpm tauri signer generate -w $HOME/.tauri/keycast-windows.key
```

- Mapping after generation:
  - `$HOME/.tauri/keycast-windows.key.pub` file content → `KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY`
  - `$HOME/.tauri/keycast-windows.key` file content → `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY`
  - Password entered when generating the private key → `KEYCAST_WINDOWS_TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Release will additionally upload `latest.json`, Windows `setup.exe` and corresponding `.exe.sig` files for in-app updates.

```powershell
[Environment]::SetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  (Get-Content $HOME\.tauri\keycast-windows.key.pub -Raw).Trim(),
  "User"
)
```

- Check if written successfully:

```powershell
[Environment]::GetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  "User"
)
```

- Delete the variable:

```powershell
[Environment]::SetEnvironmentVariable(
  "KEYCAST_WINDOWS_TAURI_UPDATER_PUBLIC_KEY",
  $null,
  "User"
)
```

- After setting or deleting, open a new terminal window before running `pnpm tauri dev`.

## Verify Environment

Run the following commands to verify environment configuration:

```bash
# Check Node.js
node --version

# Check pnpm
pnpm --version

# Check Rust
rustc --version
cargo --version

# Check Git
git --version
```

**Next Step**: Learn how to [run locally](docs/development/local-development) the project.
