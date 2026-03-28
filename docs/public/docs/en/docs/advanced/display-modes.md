---
title: "Display Modes Explained"
description: "Detailed description of the six display modes of Keycast Windows"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Display Modes Explained

Keycast Windows provides 6 display modes, each optimized for specific usage scenarios.

## Mode Comparison Table

| Mode Name | Description | Config Value | Use Cases |
|-----------|-------------|--------------|-----------|
| Combo Keys Only | Only displays combo keys containing modifier keys | `combo-only` | Shortcut key demos |
| Single Keys Only | Only displays individual letters, numbers, and symbol keys | `single-only` | Typing demos |
| Combo Keys First | Prioritizes combo keys, displays single keys when no combo | `combo-precedence` | General scenarios |
| All Keys Continuous | Displays all keys, scrolls when keys are pressed continuously | `all-sequential` | Fast operations |
| All Keys Queued | Displays all keys, persists until timeout | `all-sequential-persistent` | Long recording |
| Smart Hybrid | Automatically switches modes based on typing rhythm | `smart-mixed` | Adaptive scenarios |

## Configuration Parameter Description

| Parameter | Description | Default Value | Range |
|-----------|-------------|---------------|-------|
| Combo Window | Time window for merging combo keys | 500 ms | 300-800 ms |
| Max Keys to Display | Maximum number of keys to display during continuous key presses | 5 | 3-20 |
| Continuous Key Window | Time window for determining continuous key presses in smart hybrid mode | 400 ms | 200-800 ms |
| Queue Idle Timeout | Timeout for clearing keys in **All Keys Queued** mode | 2000 ms | 200-5000 ms |
| Scroll Direction | Scroll effect when continuous keys exceed maximum count | Fade | Horizontal/Vertical/Fade |


---
