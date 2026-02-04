# Super Tools - 超级工具集

> 一个基于 Vue 3 + TypeScript 的在线工具集合，提供编辑器、地图、编码、通用工具等 12+ 实用功能。

## 🛠️ 技术栈

### 核心框架

- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - 类型安全
- **Vite (Rolldown)** - 极速构建工具

### UI 与样式

- **UnoCSS** - 原子化 CSS 引擎（含 Shortcuts）
- **自定义组件系统** - ToolLayout、ToolButton、TabBar 等

### 功能库

- **Ace Editor** - 代码编辑器
- **Marked** - Markdown 解析
- **高德地图 API** - 地图服务
- **QRCode / jsQR** - 二维码生成/解码
- **XLSX** - Excel 文件处理
- **Vue Router** - 模块化路由
- **Pinia** - 状态管理

### 工程化

- **全局错误处理** - 统一异常捕获
- **路由过渡动画** - 页面切换动效
- **模块化路由** - 按功能分组

## 📁 项目结构

```
super-tools/
├── src/
│   ├── components/              # 全局组件
│   │   ├── Message/            # 消息提示组件
│   │   │   └── MessageToast.vue
│   │   ├── svgIcon/            # SVG 图标组件
│   │   │   └── SvgIcon.vue
│   │   ├── TabBar/             # Tab 切换组件
│   │   │   └── TabBar.vue
│   │   └── ToolButton/         # 工具按钮组件
│   │       └── ToolButton.vue
│   │
│   ├── composables/             # 组合式函数
│   │   └── useMessage.ts
│   │
│   ├── layouts/                 # 布局组件
│   │   ├── ToolLayout.vue      # 工具页面通用布局
│   │   └── RouterLayout.vue    # 路由容器布局
│   │
│   ├── router/                  # 路由配置
│   │   ├── index.ts            # 路由主文件
│   │   ├── constants.ts        # 路由常量
│   │   └── modules/            # 模块化路由
│   │       ├── index.ts
│   │       ├── editor.ts       # 编辑器路由
│   │       ├── map.ts          # 地图路由
│   │       ├── code.ts         # 编码工具路由
│   │       └── general.ts      # 通用工具路由
│   │
│   ├── utils/                   # 工具函数
│   │   ├── index.ts            # 统一导出
│   │   ├── clipboard.ts        # 剪贴板操作
│   │   ├── file.ts             # 文件下载
│   │   └── errorHandler.ts     # 全局错误处理
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   └── amap.d.ts
│   │
│   ├── views/                   # 页面视图
│   │   ├── home/               # 首页
│   │   │   ├── index.vue
│   │   │   ├── constants.ts
│   │   │   └── components/
│   │   │
│   │   ├── editor/             # 编辑器工具
│   │   │   ├── json/           # JSON 编辑器
│   │   │   └── markdown/       # Markdown 编辑器
│   │   │
│   │   ├── map/                # 地图工具
│   │   │   ├── common/         # 地图公共模块
│   │   │   ├── distance/       # 距离计算
│   │   │   └── weather/        # 天气查询
│   │   │
│   │   ├── code/               # 编码工具
│   │   │   ├── regex/          # 正则测试
│   │   │   ├── urlParser/      # URL 编解码
│   │   │   └── base64/         # Base64 编解码
│   │   │
│   │   ├── general/            # 通用工具
│   │   │   ├── timestamp/      # 时间戳转换
│   │   │   ├── qrcode/         # 二维码工具
│   │   │   ├── excel2json/     # Excel 转 JSON
│   │   │   └── color/          # 颜色转换
│   │   │
│   │   └── error/              # 错误页面
│   │       └── 404.vue
│   │
│   ├── App.vue                  # 根组件（含路由过渡动画）
│   ├── main.ts                  # 应用入口
│   └── style.css                # 全局样式
│
├── .env                         # 环境变量
├── vite.config.ts              # Vite 配置
├── uno.config.js               # UnoCSS 配置（含 Shortcuts）
├── tsconfig.json               # TypeScript 配置
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

> ⚠️ 请前往 [高德开放平台](https://lbs.amap.com/) 申请自己的 API Key

## 📖 功能路由表

### 📝 编辑器工具

| 工具名称        | 图标 | 路由                     |
| --------------- | ---- | ------------------------ |
| JSON 编辑器     | { }  | `/tools/editor/json`     |
| Markdown 编辑器 | M↓   | `/tools/editor/markdown` |

### 🗺️ 地图工具

| 工具名称 | 图标 | 路由                  |
| -------- | ---- | --------------------- |
| 距离计算 | 📏   | `/tools/map/distance` |
| 天气查询 | 🌤️   | `/tools/map/weather`  |

### 💻 编码工具

| 工具名称      | 图标 | 路由                     |
| ------------- | ---- | ------------------------ |
| 正则测试      | 🔍   | `/tools/code/regex`      |
| URL 编解码    | 🔗   | `/tools/code/url-parser` |
| Base64 编解码 | 🔐   | `/tools/code/base64`     |

### 🔧 通用工具

| 工具名称      | 图标 | 路由                        |
| ------------- | ---- | --------------------------- |
| 时间戳转换    | ⏰   | `/tools/general/timestamp`  |
| 二维码工具    | 📱   | `/tools/general/qrcode`     |
| Excel 转 JSON | 📊   | `/tools/general/excel2json` |
| 颜色转换      | 🎨   | `/tools/general/color`      |

## 🎨 组件系统

### ToolLayout - 工具页面布局

位置: `src/layouts/ToolLayout.vue`

统一的工具页面布局，提供：

- 顶部工具栏（标题、返回按钮、操作按钮）
- 消息提示（通过 `inject('showMessage')` 使用）
- 主内容区（支持 padding 和 scroll 配置）

```vue
<ToolLayout title="工具名称" icon="🔧">
  <template #header-left>
    <ToolButton icon="check" text="操作" @click="..." />
  </template>
  <template #header-right>
    <ToolButton type="icon" icon="trash" @click="..." />
  </template>
  
  <!-- 主内容 -->
  <div>...</div>
</ToolLayout>
```

### ToolButton - 工具按钮

位置: `src/components/ToolButton/ToolButton.vue`

```vue
<!-- 普通按钮 -->
<ToolButton icon="check" text="确认" @click="..." />

<!-- 主要按钮 -->
<ToolButton type="primary" icon="format" text="格式化" />

<!-- 图标按钮 -->
<ToolButton type="icon" icon="trash" title="清空" />
```

### TabBar - Tab 切换

位置: `src/components/TabBar/TabBar.vue`

```vue
<TabBar
  v-model="activeTab"
  :tabs="[
    { key: 'text', label: '文本模式' },
    { key: 'image', label: '图片模式' },
  ]"
/>
```

### SvgIcon - 图标组件

位置: `src/components/svgIcon/SvgIcon.vue`

```vue
<SvgIcon name="copy" size="16px" />
```

可用图标: `repair`, `check`, `upload`, `download`, `copy`, `trash`, `eye`, `format`, `split`, `home`

## 🤝 开发指南

### 添加新工具

1. **创建页面目录**

   ```
   src/views/{分类}/{工具名}/
   ├── index.vue        # 页面组件
   └── constants.ts     # 常量配置（可选）
   ```

2. **添加路由常量** (`src/router/constants.ts`)

   ```typescript
   export const ROUTER_NAME = {
     // ...
     CODE_NEW_TOOL: "code-new-tool",
   };
   ```

3. **配置路由** (`src/router/modules/{分类}.ts`)

   ```typescript
   {
     path: "new-tool",
     name: ROUTER_NAME.CODE_NEW_TOOL,
     component: () => import("@/views/code/newTool/index.vue"),
     meta: { title: "新工具" },
   }
   ```

4. **添加首页卡片** (`src/views/home/constants.ts`)
   ```typescript
   {
     name: "new-tool",
     icon: "🆕",
     title: "新工具",
     description: "工具描述",
     routeName: ROUTER_NAME.CODE_NEW_TOOL,
     color: "blue",
   }
   ```

### 代码规范

- 使用 TypeScript 编写
- 组件使用 `<script setup>` 语法
- 样式优先使用 UnoCSS Shortcuts
- 遵循 Vue 3 Composition API 最佳实践

## 📝 TODO

- [x] ~~添加时间戳转换工具~~
- [x] ~~添加二维码生成工具~~
- [x] ~~添加 Excel 转 JSON 工具~~
- [x] ~~添加颜色转换工具~~
- [x] ~~添加天气查询工具~~
- [x] ~~添加正则表达式测试工具~~
- [x] ~~添加 URL 编解码工具~~
- [x] ~~添加 Base64 编解码工具~~
- [ ] 添加更多编辑器工具（SQL、CSS、HTML）
- [ ] 地图工具扩展（面积计算、路径规划）
- [ ] 添加单位转换工具
- [ ] 支持主题切换（暗色模式）
- [ ] 添加工具收藏功能
- [ ] 添加 PWA 支持

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
