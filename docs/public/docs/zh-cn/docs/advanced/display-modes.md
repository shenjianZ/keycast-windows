---
title: "显示模式详解"
description: "Keycast Windows 六种显示模式详细说明"
author: "Keycast Team"
date: 2026-03-23
---

# 显示模式详解

Keycast Windows 提供 6 种显示模式，每种模式都针对特定的使用场景优化。

## 模式对比表

<ConfigTable items={[
  {
    name: "仅组合键",
    description: "只显示包含修饰键的组合键",
    default: "combo-only",
    range: "快捷键演示"
  },
  {
    name: "仅单个按键",
    description: "只显示单个字母、数字、符号键",
    default: "single-only",
    range: "打字演示"
  },
  {
    name: "组合键优先",
    description: "优先显示组合键，无组合时显示单个按键",
    default: "combo-precedence",
    range: "通用场景"
  },
  {
    name: "所有按键连续",
    description: "显示所有按键，连续按键时滚动显示",
    default: "all-sequential",
    range: "快速操作"
  },
  {
    name: "所有按键队列",
    description: "显示所有按键，持久化直到超时",
    default: "all-sequential-persistent",
    range: "长时间记录"
  },
  {
    name: "智能混合",
    description: "根据按键节奏自动切换模式",
    default: "smart-mixed",
    range: "自适应场景"
  }
]} />

## 选择建议

<Callout variant="primary">
### 新手推荐

从 **"组合键优先"** 模式开始，配置简单，覆盖大多数场景。
</Callout>

<Callout variant="secondary">
### 软件教程/演示

使用 **"仅组合键"** 模式，突出快捷键操作。
</Callout>

<Callout variant="default">
### 打字教学/密码输入

使用 **"仅单个按键"** 模式，清晰展示输入内容。
</Callout>

<Callout variant="primary">
### 游戏/快速操作

使用 **"所有按键连续"** 模式，完整记录按键序列。
</Callout>

<Callout variant="error">
### 长时间操作记录

使用 **"所有按键队列"** 模式，持久化显示操作历史。
</Callout>

<Callout variant="success">
### 高级用户

使用 **"智能混合"** 模式，获得最佳自适应体验。
</Callout>

## 配置参数说明

<ConfigTable items={[
  {
    name: "组合窗口",
    description: "控制组合键合并显示的时间窗口",
    default: "500 ms",
    range: "300-800 ms"
  },
  {
    name: "最多显示按键数",
    description: "连续按键时最多显示的按键数量",
    default: "5",
    range: "3-20"
  },
  {
    name: "连续按键窗口",
    description: "智能混合模式下判定为连续按键的时间窗口",
    default: "400 ms",
    range: "200-800 ms"
  },
  {
    name: "队列空闲超时",
    description: "队列模式下清空按键的超时时间",
    default: "2000 ms",
    range: "200-5000 ms"
  },
  {
    name: "滚动方向",
    description: "连续按键超出最大数量时的滚动效果",
    default: "淡入淡出",
    range: "横向/纵向/淡入淡出"
  }
]} />

## 各模式详解

- [仅组合键模式](/docs/advanced/combo-only)
- [仅单个按键模式](/docs/advanced/single-only)
- [组合键优先模式](/docs/advanced/combo-precedence)
- [所有按键连续模式](/docs/advanced/all-sequential)
- [所有按键队列模式](/docs/advanced/all-sequential-persistent)
- [智能混合模式](/docs/advanced/smart-mixed)

<Callout variant="primary">
**下一步**: 了解 [主题系统](/docs/advanced/theme-system) 的详细信息。
</Callout>
