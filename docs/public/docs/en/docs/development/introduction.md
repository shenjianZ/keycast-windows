---
title: "Introduction"
description: "Keycast Windows project overview"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Project Introduction

Keycast Windows is a desktop application built with a modern tech stack, providing professional keystroke overlay functionality for Windows users.

## Project Overview

Keycast Windows adopts a frontend-backend separation architecture:
- **Frontend**: Built with React 19 + TypeScript + Tailwind CSS for the user interface
- **Backend**: Built with Rust + Tauri 2 for system-level functionality
- **Communication**: Frontend-backend communication through Tauri's event system

## Tech Stack

### Frontend Tech Stack

- **React 19** - User interface framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Atomic CSS framework
- **Radix UI** - Headless component library
- **React Router DOM** - Route management
- **Vite** - Fast build tool

### Backend Tech Stack

- **Rust** - System-level programming language
- **Tauri 2** - Cross-platform desktop application framework
- **Windows API** - Windows system calls
- **serde** - Serialization/deserialization framework
- **chrono** - Time handling library

### System Dependencies

- Tauri plugin system
- Windows API (user32.dll)
- System tray integration
- Global hotkey registration

## Architecture Design

### Frontend Architecture

```
src/
├── lib/              # Utility library
│   ├── utils.ts      # Utility functions
│   ├── types.ts      # Type definitions
│   ├── native.ts     # Tauri API wrapper
│   └── updater.ts    # Update logic
├── components/       # UI components
│   └── ui/          # Radix UI base components
├── pages/          # Page components
├── App.tsx         # App entry
└── main.tsx        # React root component
```

### Backend Architecture

```
src-tauri/src/
├── main.rs          # Application entry
├── commands/        # Tauri commands
│   ├── app_commands.rs
│   └── keycast_commands.rs
└── services/        # Business logic
    ├── keycast_service.rs
    ├── app_settings_service.rs
    └── window_service.rs
```

## Core Modules

### Keystroke Monitoring System (KeycastService)

- Uses Windows API to listen for global keystrokes
- Supports 6 display modes
- High-performance keystroke state tracking
- Memory management and performance optimization

### Configuration Management System

- Keystroke display configuration (KeycastOverlayConfig)
- Application settings management (AppSettingsService)
- Persistent storage
- Real-time configuration synchronization

### User Interface

- Responsive design
- Dark/light themes
- Internationalization support (Chinese and English)
- Accessibility features

## Development Philosophy

### Design Principles

1. **Simple and Efficient** - Lightweight design that doesn't affect system performance
2. **User-Friendly** - Intuitive interface, easy to configure
3. **Highly Customizable** - Rich configuration options
4. **Cross-Platform Ready** - Using Tauri to prepare for future cross-platform support

### Code Standards

- TypeScript strict mode
- Rust best practices
- Clear code comments
- Modular design

## Version History

See [Changelog](https://github.com/shenjianZ/keycast-windows/releases) for detailed version history.


**Next Step**: Learn detailed [Tech Stack](/docs/development/tech-stack) information.
