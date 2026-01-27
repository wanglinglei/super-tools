# 工具入口页面

工具导航主页，展示所有可用的工具和即将推出的功能。

## 📂 文件结构

```
home/
├── index.vue                 # 主页面
├── constants.ts              # 工具配置常量
├── README.md                 # 说明文档
└── components/
    ├── ToolCard.vue         # 可用工具卡片
    └── ComingSoonCard.vue   # 即将推出工具卡片
```

## 🎨 页面设计

### 布局
- 渐变背景（蓝色到紫色）
- 响应式网格布局（移动端 1 列，平板 2 列，桌面 3 列）
- 工具按类型分类展示

### 工具分类
1. **📝 编辑器工具** - JSON、Markdown 等编辑器
2. **🗺️ 地图工具** - 距离计算等地图功能
3. **🚀 更多工具** - 即将推出的功能（敬请期待）

## 🔧 组件说明

### ToolCard.vue
可用工具的卡片组件。

**Props**:
- `icon` (string): 工具图标（文字或 emoji）
- `title` (string): 工具名称
- `description` (string): 工具描述
- `route` (string): 路由地址
- `color` (string): 主题颜色（blue | indigo | green | purple | pink | yellow）

**特性**:
- 悬停时卡片上浮效果
- 右下角显示进入箭头
- 根据颜色主题显示不同样式
- 点击后跳转到对应工具页面

### ComingSoonCard.vue
即将推出工具的卡片组件。

**Props**:
- `icon` (string): 工具图标
- `title` (string): 工具名称
- `description` (string): 工具描述

**特性**:
- 虚线边框样式
- 显示"敬请期待"标签
- 不可点击状态
- 半透明效果

## 📄 constants.ts
工具配置常量文件，包含所有工具的元数据。

**导出内容**:
- `ToolColor` - 颜色类型定义
- `Tool` - 工具接口定义
- `ComingTool` - 即将推出工具接口定义
- `editorTools` - 编辑器工具列表
- `mapTools` - 地图工具列表
- `comingTools` - 即将推出工具列表

## 📝 添加新工具

### 1. 添加到现有分类

在 `constants.ts` 中的对应数组添加工具配置：

```typescript
// constants.ts
export const editorTools: Tool[] = [
  // 现有工具...
  {
    name: "new-tool",
    icon: "📄",
    title: "新工具",
    description: "工具描述",
    route: "/editor/new-tool",
    color: "purple",
  },
];
```

### 2. 添加新分类

**步骤 1**: 在 `constants.ts` 中添加新的工具列表：

```typescript
// constants.ts
export const newCategoryTools: Tool[] = [
  {
    name: "tool-1",
    icon: "🔧",
    title: "工具 1",
    description: "工具描述",
    route: "/category/tool-1",
    color: "orange",
  },
];
```

**步骤 2**: 在 `index.vue` 中导入并使用：

```typescript
// index.vue
import { editorTools, mapTools, comingTools, newCategoryTools } from "./constants";
```

**步骤 3**: 在模板中添加新的 section：

```vue
<section>
  <div class="flex items-center mb-6">
    <div class="w-1 h-8 bg-orange-500 rounded mr-3"></div>
    <h2 class="text-2xl font-bold text-gray-800">🔧 新分类</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ToolCard
      v-for="tool in newCategoryTools"
      :key="tool.name"
      :icon="tool.icon"
      :title="tool.title"
      :description="tool.description"
      :route="tool.route"
      :color="tool.color"
    />
  </div>
</section>
```

### 3. 添加即将推出的工具

在 `constants.ts` 的 `comingTools` 数组中添加：

```typescript
// constants.ts
export const comingTools: ComingTool[] = [
  // 现有工具...
  {
    name: "future-tool",
    icon: "⚡",
    title: "未来工具",
    description: "即将推出的功能",
  },
];
```

## 🎨 颜色主题

可用的颜色主题：
- `blue` - 蓝色（适合通用工具）
- `indigo` - 靛蓝（适合编辑器）
- `green` - 绿色（适合地图工具）
- `purple` - 紫色（适合创意工具）
- `pink` - 粉色（适合媒体工具）
- `yellow` - 黄色（适合转换工具）

## 💡 设计亮点

1. **视觉吸引力**
   - 渐变背景
   - 悬停动画效果
   - 彩色装饰元素

2. **用户体验**
   - 清晰的分类结构
   - 直观的工具卡片设计
   - 明确的"即将推出"状态

3. **响应式设计**
   - 移动端友好
   - 自适应不同屏幕尺寸
   - 网格布局自动调整

4. **交互反馈**
   - 悬停效果
   - 点击跳转
   - 视觉引导（箭头）

## 🔄 未来优化

- [ ] 添加工具搜索功能
- [ ] 添加工具收藏功能
- [ ] 添加最近使用记录
- [ ] 支持工具标签筛选
- [ ] 添加工具使用统计
