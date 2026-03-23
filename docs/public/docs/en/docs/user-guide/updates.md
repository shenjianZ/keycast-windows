---
title: "Updates"
description: "Keycast Windows automatic update system"
author: "Keycast Team"
date: 2026-03-23
---

# Update Management

Keycast Windows has a built-in automatic update system that makes it easy to get the latest features and fixes.

## Automatic Updates

### Check for Updates

The application automatically checks for updates on startup:
- Silent background check
- Does not interfere with normal use
- Shows notification when a new version is found

### Update Process

1. **Check for Updates** - Automatically checks on startup
2. **Download Updates** - Shows download progress
3. **Install Updates** - One-click install of update packages
4. **Restart Application** - Complete the update

<Alert type="info">
After the update package is downloaded, you can choose an appropriate time to click the "Install Update" button.
</Alert>

## Update Status

### Status Descriptions

- **Checking...** - Connecting to update server
- **New Version Found** - Update available, shows version number
- **Downloading...** - Downloading update package, shows progress
- **Downloaded** - Update package ready
- **Up to Date** - No updates available
- **Check Failed** - Network connection issue or server error
- **Download Failed** - Network interruption or insufficient storage

## Manual Check

If you want to manually check for updates on startup:

1. Open the main window
2. Click the **Settings** button
3. Click the **Check for Updates** button in the **App Updates** section

## Update Configuration

### Auto Check

Enabled by default to automatically check on startup.

### Disable Auto Check

If you don't want to automatically check for updates, you can disable it in application settings.

## Version History

View update history:
1. Visit [GitHub Releases](https://github.com/shenjianZ/keycast-windows/releases)
2. View update content for each version

## FAQ


<BadgeList.Badge variant="error">Update failed?</BadgeList.Badge>
Check network connection, ensure access to GitHub
<BadgeList.Badge variant="error">Slow download?</BadgeList.Badge>
May be a network issue, please retry later
<BadgeList.Badge variant="error">Install failed?</BadgeList.Badge>
Close the application and retry, or manually download and install
