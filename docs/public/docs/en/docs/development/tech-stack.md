---
title: "Tech Stack"
description: "Introduction to the technology stack used by Keycast Windows"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Tech Stack

Keycast Windows adopts a modern tech stack to provide users with a stable and efficient desktop application experience.

## Frontend Tech Stack

### Core Frameworks

- **React 19** - User interface framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool

### UI Components

- **Radix UI** - Headless component library providing accessible UI primitives
- **Tailwind CSS v4** - Atomic CSS framework
- **Lucide React** - Beautiful icon library

### Routing and State

- **React Router DOM v7** - Client-side routing
- **React Hooks** - State management and side effect handling

## Backend Tech Stack

### Core Technologies

- **Rust** - System-level programming language providing memory safety and performance
- **Tauri 2** - Cross-platform desktop application framework

### Windows Integration

- **Windows API** - Calling system APIs through winapi crate
- **GetAsyncKeyState** - Global keystroke monitoring

### Data Processing

- **serde** - Serialization/deserialization framework
- **chrono** - Date and time handling

## Tauri Plugins

### Official Plugins

- **tauri-plugin-opener** - Open external links
- **tauri-plugin-autostart** - Auto-start on boot management
- **tauri-plugin-global-shortcut** - Global hotkeys
- **tauri-plugin-updater** - Automatic update system

## Development Tools

### Package Manager

- **pnpm** - Fast, disk-space-saving package manager

### Code Quality

- **TypeScript strict mode** - Strict type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Architecture Features

### Frontend-Backend Separation

- Frontend: React + TypeScript running in WebView
- Backend: Rust handles system-level operations
- Communication: Frontend-backend communication through Tauri's event system

### Type Safety

- Frontend and backend share TypeScript type definitions
- Rust's type system ensures backend safety
- Tauri automatically generates type-safe API bindings

### Performance Optimization

- Rust zero-cost abstractions
- Minimized package size
- Fast startup and response


**Next Step**: Learn about [Project Structure](docs/development/project-structure).
