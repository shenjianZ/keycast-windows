---
title: "配置入门"
description: "Keycast Windows 基础配置指南"
author: "Keycast Team"
createdAt: 2026-03-23
---

# 配置入门

> 点击主窗口的左侧的**设置** ，切换到设置界面

## 样式配置

1. 选择主题
    在 **主题** 下拉菜单中选择预置主题。

    **推荐**: 录屏场景推荐使用 `text-only` 或 `minimal-light` 主题，保持简洁清晰。

2. 自定义颜色
    
    1. 点击 **"文字颜色"** 色块，选择自定义颜色
    2. 启用 **"显示线条"**，可以显示强调线条
    3. 点击 **"线条颜色"** 色块可以输入16进制颜色代码（如 `#FF5733`）

### 调整位置

拖动 **X** 和 **Y** 滑块调整屏显窗口位置：

- **X**: 水平位置（0 = 屏幕左侧，数值越大越靠右）
- **Y**: 垂直位置（0 = 屏幕顶部，数值越大越靠下）

可以在启用按键监听后，实时预览位置调整效果。


## 显示模式配置

### 选择显示模式

<Callout variant="primary">
    推荐从组合键优先模式开始，这个模式适合大多数使用场景。
</Callout>

在 **显示模式** 下拉菜单中选择：

<BadgeList>
  <BadgeList.Badge variant="primary">仅组合键</BadgeList.Badge>
  <BadgeList.Badge variant="primary">仅单个按键</BadgeList.Badge>
  <BadgeList.Badge variant="primary">组合键优先</BadgeList.Badge>
  <BadgeList.Badge variant="success">所有按键连续</BadgeList.Badge>
  <BadgeList.Badge variant="success">所有按键队列</BadgeList.Badge>
  <BadgeList.Badge variant="success">智能混合</BadgeList.Badge>
</BadgeList>


### 调整组合窗口

**"组合窗口"** 参数控制多长时间内的按键会被合并为组合键：

- 默认值：`500 ms`
- 推荐范围：`300-800 ms`
- **设置过小**: 可能将快速按下的组合键拆分开
- **设置过大**: 可能将独立的按键错误合并

## 系统配置

### 开机自启

启用 **开机自启** 选项，应用会在Windows登录时自动启动：

<Alert type="success">
关闭主窗口后，应用仍会驻留在系统托盘中，可通过托盘图标重新打开主窗口。
</Alert>

### 语言切换

在 **"语言"** 下拉菜单中选择：

- **跟随系统** - 自动根据系统语言切换
- **简体中文** - 强制使用中文界面
- **English** - 强制使用英文界面


**下一步**: 查看 [用户指南](/docs/user-guide/overview) 了解更多配置选项。
