---
title: "贡献指南"
description: "如何为 Keycast Windows 项目做出贡献"
author: "Keycast Team"
createdAt: 2026-03-23
---

# 贡献指南

感谢你考虑为 Keycast Windows 做出贡献！

## 如何贡献

### 报告问题

发现 bug 或有功能建议？请：

1. 访问 [Issues](https://github.com/shenjianZ/keycast-windows/issues)
2. 搜索是否已有相关问题
3. 创建新的 Issue，详细描述问题或建议

### 提交代码

#### Fork 项目

1. Fork 项目到你的 GitHub 账户
2. 克隆你的 Fork：
   ```bash
   git clone https://github.com/shenjianZ/keycast-windows.git
   cd keycast-windows
   ```

#### 创建分支

```bash
git checkout -b feature/your-feature-name
```

#### 提交更改

1. 进行代码修改
2. 编写清晰的提交信息
3. 提交代码：
   ```bash
   git add .
   git commit -m "Add: 描述你的更改"
   ```

#### 推送到 Fork

```bash
git push origin feature/your-feature-name
```

#### 创建 Pull Request

1. 访问原项目的 GitHub 页面
2. 点击 "New Pull Request"
3. 提供清晰的 PR 描述

## 代码规范

### 前端代码

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用 PascalCase 命名
- 文件名与组件名一致

### 后端代码

- 遵循 Rust 命名规范
- 使用 `cargo fmt` 格式化代码
- 使用 `cargo clippy` 检查代码质量
- 添加必要的注释和文档

### 提交信息

使用清晰的提交信息格式：

```
<type>: <description>

[optional body]
```

类型：
- `Add:` - 新功能
- `Fix:` - 修复 bug
- `Update:` - 更新功能
- `Docs:` - 文档更新
- `Refactor:` - 代码重构
- `Test:` - 添加测试
- `Chore:` - 其他更改

## 文档贡献

### 改进文档

1. Fork 项目
2. 编辑 `docs/` 目录下的文档
3. 提交 Pull Request

### 文档规范

- 使用清晰的标题
- 提供代码示例
- 添加适当的链接
- 使用正确的 Markdown 语法

## 开发流程

### 开发前

1. 查看现有 Issues
2. 评论你想处理的 Issue
3. 等待维护者确认

### 开发中

1. 遵循代码规范
2. 编写测试（如果需要）
3. 更新相关文档

### 开发后

1. 自测代码
2. 确保构建通过
3. 提交 PR 并描述更改

## 获取帮助

### 社区支持

- [GitHub Discussions](https://github.com/shenjianZ/keycast-windows/discussions)
- [Issues](https://github.com/shenjianZ/keycast-windows/issues)

### 联系方式

Email: `15202078626@163.com`


**感谢你的贡献！**

每一个贡献都让 Keycast Windows 变得更好。
