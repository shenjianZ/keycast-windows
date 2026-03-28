---
title: "Display Modes"
description: "Introduction to the six display modes of Keycast Windows"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Display Modes

Keycast Windows provides 6 display modes, each optimized for specific usage scenarios.

## Mode Overview

<BadgeList>
  <BadgeList.Badge variant="primary">Combo Keys Only</BadgeList.Badge>
  <BadgeList.Badge variant="primary">Single Keys Only</BadgeList.Badge>
  <BadgeList.Badge variant="primary">Combo Keys First</BadgeList.Badge>
  <BadgeList.Badge variant="success">All Keys Continuous</BadgeList.Badge>
  <BadgeList.Badge variant="success">All Keys Queued</BadgeList.Badge>
  <BadgeList.Badge variant="success">Smart Hybrid</BadgeList.Badge>
</BadgeList>

## Quick Selection Guide

- Software tutorials/demos: Use **Combo Keys Only** mode to highlight shortcut operations.
- Typing teaching/password input: Use **Single Keys Only** mode to clearly show input content.
- Gaming/fast operations: Use **All Keys Continuous** mode to fully record key sequences.
- Long operation recording: Use **All Keys Queued** mode to persistently display operation history.
- General scenarios: Use **Combo Keys First** mode, the most adaptable.
- Advanced users: Use **Smart Hybrid** mode for the best adaptive experience.


## Mode Introduction

### 1. Combo Keys Only (combo-only)

Only displays combo keys containing modifier keys, ignoring individual letters, numbers, and symbol keys.

**Examples**:
- `Ctrl+C` → Display
- `A` → Don't display

**Use Case**: Software shortcut key demos

### 2. Single Keys Only (single-only)

Only displays individual letters, numbers, and symbol keys, ignoring modifier key combinations.

**Examples**:
- `A` → Display
- `Ctrl+C` → Don't display

**Use Case**: Typing teaching, password input demos

### 3. Combo Keys First (combo-precedence)

Prioritizes combo keys, displays single keys when no combo keys are present.

**Examples**:
- `Ctrl+C` → Display
- `A` → Display

**Use Case**: General scenarios, most adaptable

### 4. All Keys Continuous (all-sequential)

Displays all keys, shows in scroll direction when keys are pressed continuously.

**Examples**:
- `Ctrl+C` `A` `S` `D` → Display all

**Use Case**: Gaming operations, fast typing

### 5. All Keys Queued (all-sequential-persistent)

Displays all keys, persists until timeout.

**Examples**:
- Input `Ctrl+C` `A` `S` `D` → Persistent display
- Wait for timeout → Clear

**Use Case**: Long operation recording

### 6. Smart Hybrid (smart-mixed)

Automatically switches modes based on typing rhythm.

**Examples**:
- Slow typing → Display individually
- Fast typing → Display continuously

**Use Case**: Adaptive scenarios


**Next Step**: Learn how to configure [Theme Styles](/docs/user-guide/themes).
