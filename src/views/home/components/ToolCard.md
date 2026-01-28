# ToolCard 组件

工具卡片组件，用于在首页展示各个工具的入口。

## 功能特性

- ✅ 精美的卡片设计，带悬停动画效果
- ✅ 支持多种颜色主题
- ✅ 响应式布局
- ✅ 点击跳转到对应工具页面
- ✅ 使用路由名称跳转（解耦路径结构）
- ✅ TypeScript 类型支持

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `icon` | `string` | ✅ | - | 工具图标，推荐使用 emoji 或简短文字 |
| `title` | `string` | ✅ | - | 工具标题 |
| `description` | `string` | ✅ | - | 工具描述，简要说明工具功能 |
| `routeName` | `string` | ✅ | - | 路由名称（对应 router/index.ts 中的 name 字段） |
| `color` | `'blue' \| 'indigo' \| 'green' \| 'purple' \| 'pink' \| 'yellow'` | ❌ | `'blue'` | 卡片主题颜色 |

## 使用示例

### 基础用法

```vue
<template>
  <ToolCard
    icon="{ }"
    title="JSON 编辑器"
    description="在线编辑、格式化、校验 JSON 数据"
    route-name="editor-json"
    color="blue"
  />
</template>

<script setup lang="ts">
import ToolCard from "./components/ToolCard.vue";
</script>
```

### 配合 v-for 使用

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ToolCard
      v-for="tool in tools"
      :key="tool.name"
      :icon="tool.icon"
      :title="tool.title"
      :description="tool.description"
      :route-name="tool.routeName"
      :color="tool.color"
    />
  </div>
</template>

<script setup lang="ts">
import ToolCard from "./components/ToolCard.vue";

const tools = [
  {
    name: "json-editor",
    icon: "{ }",
    title: "JSON 编辑器",
    description: "在线编辑、格式化、校验 JSON 数据",
    routeName: "editor-json",
    color: "blue",
  },
  {
    name: "markdown-editor",
    icon: "M↓",
    title: "Markdown 编辑器",
    description: "实时预览的 Markdown 编辑器",
    routeName: "editor-markdown",
    color: "indigo",
  },
];
</script>
```

### 不同颜色主题

```vue
<template>
  <!-- 蓝色主题（默认） -->
  <ToolCard
    icon="{ }"
    title="JSON 编辑器"
    description="在线编辑 JSON"
    route-name="editor-json"
  />

  <!-- 绿色主题 -->
  <ToolCard
    icon="📏"
    title="距离计算"
    description="计算两点间距离"
    route-name="map-distance"
    color="green"
  />

  <!-- 黄色主题 -->
  <ToolCard
    icon="⏰"
    title="时间戳转换"
    description="时间戳与日期互转"
    route-name="general-timestamp"
    color="yellow"
  />

  <!-- 紫色主题 -->
  <ToolCard
    icon="📱"
    title="二维码工具"
    description="生成和解码二维码"
    route-name="general-qrcode"
    color="purple"
  />

  <!-- 粉色主题 -->
  <ToolCard
    icon="🎨"
    title="颜色转换"
    description="颜色格式转换"
    route-name="general-color"
    color="pink"
  />

  <!-- 靛蓝主题 -->
  <ToolCard
    icon="M↓"
    title="Markdown 编辑器"
    description="实时预览 Markdown"
    route-name="editor-markdown"
    color="indigo"
  />
</template>
```

## 设计说明

### 卡片结构

```
ToolCard
├── 工具图标 (icon)
│   └── 圆角方形背景 + emoji/文字
├── 工具信息
│   ├── 标题 (title)
│   └── 描述 (description)
├── 进入箭头 (悬停时显示)
└── 装饰元素 (右上角圆形)
```

### 交互效果

1. **悬停效果**
   - 卡片上移 4px
   - 阴影加深
   - 边框变为主题色
   - 标题文字变为主题色
   - 图标放大 10%
   - 右下角显示进入箭头

2. **点击行为**
   - 使用路由名称跳转到对应页面
   - `router.push({ name: props.routeName })`

### 颜色系统

每种颜色主题包含以下元素的配色：

| 颜色 | 卡片悬停 | 图标背景 | 图标文字 | 箭头背景 | 装饰元素 |
|------|---------|---------|---------|---------|---------|
| blue | text-blue-500 | bg-blue-50 | text-blue-600 | bg-blue-500 | bg-blue-500 |
| indigo | text-indigo-500 | bg-indigo-50 | text-indigo-600 | bg-indigo-500 | bg-indigo-500 |
| green | text-green-500 | bg-green-50 | text-green-600 | bg-green-500 | bg-green-500 |
| purple | text-purple-500 | bg-purple-50 | text-purple-600 | bg-purple-500 | bg-purple-500 |
| pink | text-pink-500 | bg-pink-50 | text-pink-600 | bg-pink-500 | bg-pink-500 |
| yellow | text-yellow-500 | bg-yellow-50 | text-yellow-600 | bg-yellow-500 | bg-yellow-500 |

## 路由跳转说明

### 使用路由名称（推荐）✅

```typescript
// 组件内部实现
const navigateTo = () => {
  router.push({ name: props.routeName });
};
```

**优势**：
- ✅ 路径变更不影响跳转逻辑
- ✅ 避免手动拼写路径错误
- ✅ 配合 TypeScript 可以进行类型检查
- ✅ 解耦组件与具体路径结构

### 路由名称与路径对应关系

| 路由名称 (routeName) | 路由路径 (path) | 工具 |
|---------------------|----------------|------|
| `editor-json` | `/editor/json` | JSON 编辑器 |
| `editor-markdown` | `/editor/markdown` | Markdown 编辑器 |
| `map-distance` | `/map/distance` | 距离计算 |
| `map-weather` | `/map/weather` | 天气查询 |
| `general-timestamp` | `/general/timestamp` | 时间戳转换 |
| `general-qrcode` | `/general/qrcode` | 二维码工具 |
| `general-excel2json` | `/general/excel2json` | Excel 转 JSON |
| `general-color` | `/general/color` | 颜色转换 |

### 添加新路由

**步骤 1**: 在路由配置中定义
```typescript
// src/router/index.ts
{
  path: '/general/new-tool',
  name: 'general-new-tool',  // 定义路由名称
  component: () => import('../views/general/new-tool/index.vue'),
  meta: { title: '新工具' },
}
```

**步骤 2**: 在工具配置中使用
```typescript
// src/views/home/constants.ts
{
  name: "new-tool",
  icon: "🆕",
  title: "新工具",
  description: "新工具描述",
  routeName: "general-new-tool",  // 使用路由名称
  color: "blue",
}
```

**步骤 3**: 自动渲染
```vue
<!-- ToolCard 会自动使用 routeName 进行跳转 -->
<ToolCard
  v-for="tool in tools"
  :key="tool.name"
  :route-name="tool.routeName"
  v-bind="tool"
/>
```

## 样式定制

### 修改卡片高度

```vue
<style scoped>
.tool-card {
  min-height: 240px;  /* 默认 200px，可以调整 */
}
</style>
```

### 修改悬停上移距离

```vue
<style scoped>
.tool-card:hover {
  transform: translateY(-8px);  /* 默认 -4px，可以调整 */
}
</style>
```

### 自定义颜色

如需添加新的颜色主题，需要更新以下计算属性：

```typescript
const cardColorClass = computed(() => {
  const colorMap = {
    blue: 'hover:text-blue-500',
    // ... 其他颜色
    teal: 'hover:text-teal-500',  // 新增
  };
  return colorMap[props.color];
});

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    // ... 其他颜色
    teal: 'bg-teal-50 text-teal-600',  // 新增
  };
  return colorMap[props.color];
});

// 同时更新 arrowBgClass 和 decorBgClass
```

## 最佳实践

### 1. 图标选择

```vue
<!-- ✅ 推荐：使用 emoji -->
<ToolCard icon="📝" />
<ToolCard icon="🎨" />
<ToolCard icon="⏰" />

<!-- ✅ 可以：使用简短符号 -->
<ToolCard icon="{ }" />
<ToolCard icon="M↓" />

<!-- ❌ 不推荐：过长的文字 -->
<ToolCard icon="EDITOR" />
```

### 2. 描述文字

```vue
<!-- ✅ 推荐：简洁明了 -->
<ToolCard description="在线编辑、格式化、校验 JSON 数据" />

<!-- ❌ 不推荐：过于详细 -->
<ToolCard description="这是一个功能强大的 JSON 编辑器，支持..." />
```

### 3. 颜色选择

```vue
<!-- ✅ 推荐：为同类工具使用相近颜色 -->
<ToolCard color="blue" />   <!-- JSON 编辑器 -->
<ToolCard color="indigo" /> <!-- Markdown 编辑器 -->

<!-- ✅ 推荐：为不同类别使用不同颜色 -->
<ToolCard color="green" />  <!-- 地图工具 -->
<ToolCard color="yellow" /> <!-- 通用工具 -->
```

### 4. 路由名称规范

```vue
<!-- ✅ 推荐：使用 kebab-case 格式 -->
<ToolCard route-name="editor-json" />
<ToolCard route-name="general-timestamp" />

<!-- ❌ 不推荐：使用其他格式 -->
<ToolCard route-name="editorJson" />
<ToolCard route-name="Editor_Json" />
```

## 可访问性

- 使用语义化的 HTML 结构
- 卡片可点击，鼠标悬停有视觉反馈
- 支持键盘导航（TODO: 添加 `tabindex` 和回车事件）

## 性能优化

- 使用 `computed` 缓存样式类计算
- 避免在模板中进行复杂计算
- CSS 动画使用 `transform` 和 `opacity` 以利用 GPU 加速

## 相关组件

- [ToolSection](./ToolSection.vue) - 工具分类容器组件
- [ComingSoonCard](./ComingSoonCard.vue) - 敬请期待卡片组件

## 更新日志

### v2.0.0 (2026-01-28)
- ✅ 改用路由名称 (`routeName`) 替代路径 (`route`)
- ✅ 跳转方式改为 `router.push({ name })`
- ✅ 提高可维护性和灵活性

### v1.0.0
- ✅ 初始版本
- ✅ 支持多种颜色主题
- ✅ 悬停动画效果
- ✅ 点击跳转功能
