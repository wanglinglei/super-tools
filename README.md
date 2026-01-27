# Super Tools - 超级工具集

> 一个基于 Vue 3 + TypeScript 的在线工具集合，提供 JSON 编辑器、Markdown 编辑器、地图工具等实用功能。

## ✨ 功能特性

### 📝 编辑器工具

#### JSON 编辑器
- ✅ 语法高亮和代码补全
- ✅ JSON 格式校验
- ✅ 智能修复常见 JSON 错误（尾部逗号、引号、undefined 等）
- ✅ 文件上传/下载支持
- ✅ 一键复制和清空
- ✅ 实时错误提示

#### Markdown 编辑器
- ✅ 实时预览渲染
- ✅ 三种显示模式（编辑/预览/分屏）
- ✅ 丰富的格式快捷按钮工具栏
  - 文本格式：加粗、斜体、标题
  - 块级元素：引用、代码块
  - 列表：有序/无序列表
  - 媒体：链接、图片、表格
- ✅ 智能格式应用（选中文本自动套用格式）
- ✅ 文件上传/下载支持
- ✅ Markdown 语法高亮
- ✅ 完整的预览样式支持

### 🗺️ 地图工具

#### 距离计算
- ✅ 基于高德地图
- ✅ 点击地图选点或输入坐标
- ✅ 实时计算两点间直线距离
- ✅ 可视化连线展示
- ✅ 自动视野适配

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - 类型安全
- **Vite (Rolldown)** - 极速构建工具

### UI 与样式
- **UnoCSS** - 原子化 CSS 引擎
- **自定义 SVG 图标系统** - 轻量级图标解决方案

### 功能库
- **Ace Editor** - 强大的代码编辑器
- **Marked** - Markdown 解析和渲染
- **高德地图 API** - 地图服务
- **Vue Router** - 路由管理
- **Pinia** - 状态管理

### 开发工具
- **Vue DevTools** - 调试工具
- **TypeScript** - 类型检查
- **ESLint** - 代码规范

## 📁 项目结构

```
super-tools/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 全局组件
│   │   ├── SvgIcon.vue     # 通用 SVG 图标组件
│   │   └── SvgIcon.README.md
│   ├── router/              # 路由配置
│   │   └── index.ts
│   ├── types/               # TypeScript 类型定义
│   │   └── amap.d.ts
│   ├── views/               # 页面视图
│   │   ├── home/           # 首页
│   │   ├── editor/         # 编辑器工具
│   │   │   ├── json/       # JSON 编辑器
│   │   │   └── markdown/   # Markdown 编辑器
│   │   │       └── components/  # Markdown 专用组件
│   │   │           └── formatSvg.vue
│   │   └── map/            # 地图工具
│   │       ├── common/     # 地图公共模块
│   │       │   └── BaseMap.ts
│   │       └── distance/   # 距离计算
│   ├── App.vue             # 根组件
│   ├── main.ts             # 应用入口
│   └── style.css           # 全局样式
├── .env                     # 环境变量
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── uno.config.js           # UnoCSS 配置
└── package.json
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
访问 `http://localhost:5173/tools/`

### 构建生产版本
```bash
pnpm build
```

### 预览生产构建
```bash
pnpm preview
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置：

```env
# 高德地图配置
VITE_AMAP_KEY=your_amap_key
VITE_AMAP_SECURITY_JS_CODE=your_security_code
```

> ⚠️ 注意：请前往 [高德开放平台](https://lbs.amap.com/) 申请自己的 API Key

### 路由配置

项目使用 `history` 模式，base path 为 `/tools/`，可在 `vite.config.ts` 中修改：

```typescript
export default defineConfig({
  base: '/tools/',  // 修改此处
  // ...
})
```

## 📖 功能使用说明

### JSON 编辑器

**路由**: `/tools/editor/json`

**功能说明**:
1. **修复 JSON**: 自动修复常见错误
   - 移除尾部逗号
   - 给键添加双引号
   - 将单引号替换为双引号
   - 将 `undefined` 转换为 `null`

2. **校验 JSON**: 验证 JSON 格式是否正确

3. **上传文件**: 支持 `.json` 文件导入

4. **保存文件**: 将当前内容保存为 JSON 文件

5. **复制数据**: 一键复制到剪贴板

6. **清空内容**: 清除编辑器所有内容

### Markdown 编辑器

**路由**: `/tools/editor/markdown`

**功能说明**:
1. **格式快捷按钮**:
   - **B** (加粗): 选中文本后自动添加 `**`
   - **I** (斜体): 选中文本后自动添加 `*`
   - **H** (标题): 添加 `##` 前缀
   - **引用**: 添加 `>` 前缀
   - **代码**: 添加反引号
   - **列表**: 添加 `-` 或 `1.` 前缀
   - **链接**: 自动生成 `[文本](url)` 格式
   - **图片**: 自动生成 `![文本](url)` 格式
   - **表格**: 插入表格模板

2. **显示模式**:
   - **编辑**: 仅显示编辑器（默认）
   - **分屏**: 同时显示编辑器和预览
   - **预览**: 仅显示 Markdown 渲染结果

3. **文件操作**:
   - 支持 `.md` 和 `.markdown` 文件导入
   - 保存为 `.md` 文件
   - 一键复制和清空

### 地图距离计算

**路由**: `/tools/map/distance`

**使用步骤**:
1. 点击地图选择起点（第一次点击）
2. 点击地图选择终点（第二次点击）
3. 自动显示两点间的直线距离
4. 可手动输入经纬度坐标
5. 点击"清除"按钮重置坐标

**功能特点**:
- 实时距离计算
- 可视化连线展示
- 自动调整地图视野
- 支持手动输入坐标

## 🎨 图标系统

### 全局图标组件

位置: `src/components/SvgIcon.vue`

**使用方式**:
```vue
<SvgIcon name="upload" size="20px" />
<SvgIcon name="download" color="#ff0000" />
```

**可用图标**: repair, check, upload, download, copy, trash, eye, format, split

### Markdown 格式图标

位置: `src/views/editor/markdown/components/formatSvg.vue`

仅在 Markdown 编辑器内部使用，包含 10 个格式化图标。

## 🤝 开发指南

### 添加新工具

1. 在 `src/views/` 下创建功能目录
2. 创建页面组件 `index.vue`
3. 在 `src/router/index.ts` 添加路由
4. 更新本 README 文档

### 代码规范

- 使用 TypeScript 编写
- 组件使用 `<script setup>` 语法
- 样式使用 UnoCSS 原子类 + scoped CSS
- 遵循 Vue 3 Composition API 最佳实践

### 提交规范

建议使用语义化提交信息：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

## 📝 TODO

- [ ] 添加更多编辑器工具（SQL、CSS、HTML 等）
- [ ] 地图工具扩展（面积计算、路径规划等）
- [ ] 添加单位转换工具
- [ ] 添加时间戳转换工具
- [ ] 添加正则表达式测试工具
- [ ] 添加二维码生成工具
- [ ] 支持主题切换（暗色模式）
- [ ] 添加工具收藏功能

## 📄 License

MIT License

Copyright (c) 2026

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [UnoCSS](https://unocss.dev/)
- [Ace Editor](https://ace.c9.io/)
- [Marked](https://marked.js.org/)
- [高德地图](https://lbs.amap.com/)

---

**Star ⭐ 项目，支持作者持续更新！**
