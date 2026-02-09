# Super Tools - 超级工具集

> 一个基于 Vue 3 + TypeScript 的在线工具集合，提供编辑器、地图、编码、通用工具等 13+ 实用功能。

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
- **Husky** - Git pre-commit 钩子（自动类型检查）
- **构建解耦** - TypeScript 类型检查与 Vite 构建独立运行

## 📁 项目结构

```
super-tools/
├── src/
│   ├── components/              # 全局组件
│   │   ├── Message/            # 消息提示组件
│   │   │   └── MessageToast.vue
│   │   ├── svgIcon/            # SVG 图标组件
│   │   │   └── SvgIcon.vue
│   │   ├── TabBar/             # Tab 切换组件（支持吸顶）
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
│   │   │       ├── ToolCard.vue
│   │   │       └── ComingSoonCard.vue
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
│   │   │   ├── urlParser/      # URL 编解码 + 参数编辑
│   │   │   │   ├── components/
│   │   │   │   │   ├── UrlEncoder.vue
│   │   │   │   │   └── UrlParamsEditor.vue
│   │   │   │   ├── constants.ts
│   │   │   │   └── index.vue
│   │   │   └── base64/         # Base64 编解码
│   │   │       ├── components/
│   │   │       │   ├── TextBase64.vue
│   │   │       │   └── ImageBase64.vue
│   │   │       ├── constants.ts
│   │   │       └── index.vue
│   │   │
│   │   ├── general/            # 通用工具
│   │   │   ├── timestamp/      # 时间戳转换
│   │   │   ├── qrcode/         # 二维码工具
│   │   │   │   ├── components/
│   │   │   │   │   ├── QRCodeGenerator.vue
│   │   │   │   │   └── QRCodeDecoder.vue
│   │   │   │   └── index.vue
│   │   │   ├── excel2json/     # Excel 转 JSON
│   │   │   ├── color/          # 颜色转换 + 渐变色 + 取色器
│   │   │   │   ├── components/
│   │   │   │   │   ├── ColorPanel.vue
│   │   │   │   │   ├── GradientPanel.vue
│   │   │   │   │   └── ColorFormatCard.vue
│   │   │   │   ├── constants.ts
│   │   │   │   ├── transform.ts
│   │   │   │   └── index.vue
│   │   │   └── diff/           # 文本 Diff
│   │   │       ├── constants.ts
│   │   │       └── index.vue
│   │   │
│   │   └── error/              # 错误页面
│   │       └── 404.vue
│   │
│   ├── App.vue                  # 根组件（含路由过渡动画）
│   ├── main.ts                  # 应用入口
│   └── style.css                # 全局样式
│
├── .husky/                      # Git Hooks
│   └── pre-commit              # commit 前自动类型检查
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

### 类型检查

```bash
pnpm type-check
```

### 构建生产版本

```bash
pnpm build
```

> 注：构建仅运行 Vite，不会因 TypeScript 类型错误而阻断。类型检查通过 `pnpm type-check` 独立执行，且已在 Git pre-commit 钩子中自动运行。

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

| 工具名称      | 图标 | 路由                     | 功能说明                                   |
| ------------- | ---- | ------------------------ | ------------------------------------------ |
| 正则测试      | 🔍   | `/tools/code/regex`      | 正则表达式测试与匹配                       |
| URL 编解码    | 🔗   | `/tools/code/url-parser` | URL 编码/解码 + Query 参数键值对可视化编辑 |
| Base64 编解码 | 🔐   | `/tools/code/base64`     | 文本/图片 Base64 互转，支持拖拽上传        |

### 🔧 通用工具

| 工具名称      | 图标 | 路由                        | 功能说明                                   |
| ------------- | ---- | --------------------------- | ------------------------------------------ |
| 时间戳转换    | ⏰   | `/tools/general/timestamp`  | 时间戳与日期互转                           |
| 二维码工具    | 📱   | `/tools/general/qrcode`     | 二维码生成（自定义颜色/图标）+ 二维码解码  |
| Excel 转 JSON | 📊   | `/tools/general/excel2json` | Excel 文件解析为 JSON                      |
| 颜色转换      | 🎨   | `/tools/general/color`      | HEX/RGB/HSL/HSV 互转、取色器、渐变色生成器 |
| 文本 Diff     | 📄   | `/tools/general/diff`       | 文本差异对比，支持统一/并排视图            |

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

### 组件拆分规范

页面模板过长时应拆分子组件，放在页面同级 `components/` 目录下：

```
src/views/{分类}/{工具名}/
├── index.vue              # 主页面（Tab 切换、布局）
├── constants.ts           # 常量配置
└── components/            # 子组件
    ├── FeatureA.vue
    └── FeatureB.vue
```

子组件通过 `props` / `emit` / `inject` 与父组件通信，通过 `defineExpose` 暴露方法供父组件调用。

### 代码规范

- 使用 TypeScript 编写
- 组件使用 `<script setup>` 语法
- 样式优先使用 UnoCSS Shortcuts
- 遵循 Vue 3 Composition API 最佳实践
- Git commit 前自动进行 TypeScript 类型检查

## 📝 TODO

### 已完成

- [x] ~~添加时间戳转换工具~~
- [x] ~~添加二维码生成工具~~
- [x] ~~添加 Excel 转 JSON 工具~~
- [x] ~~添加颜色转换工具~~
- [x] ~~添加天气查询工具~~
- [x] ~~添加正则表达式测试工具~~
- [x] ~~添加 URL 编解码工具~~
- [x] ~~添加 Base64 编解码工具~~
- [x] ~~添加文本 Diff 对比工具~~
- [x] ~~颜色工具扩展：渐变色生成器（线性/径向/锥形 + 预设）~~
- [x] ~~颜色工具扩展：取色器（屏幕取色 + 图片取色 + 历史记录）~~
- [x] ~~URL 工具扩展：Query 参数键值对可视化编辑~~
- [x] ~~Tab 吸顶交互优化~~
- [x] ~~大页面组件拆分（颜色、二维码、Base64、URL）~~
- [x] ~~构建解耦：TypeScript 类型检查与 Vite 构建独立运行~~
- [x] ~~Git pre-commit 钩子自动类型检查~~

### 计划中

- [ ] 添加更多编辑器工具（SQL、CSS、HTML）
- [ ] 地图工具扩展（面积计算、路径规划）
- [ ] 添加单位转换工具
- [ ] 支持主题切换（暗色模式）
- [ ] 添加工具收藏功能
- [ ] 添加 PWA 支持

## 🔮 可扩展功能建议

基于现有工具的实现模式（`ToolLayout` + 常量配置 + 复制/清空/示例），可从以下方向扩展：

### 一、在现有工具上增强

| 工具              | 可扩展能力                                                  | 状态     |
| ----------------- | ----------------------------------------------------------- | -------- |
| **Base64**        | 增加 Base64URL、多行/单行切换、批量编解码                   | 待开发   |
| **时间戳**        | 时区选择、Cron 表达式生成、相对时间（如「3 天前」）         | 待开发   |
| **正则**          | 正则替换（replace）、常用正则库/收藏、匹配高亮              | 待开发   |
| **URL 编解码**    | ~~Query 解析为键值对编辑~~、批量 URL 处理                   | 部分完成 |
| **颜色**          | ~~渐变色生成~~、~~取色器从图片/屏幕取色~~、~~色板历史记录~~ | 已完成   |
| **二维码**        | 批量生成、样式模板、解析历史                                | 待开发   |
| **Excel 转 JSON** | 支持 JSON 转 Excel 导出、多 Sheet、列映射预设               | 待开发   |
| **地图**          | 面积测量、路径规划、坐标批量转换、收藏点位                  | 待开发   |
| **文本 Diff**     | 字符级 Diff、语法高亮、文件对比                             | 待开发   |

### 二、编码工具类（与 Base64/URL/正则同体系）

- **Hash 工具**：MD5、SHA-1/SHA-256 等，文本/文件，与 Base64 类似的左右输入输出布局。
- **进制转换**：二/八/十/十六进制互转，支持大数、字节预览。
- **Unicode/转义**：Unicode 编解码、\uXXXX 与字符互转、HTML 实体。
- **JSON 转 Excel**：与现有 Excel→JSON 对称，导出为 .xlsx。

### 三、编辑器类（与 JSON/Markdown 同体系）

- **HTML 编辑器**：源码 + 实时预览（iframe），已有 coming 规划。
- **SQL 格式化**：关键字高亮、缩进/大小写、简单校验（已有 coming）。
- **CSS 格式化/压缩**：美化、minify、兼容性前缀提示（可选）。

### 四、通用工具类

- **单位转换**：长度、重量、温度、存储单位等（已有 coming）。
- **UUID/随机数**：批量生成 UUID、随机字符串、随机数范围。
- **Cron 表达式**：可视化生成 Cron、下次执行时间预览。
- ~~**文本 Diff**~~：✅ 已实现（LCS 算法、统一/并排视图）。
- **图片压缩**：上传图片、设置质量/尺寸、下载压缩后图片。

### 五、地图类

- **面积测量**：多边形选点、面积计算（可复用 `map/common` 与高德 API）。
- **路径规划**：驾车/步行/骑行路线、距离与时间估算。
- **坐标转换**：WGS84 / GCJ02 / BD09 等互转（需注意合规与精度）。

### 六、体验与工程

- **主题切换**：暗色/亮色，与现有 UnoCSS 和 `ToolLayout` 统一。
- **工具收藏/常用**：首页置顶或单独「收藏」分组，持久化到 localStorage。
- **历史记录**：按工具记录最近输入/结果（可选，注意隐私）。
- **PWA**：离线可用、安装到桌面，与现有 Vite 构建兼容。
- **多语言**：若后续有国际化需求，可对 `constants` 与路由 meta 做 i18n。

新增工具时建议：在 `src/views/{分类}/{工具名}/` 下建 `index.vue` + `constants.ts`，在 `router/constants.ts` 与对应 `router/modules/*.ts` 中注册路由，最后在 `src/views/home/constants.ts` 的对应分类和 `comingTools` 中更新配置。页面模板复杂时按功能拆分子组件到同级 `components/` 目录。

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
