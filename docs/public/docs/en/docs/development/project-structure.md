---
title: "Project Structure"
description: "Keycast Windows project directory structure description"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Project Structure

Keycast Windows adopts a clear modular structure for easy development and maintenance.

## Directory Structure

```
keycast-windows/
├── src/                    # React frontend source code
│   ├── lib/               # Utility library
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── App.tsx           # App entry
│   └── main.tsx          # React root component
├── src-tauri/            # Tauri backend source code
│   ├── src/              # Rust source code
│   │   ├── main.rs       # Entry file
│   │   ├── commands/     # Tauri commands
│   │   └── services/    # Business logic
│   ├── Cargo.toml        # Rust dependency configuration
│   └── tauri.conf.json   # Tauri app configuration
├── docs/                 # Documentation website
│   ├── public/           # Documentation content
│   ├── src/              # Documentation source code
│   └── package.json      # Documentation dependencies
├── keycast.html          # Keystroke overlay window
└── package.json         # Frontend dependency configuration
```

## Frontend Structure

### lib/ Directory

```
lib/
├── utils.ts              # Utility functions
├── types.ts              # TypeScript type definitions
├── native.ts             # Tauri API wrapper
└── updater.ts            # Update logic
```

- **utils.ts** - Common utility functions
- **types.ts** - Global type definitions
- **native.ts** - Tauri invoke API wrapper
- **updater.ts** - Automatic update state management

### components/ Directory

```
components/
├── ui/                   # Radix UI base components
├── AppShell.tsx         # Application framework
├── SettingsGroup.tsx    # Settings group component
└── [other components...]
```

### pages/ Directory

```
pages/
├── SettingsPage.tsx     # Settings page
└── AboutPage.tsx        # About page
```

## Backend Structure

### src/ Directory

```
src/
├── main.rs              # Application entry
├── commands/            # Tauri commands
│   ├── app_commands.rs         # Application settings commands
│   └── keycast_commands.rs     # Keystroke monitoring commands
└── services/            # Business logic services
    ├── keycast_service.rs      # Keystroke monitoring core
    ├── app_settings_service.rs # Application settings management
    └── window_service.rs       # Window and tray management
```

### Configuration Files

- **Cargo.toml** - Rust dependencies and package configuration
- **tauri.conf.json** - Tauri app configuration (window, plugins, etc.)
- **build.rs** - Build script (if needed)

## Documentation Structure

```
docs/
├── public/
│   ├── config/          # Configuration files
│   └── docs/           # Documentation content
├── src/
│   └── components/     # Custom MDX components
└── package.json        # Documentation dependencies
```

## File Naming Conventions

### React Components

- PascalCase: `SettingsPage.tsx`, `AppShell.tsx`
- Component file names match component names

### Rust Modules

- snake_case: `keycast_service.rs`, `app_commands.rs`
- Module file names match module names

### Documentation Files

- kebab-case: `display-modes.md`, `tech-stack.md`
- Use lowercase letters and hyphens

**Next Step**: Learn about [Development Environment](docs/development/development-environment) configuration.
