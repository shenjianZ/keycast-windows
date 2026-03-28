---
title: "Contributing"
description: "How to contribute to the Keycast Windows project"
author: "Keycast Team"
createdAt: 2026-03-23
---

# Contributing Guide

Thank you for considering contributing to Keycast Windows!

## How to Contribute

### Report Issues

Found a bug or have a feature suggestion? Please:

1. Visit [Issues](https://github.com/shenjianZ/keycast-windows/issues)
2. Search for existing related issues
3. Create a new Issue, describe the problem or suggestion in detail

### Submit Code

#### Fork Project

1. Fork the project to your GitHub account
2. Clone your fork:
   ```bash
   git clone https://github.com/shenjianZ/keycast-windows.git
   cd keycast-windows
   ```

#### Create Branch

```bash
git checkout -b feature/your-feature-name
```

#### Commit Changes

1. Make code modifications
2. Write clear commit messages
3. Commit code:
   ```bash
   git add .
   git commit -m "Add: Describe your changes"
   ```

#### Push to Fork

```bash
git push origin feature/your-feature-name
```

#### Create Pull Request

1. Visit the original project's GitHub page
2. Click "New Pull Request"
3. Provide a clear PR description

## Code Standards

### Frontend Code

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier to format code
- Use PascalCase for component naming
- File names match component names

### Backend Code

- Follow Rust naming conventions
- Use `cargo fmt` to format code
- Use `cargo clippy` to check code quality
- Add necessary comments and documentation

### Commit Messages

Use clear commit message format:

```
<type>: <description>

[optional body]
```

Types:
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Update feature
- `Docs:` - Documentation update
- `Refactor:` - Code refactoring
- `Test:` - Add tests
- `Chore:` - Other changes

## Documentation Contributions

### Improve Documentation

1. Fork the project
2. Edit documentation in the `docs/` directory
3. Submit a Pull Request

### Documentation Standards

- Use clear headings
- Provide code examples
- Add appropriate links
- Use correct Markdown syntax

## Development Workflow

### Before Development

1. Check existing Issues
2. Comment on the Issue you want to handle
3. Wait for maintainer confirmation

### During Development

1. Follow code standards
2. Write tests (if needed)
3. Update related documentation

### After Development

1. Self-test the code
2. Ensure build passes
3. Submit PR and describe changes

## Get Help

### Community Support

- [GitHub Discussions](https://github.com/shenjianZ/keycast-windows/discussions)
- [Issues](https://github.com/shenjianZ/keycast-windows/issues)

### Contact

Email: `15202078626@163.com`


**Thank you for your contribution!**

Every contribution makes Keycast Windows better.
