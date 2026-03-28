---
title: "构建打包"
description: "Keycast Windows 构建和发布指南"
author: "Keycast Team"
createdAt: 2026-03-23
---

# 构建打包

构建 Keycast Windows 的发布版本。

## 构建命令

### 完整构建

```bash
pnpm tauri build
```

这个命令会：
1. 创建优化后的生产构建
2. 编译 Rust 后端代码
3. 打包成安装程序
4. 生成可执行文件

### 构建输出

构建完成后，安装程序位于：
```
src-tauri/target/release/bundle/nsis/
```

文件名格式：
- `keycast-windows_0.1.4_x64-setup.exe` - 安装程序

## 构建选项

### 仅构建不打包

```bash
pnpm tauri build --no-bundle
```

只生成可执行文件，不创建安装程序。

### 指定目标平台

```bash
pnpm tauri build --target x86_64-pc-windows-msvc
```

## 代码检查

### 检查 Rust 代码

```bash
cd src-tauri
cargo check
```

### 运行测试

```bash
cd src-tauri
cargo test
```

### 代码格式化

```bash
cd src-tauri
cargo fmt
```

## 优化构建

### 减小体积

1. 启用 LTO（链接时优化）
2. 使用 `--release` 模式
3. 移除不必要的依赖

### 加快构建

1. 使用增量编译
2. 并行编译
3. 缓存依赖

## 版本发布

### 更新版本号

修改以下文件：

1. `package.json` - 前端版本
2. `src-tauri/Cargo.toml` - Rust 版本
3. `src-tauri/tauri.conf.json` - 应用版本

也可以使用 `pnpm version:sync versionNumber` 意见更新版本号

### 创建 Git 标签

```bash
git tag v0.1.4
git push origin v0.1.4
```

### GitHub Actions

配置 GitHub Actions 自动构建和发布，已经在 .github/workflows/build.yml 中配置

## 发布检查清单

<BadgeList>
  <BadgeList.Badge variant="success">更新版本号</BadgeList.Badge>
  <BadgeList.Badge variant="success">更新 CHANGELOG</BadgeList.Badge>
  <BadgeList.Badge variant="success">运行测试</BadgeList.Badge>
  <BadgeList.Badge variant="success">本地构建测试</BadgeList.Badge>
  <BadgeList.Badge variant="success">创建 Git 标签</BadgeList.Badge>
  <BadgeList.Badge variant="success">推送标签</BadgeList.Badge>
</BadgeList>

## 签名和公证

### Windows 代码签名

使用代码签名证书对应用程序进行签名：
注意该签名证书需要购买，200-500 $/年

```bash
signtool sign /f certificate.pfx /p password keycast-windows.exe
```

### SmartScreen 警告

首次发布的应用可能会被 Windows SmartScreen 警告，用户需要：
1. 点击"更多信息"
2. 选择"仍要运行"


**下一步**: 了解如何 [贡献](docs/development/contributing) 项目。
