---
title: "Building"
description: "Keycast Windows build and release guide"
author: "Keycast Team"
date: 2026-03-23
---

# Building and Packaging

Build release versions of Keycast Windows.

## Build Commands

### Complete Build

```bash
pnpm tauri build
```

This command will:
1. Create an optimized production build
2. Compile Rust backend code
3. Package into an installer
4. Generate executable files

### Build Output

After building, the installer is located at:
```
src-tauri/target/release/bundle/nsis/
```

File name format:
- `keycast-windows_0.1.4_x64-setup.exe` - Installer

## Build Options

### Build Without Bundling

```bash
pnpm tauri build --no-bundle
```

Only generates executable files, does not create an installer.

### Specify Target Platform

```bash
pnpm tauri build --target x86_64-pc-windows-msvc
```

## Code Checking

### Check Rust Code

```bash
cd src-tauri
cargo check
```

### Run Tests

```bash
cd src-tauri
cargo test
```

### Code Formatting

```bash
cd src-tauri
cargo fmt
```

## Optimize Build

### Reduce Size

1. Enable LTO (Link Time Optimization)
2. Use `--release` mode
3. Remove unnecessary dependencies

### Speed Up Build

1. Use incremental compilation
2. Parallel compilation
3. Cache dependencies

## Version Release

### Update Version Number

Modify the following files:

1. `package.json` - Frontend version
2. `src-tauri/Cargo.toml` - Rust version
3. `src-tauri/tauri.conf.json` - Application version

You can also use `pnpm version:sync versionNumber` to update version numbers

### Create Git Tag

```bash
git tag v0.1.4
git push origin v0.1.4
```

### GitHub Actions

Configure GitHub Actions for automatic build and release, already configured in .github/workflows/build.yml

## Release Checklist

<BadgeList>
  <BadgeList.Badge variant="success">Update version number</BadgeList.Badge>
  <BadgeList.Badge variant="success">Update CHANGELOG</BadgeList.Badge>
  <BadgeList.Badge variant="success">Run tests</BadgeList.Badge>
  <BadgeList.Badge variant="success">Local build test</BadgeList.Badge>
  <BadgeList.Badge variant="success">Create Git tag</BadgeList.Badge>
  <BadgeList.Badge variant="success">Push tag</BadgeList.Badge>
</BadgeList>

## Signing and Notarization

### Windows Code Signing

Sign the application with a code signing certificate:
Note that this signing certificate requires purchase, $200-500/year

```bash
signtool sign /f certificate.pfx /p password keycast-windows.exe
```

### SmartScreen Warning

First-time released applications may be warned by Windows SmartScreen, users need to:
1. Click "More info"
2. Select "Run anyway"


**Next Step**: Learn how to [contribute](docs/development/contributing) to the project.
