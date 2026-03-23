---
title: "项目结构"
description: "Keycast Windows 项目目录结构说明"
author: "Keycast Team"
date: 2026-03-23
---

# 项目结构

Keycast Windows 采用清晰的模块化结构，便于开发和维护。

## 目录结构

```
keycast-windows/
├── src/                    # React 前端源码
│   ├── lib/               # 工具库
│   ├── components/        # UI 组件
│   ├── pages/            # 页面组件
│   ├── App.tsx           # 应用入口
│   └── main.tsx          # React 根组件
├── src-tauri/            # Tauri 后端源码
│   ├── src/              # Rust 源码
│   │   ├── main.rs       # 入口文件
│   │   ├── commands/     # Tauri 命令
│   │   └── services/    # 业务逻辑
│   ├── Cargo.toml        # Rust 依赖配置
│   └── tauri.conf.json   # Tauri 应用配置
├── docs/                 # 文档网站
│   ├── public/           # 文档内容
│   ├── src/              # 文档源码
│   └── package.json      # 文档依赖
├── keycast.html          # 按键屏显窗口
└── package.json         # 前端依赖配置
```

## 前端结构

### lib/ 目录

```
lib/
├── utils.ts              # 工具函数
├── types.ts              # TypeScript 类型定义
├── native.ts             # Tauri API 封装
└── updater.ts            # 更新逻辑
```

- **utils.ts** - 通用工具函数
- **types.ts** - 全局类型定义
- **native.ts** - Tauri invoke API 封装
- **updater.ts** - 自动更新状态管理

### components/ 目录

```
components/
├── ui/                   # Radix UI 基础组件
├── AppShell.tsx         # 应用框架
├── SettingsGroup.tsx    # 设置分组组件
└── [其他组件...]
```

### pages/ 目录

```
pages/
├── SettingsPage.tsx     # 设置页面
└── AboutPage.tsx        # 关于页面
```

## 后端结构

### src/ 目录

```
src/
├── main.rs              # 应用入口
├── commands/            # Tauri 命令
│   ├── app_commands.rs         # 应用设置命令
│   └── keycast_commands.rs     # 按键监听命令
└── services/            # 业务逻辑服务
    ├── keycast_service.rs      # 按键监听核心
    ├── app_settings_service.rs # 应用设置管理
    └── window_service.rs       # 窗口和托盘管理
```

### 配置文件

- **Cargo.toml** - Rust 依赖和包配置
- **tauri.conf.json** - Tauri 应用配置（窗口、插件等）
- **build.rs** - 构建脚本（如果需要）

## 文档结构

```
docs/
├── public/
│   ├── config/          # 配置文件
│   └── docs/           # 文档内容
├── src/
│   └── components/     # 自定义 MDX 组件
└── package.json        # 文档依赖
```

## 文件命名约定

### React 组件

- PascalCase: `SettingsPage.tsx`, `AppShell.tsx`
- 组件文件与组件名一致

### Rust 模块

- snake_case: `keycast_service.rs`, `app_commands.rs`
- 模块文件与模块名一致

### 文档文件

- kebab-case: `display-modes.md`, `tech-stack.md`
- 使用小写字母和连字符

**下一步**: 了解 [开发环境](docs/development/development-environment) 配置。
