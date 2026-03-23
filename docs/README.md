# Keycast Windows Documentation

这是 Keycast Windows 项目的官方文档网站。

## 本地开发

### 安装依赖

```bash
cd docs
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 自动部署到 GitHub Pages

文档会在以下情况自动部署到 GitHub Pages：

1. **推送到 master 分支** - 当有文件变更推送到 `master` 分支时
2. **文档内容更新** - 当 `docs/` 目录下的文件有变更时
3. **手动触发** - 在 GitHub Actions 页面手动触发工作流

### 部署配置

- **工作流文件**: `.github/workflows/deploy-docs.yml`
- **部署分支**: master
- **构建输出**: `docs/dist/`
- **GitHub Pages URL**: https://shenjianz.github.io/keycast-windows/

### 首次设置

1. 在 GitHub 仓库中启用 GitHub Pages：
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

2. 确保 GitHub Actions 有正确的权限：
   - Settings → Actions → General
   - Workflow permissions → 选择 "Read and write permissions"

## 文档结构

```
docs/
├── public/
│   ├── config/          # 配置文件
│   ├── docs/           # 文档内容
│   │   ├── zh-cn/      # 中文文档
│   │   └── en/         # 英文文档
│   └── images/         # 图片资源
├── src/
│   ├── components/     # 自定义组件
│   └── main.tsx        # 入口文件
└── package.json
```

## 添加新文档

1. 在 `public/docs/zh-cn/` 或 `public/docs/en/` 中创建 `.md` 文件
2. 在 `public/config/site.yaml` 中添加导航配置
3. 运行 `pnpm dev` 预览

## 自定义组件

项目包含以下自定义 MDX 组件：

- `KeyPreview` - 按键预览组件
- `ConfigTable` - 配置表格组件
- `ThemeCard` - 主题卡片组件

在文档中使用：

```markdown
<KeyPreview keys={["Ctrl", "C"]} mode="combo" theme="dark" />

<ConfigTable items={[
  { name: "参数名", description: "说明", default: "默认值" }
]} />

<ThemeCard 
  name="主题名" 
  description="主题描述" 
  tags={["标签"]}
/>
```

## 技术栈

- React 19 + TypeScript
- Vite
- React Docs UI
- Tailwind CSS
- MDX

## 相关链接

- [主项目](https://github.com/shenjianZ/keycast-windows)
- [React Docs UI 文档](https://github.com/shenjianZ/React-docs-ui)
