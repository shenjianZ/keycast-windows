---
title: "项目介绍"
description: "Keycast Windows 项目概述"
author: "Keycast Team"
date: 2026-03-23
---

# 项目介绍

Keycast Windows 是一个使用现代技术栈构建的桌面应用，为 Windows 用户提供专业的按键屏显功能。

## 项目概述

Keycast Windows 采用前后端分离架构：
- **前端**: 使用 React 19 + TypeScript + Tailwind CSS 构建用户界面
- **后端**: 使用 Rust + Tauri 2 实现系统级功能
- **通信**: 通过 Tauri 的事件系统实现前后端通信

## 技术栈

### 前端技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS v4** - 原子化 CSS 框架
- **Radix UI** - 无头组件库
- **React Router DOM** - 路由管理
- **Vite** - 快速的构建工具

### 后端技术栈

- **Rust** - 系统级编程语言
- **Tauri 2** - 跨平台桌面应用框架
- **Windows API** - Windows 系统调用
- **serde** - 序列化/反序列化框架
- **chrono** - 时间处理库

### 系统依赖

- Tauri 插件系统
- Windows API (user32.dll)
- 系统托盘集成
- 全局快捷键注册

## 架构设计

### 前端架构

```
src/
├── lib/              # 工具库
│   ├── utils.ts      # 工具函数
│   ├── types.ts      # 类型定义
│   ├── native.ts     # Tauri API 封装
│   └── updater.ts    # 更新逻辑
├── components/       # UI 组件
│   └── ui/          # Radix UI 基础组件
├── pages/          # 页面组件
├── App.tsx         # 应用入口
└── main.tsx        # React 根组件
```

### 后端架构

```
src-tauri/src/
├── main.rs          # 应用入口
├── commands/        # Tauri 命令
│   ├── app_commands.rs
│   └── keycast_commands.rs
└── services/        # 业务逻辑
    ├── keycast_service.rs
    ├── app_settings_service.rs
    └── window_service.rs
```

## 核心模块

### 按键监听系统 (KeycastService)

- 使用 Windows API 监听全局按键
- 支持 6 种显示模式
- 高性能按键状态跟踪
- 内存管理和性能优化

### 配置管理系统

- 按键显示配置 (KeycastOverlayConfig)
- 应用设置管理 (AppSettingsService)
- 持久化存储
- 实时配置同步

### 用户界面

- 响应式设计
- 深色/浅色主题
- 国际化支持 (中英文)
- 无障碍功能

## 开发理念

### 设计原则

1. **简洁高效** - 轻量级设计，不影响系统性能
2. **用户友好** - 直观的界面，易于配置
3. **高度可定制** - 丰富的配置选项
4. **跨平台准备** - 使用 Tauri 为未来跨平台做准备

### 代码规范

- TypeScript 严格模式
- Rust 最佳实践
- 清晰的代码注释
- 模块化设计

## 版本历史

查看 [更新日志](https://github.com/shenjianZ/keycast-windows/releases) 了解详细版本历史。


**下一步**: 了解详细的 [技术栈](/docs/development/tech-stack) 信息。
