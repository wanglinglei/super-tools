# Super Tools - 超级工具集

> 一个基于 Vue 3 + TypeScript 的在线工具集合，提供编辑器、地图、通用工具等 10+ 实用功能。

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

#### 天气查询
- ✅ 点击地图查询任意位置天气
- ✅ 显示实时天气信息（温度、天气、风向、湿度等）
- ✅ 提供未来4天天气预报
- ✅ 地理位置智能识别

### 🔧 通用工具

#### 时间戳转换
- ✅ 实时显示当前时间（秒、毫秒、格式化）
- ✅ 时间戳转日期时间
- ✅ 日期时间转时间戳
- ✅ 快捷预设（当前时间、昨天、明天、一周前/后等）

#### 二维码工具
- ✅ 二维码生成（支持文本、链接）
- ✅ 二维码解码（上传图片识别）
- ✅ 自定义颜色（前景色、背景色、预设色板）
- ✅ 自定义尺寸和容错级别
- ✅ 自定义中心图标
- ✅ 一键下载和复制

#### Excel 转 JSON
- ✅ 支持 `.xlsx`、`.xls` 文件上传
- ✅ 自动识别 Excel 字段
- ✅ 自定义选择需要转换的字段
- ✅ 实时数据预览（表格形式）
- ✅ JSON 格式化和压缩
- ✅ 一键复制和下载

#### 颜色转换
- ✅ 支持 HEX、RGB、HSL、HSV 格式互转
- ✅ 原生颜色选择器
- ✅ 全局透明度控制（Alpha 通道）
- ✅ 实时颜色预览
- ✅ 一键复制各格式结果
- ✅ 配置化架构，易于扩展

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
- **QRCode** - 二维码生成
- **jsQR** - 二维码解码
- **XLSX** - Excel 文件处理
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
│   │   └── svg/            # SVG 图标资源
│   ├── components/          # 全局组件
│   │   ├── svgIcon/        # SVG 图标组件
│   │   │   ├── SvgIcon.vue
│   │   │   └── README.md
│   │   ├── Message/        # 消息提示组件
│   │   │   ├── MessageToast.vue
│   │   │   └── README.md
│   │   └── TabBar/         # Tab 切换组件
│   │       ├── TabBar.vue
│   │       └── README.md
│   ├── composables/         # 组合式函数
│   │   └── useMessage.ts
│   ├── router/              # 路由配置
│   │   └── index.ts
│   ├── types/               # TypeScript 类型定义
│   │   └── amap.d.ts
│   ├── views/               # 页面视图
│   │   ├── home/           # 首页
│   │   │   ├── index.vue
│   │   │   └── constants.ts
│   │   ├── editor/         # 编辑器工具
│   │   │   ├── json/       # JSON 编辑器
│   │   │   │   ├── index.vue
│   │   │   │   └── README.md
│   │   │   └── markdown/   # Markdown 编辑器
│   │   │       ├── index.vue
│   │   │       ├── README.md
│   │   │       └── components/
│   │   │           └── formatSvg.vue
│   │   ├── map/            # 地图工具
│   │   │   ├── common/     # 地图公共模块
│   │   │   │   ├── BaseMap.ts
│   │   │   │   └── README.md
│   │   │   ├── distance/   # 距离计算
│   │   │   │   ├── index.vue
│   │   │   │   └── README.md
│   │   │   └── weather/    # 天气查询
│   │   │       ├── index.vue
│   │   │       └── README.md
│   │   └── general/        # 通用工具
│   │       ├── timestamp/  # 时间戳转换
│   │       │   ├── index.vue
│   │       │   └── README.md
│   │       ├── qrcode/     # 二维码工具
│   │       │   ├── index.vue
│   │       │   └── README.md
│   │       ├── excel2json/ # Excel 转 JSON
│   │       │   ├── index.vue
│   │       │   └── README.md
│   │       └── color/      # 颜色转换
│   │           ├── index.vue
│   │           ├── constants.ts
│   │           ├── transform.ts
│   │           ├── transform.md
│   │           ├── README.md
│   │           └── components/
│   │               ├── ColorFormatCard.vue
│   │               └── README.md
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

### 📝 编辑器工具

| 工具名称 | 图标 | 功能说明 | 路由 |
|---------|------|----------|------|
| JSON 编辑器 | { } | 在线编辑、格式化、校验 JSON 数据，支持智能修复常见错误 | `/tools/editor/json` |
| Markdown 编辑器 | M↓ | 实时预览的 Markdown 编辑器，支持分屏和丰富的格式工具栏 | `/tools/editor/markdown` |

### 🗺️ 地图工具

| 工具名称 | 图标 | 功能说明 | 路由 |
|---------|------|----------|------|
| 距离计算 | 📏 | 基于高德地图计算两点间的直线距离，支持点击选点和手动输入 | `/tools/map/distance` |
| 天气查询 | 🌤️ | 点击地图任意位置查询该区域的实时天气和未来4天预报 | `/tools/map/weather` |

### 🔧 通用工具

| 工具名称 | 图标 | 功能说明 | 路由 |
|---------|------|----------|------|
| 时间戳转换 | ⏰ | 时间戳与日期时间互相转换，支持秒和毫秒，提供快捷预设 | `/tools/general/timestamp` |
| 二维码工具 | 📱 | 生成和解码二维码，支持自定义颜色、大小和中心图标 | `/tools/general/qrcode` |
| Excel 转 JSON | 📊 | 将 Excel 文件转换为 JSON 格式，支持自定义选择字段 | `/tools/general/excel2json` |
| 颜色转换 | 🎨 | 支持 RGB、HEX、HSL、HSV 等颜色格式的相互转换 | `/tools/general/color` |

## 🎨 组件系统

### 全局图标组件 (SvgIcon)

位置: `src/components/svgIcon/SvgIcon.vue`

**使用方式**:
```vue
<SvgIcon name="upload" size="20px" />
<SvgIcon name="download" color="#ff0000" />
```

**可用图标**: repair, check, upload, download, copy, trash, eye, format, split

### 消息提示组件 (MessageToast)

位置: `src/components/Message/MessageToast.vue`

**使用方式**:
```vue
<MessageToast :visible="message.show" :text="message.text" :type="message.type" />
```

配合 `useMessage` 组合式函数使用，提供统一的消息提示功能。

### Tab 切换组件 (TabBar)

位置: `src/components/TabBar/TabBar.vue`

**使用方式**:
```vue
<TabBar v-model="activeTab" :tabs="tabs" />
```

用于二维码工具等需要 Tab 切换的场景。

### Markdown 格式图标

位置: `src/views/editor/markdown/components/formatSvg.vue`

仅在 Markdown 编辑器内部使用，包含 10 个格式化图标。

## 🤝 开发指南

### 添加新工具

1. 在 `src/views/` 对应分类下创建功能目录（`editor/`、`map/`、`general/`）
2. 创建页面组件 `index.vue`
3. 在 `src/router/index.ts` 添加路由配置
4. 在 `src/views/home/constants.ts` 添加工具配置
5. 创建工具说明文档 `README.md`
6. 更新本 README 文档

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

- [x] ~~添加时间戳转换工具~~
- [x] ~~添加二维码生成工具~~
- [x] ~~添加 Excel 转 JSON 工具~~
- [x] ~~添加颜色转换工具~~
- [x] ~~添加天气查询工具~~
- [ ] 添加更多编辑器工具（SQL、CSS、HTML 等）
- [ ] 地图工具扩展（面积计算、路径规划等）
- [ ] 添加单位转换工具
- [ ] 添加正则表达式测试工具
- [ ] 添加 Base64 编解码工具
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
