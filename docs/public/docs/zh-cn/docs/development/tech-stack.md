---
title: "技术栈"
description: "Keycast Windows 使用的技术栈介绍"
author: "Keycast Team"
createdAt: 2026-03-23
---

# 技术栈

Keycast Windows 采用现代化的技术栈，为用户提供稳定高效的桌面应用体验。

## 前端技术栈

### 核心框架

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具

### UI 组件

- **Radix UI** - 无头组件库，提供可访问的 UI 原语
- **Tailwind CSS v4** - 原子化 CSS 框架
- **Lucide React** - 精美的图标库

### 路由和状态

- **React Router DOM v7** - 客户端路由
- **React Hooks** - 状态管理和副作用处理

## 后端技术栈

### 核心技术

- **Rust** - 系统级编程语言，提供内存安全和性能
- **Tauri 2** - 跨平台桌面应用框架

### Windows 集成

- **Windows API** - 通过 winapi crate 调用系统 API
- **GetAsyncKeyState** - 全局按键监听

### 数据处理

- **serde** - 序列化/反序列化框架
- **chrono** - 日期和时间处理

## Tauri 插件

### 官方插件

- **tauri-plugin-opener** - 打开外部链接
- **tauri-plugin-autostart** - 开机自启管理
- **tauri-plugin-global-shortcut** - 全局快捷键
- **tauri-plugin-updater** - 自动更新系统

## 开发工具

### 包管理器

- **pnpm** - 快速、节省磁盘空间的包管理器

### 代码质量

- **TypeScript strict mode** - 严格类型检查
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

## 架构特点

### 前后端分离

- 前端：React + TypeScript 运行在 WebView 中
- 后端：Rust 处理系统级操作
- 通信：通过 Tauri 的事件系统进行前后端通信

### 类型安全

- 前后端共享 TypeScript 类型定义
- Rust 的类型系统确保后端安全性
- Tauri 自动生成类型安全的 API 绑定

### 性能优化

- Rust 零成本抽象
- 最小化打包体积
- 快速启动和响应


**下一步**: 了解 [项目结构](docs/development/project-structure)。
