---
title: "System Settings"
description: "Keycast Windows system settings description"
author: "Keycast Team"
date: 2026-03-23
---

# System Settings

Configure application behavior and system integration options.

## Auto-start on Boot

### Feature Description

When enabled, Keycast Windows will automatically start when the system logs in.

### How to Configure

In the **Startup** section of the settings page:

1. Check the **Auto-start on Boot** option

<Alert type="success">
After enabling auto-start, the application will run in the background and can be accessed through the system tray icon.
</Alert>

### Tray Integration

Auto-start works with tray mode:
- Application minimizes to system tray after startup
- Does not take up taskbar space
- Control application through tray icon

## Language Settings

### Supported Languages

- **Simplified Chinese** (zh-CN)
- **English** (en-US)
- **Follow System** - Automatically switches based on system language

### How to Switch

In the **Language** section of the settings page:

1. Click the **Language** dropdown menu
2. Select your desired language


<Alert type="success">
Language switching takes effect immediately without restarting the application.
</Alert>

## Interface Theme

### Theme Options

- **Light** - Bright application interface
- **Dark** - Eye-friendly application interface
- **Follow System** - Automatically adapt to system theme

### How to Switch

In the **Style** section of the settings page:

1. Click the **Theme** dropdown menu
2. Select your desired theme

## Monitor on Startup

### Feature Description

When enabled, the application will automatically start monitoring keyboard input on startup, without manually clicking the "Start" button.

### How to Configure

In the **Display** section of the settings page:

1. Check the **Keystroke Monitoring** option

<Callout variant="secondary">
If both auto-start on boot and monitor on startup are enabled, keystroke monitoring will automatically start after system login.
</Callout>

## Settings Storage

All settings are automatically saved to:
```
~/.keycast-windows/app-settings.json
~/.keycast-windows/keycast-overlay.json
```
**Next Step**: Learn about [Update Management](docs/user-guide/updates).
