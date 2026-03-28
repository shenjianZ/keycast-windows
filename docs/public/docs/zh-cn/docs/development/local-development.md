---
title: "本地运行"
description: "Keycast Windows 本地开发运行指南"
author: "Keycast Team"
createdAt: 2026-03-23
---

# 本地运行

在本地运行 Keycast Windows 进行开发和调试。

## 开发模式

### 启动开发服务器

```bash
pnpm tauri dev
```

这个命令会：
1. 启动 Vite 开发服务器
2. 编译 Rust 后端代码
3. 打开应用窗口

### 热重载

- **前端**: 修改 React/TypeScript 代码会自动热重载
- **后端**: 修改 Rust 代码会自动重新编译

## 开发命令

### 常用命令

- 启动开发模式
    ```bash
    pnpm tauri dev 
    ```
-  构建发布版本
    ```bash
    pnpm tauri build
    ```
- 检查 Rust 代码
    ```bsah
    cargo check 
    ```
- 同步项目所有版本号
    ```bash
    pnpm version:sync 0.1.4
    ```
- 格式化前端代码
    ```bash
    pnpm format
    ```
- 格式化Rust代码
    ```bash
    cargo fmt
    ```

### 开发调试

#### 前端调试

1. 打开浏览器开发者工具
2. 在应用窗口中按 `F12`
3. 查看控制台输出和网络请求

#### 后端调试

1. 在终端查看 Rust 编译输出
2. 使用 `println!` 宏输出调试信息
3. 查看 Tauri 日志

## 文件监听

### 自动重新编译

以下文件变更会触发重新编译：

- `src/` - React/TypeScript 源码
- `src-tauri/src/` - Rust 源码
- `src-tauri/Cargo.toml` - Rust 依赖

### 不需要重启

修改以下文件不需要重新编译：

- 样式文件
- 静态资源
- 配置文件

## 常见问题

### 编译错误

<Alert type="warning">
Rust 编译失败

确保 Rust 工具链已正确安装：
```bash
rustup update
```
</Alert>

### 依赖问题

<Alert type="warning">
依赖安装失败

尝试清理并重新安装：
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```
</Alert>

### 权限问题

<Alert type="warning">
Windows Defender 拦截

将项目目录添加到 Windows Defender 的排除列表。

</Alert>


## 性能优化

### 加快编译速度

1. 使用 SSD 存储项目
2. 关闭不必要的杀毒软件
3. 增加系统内存

### 减少重新编译

- 批量修改代码后再运行
- 避免频繁保存

## 开发技巧


### 使用 TypeScript 类型提示

充分利用 TypeScript 的类型提示和自动补全功能。


### 利用 Git 分支

使用功能分支进行开发，保持主分支稳定。
</Callout>


### 定期提交代码

频繁提交代码，方便回滚和版本管理。


**下一步**: 了解如何 [构建打包](docs/development/building) 应用。
