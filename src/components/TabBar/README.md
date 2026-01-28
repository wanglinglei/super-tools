# TabBar 组件

通用的 Tab 切换组件，支持图标和自定义样式。

## 功能特性

- ✅ 支持多个 Tab 选项
- ✅ 支持图标显示
- ✅ 响应式设计
- ✅ 悬停和激活状态
- ✅ 双向绑定 (v-model)

## 使用方法

### 基础用法

```vue
<template>
  <TabBar v-model="activeTab" :tabs="tabs" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabBar from '@/components/TabBar/TabBar.vue';
import type { Tab } from '@/components/TabBar/TabBar.vue';

const tabs: Tab[] = [
  { label: '选项一', value: 'tab1', icon: '📝' },
  { label: '选项二', value: 'tab2', icon: '🔍' },
  { label: '选项三', value: 'tab3' }, // 可选图标
];

const activeTab = ref('tab1');
</script>
```

### 监听切换事件

```vue
<template>
  <TabBar 
    v-model="activeTab" 
    :tabs="tabs"
    @update:modelValue="handleTabChange"
  />
</template>

<script setup lang="ts">
const handleTabChange = (value: string) => {
  console.log('切换到:', value);
  // 执行其他操作
};
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 必填 | 默认值 |
|------|------|------|------|--------|
| tabs | Tab 选项数组 | `Tab[]` | 是 | - |
| modelValue | 当前激活的 Tab 值 | `string` | 是 | - |

### Tab 类型定义

```typescript
interface Tab {
  label: string;    // Tab 显示文本
  value: string;    // Tab 的值（唯一标识）
  icon?: string;    // Tab 图标（可选，支持 Emoji）
}
```

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | Tab 切换时触发 | `(value: string)` |

## 样式定制

组件使用 UnoCSS/Tailwind CSS 类，可以通过以下方式自定义样式：

### 修改主题色

默认使用蓝色主题，如需修改，可以在组件的 `<style>` 中调整：

```css
.tab-btn-active {
  @apply text-purple-600 border-purple-500; /* 改为紫色 */
  @apply hover:text-purple-700 hover:border-purple-600;
}
```

### 调整尺寸

```css
.tab-btn {
  @apply px-6 py-4; /* 增大内边距 */
  @apply text-base; /* 增大字体 */
}
```

## 使用场景

1. **页面模式切换** - 如编辑/预览模式
2. **功能分类** - 如生成/解码、上传/下载
3. **数据筛选** - 如全部/待处理/已完成
4. **内容分类** - 如文章/图片/视频

## 示例

### 二维码工具

```vue
<template>
  <TabBar v-model="activeTab" :tabs="qrTabs" />
  
  <div v-if="activeTab === 'generate'">
    <!-- 生成二维码界面 -->
  </div>
  
  <div v-else-if="activeTab === 'decode'">
    <!-- 解码二维码界面 -->
  </div>
</template>

<script setup lang="ts">
const qrTabs: Tab[] = [
  { label: '生成二维码', value: 'generate', icon: '📱' },
  { label: '解码二维码', value: 'decode', icon: '🔍' },
];

const activeTab = ref('generate');
</script>
```

### 数据管理

```vue
<template>
  <TabBar v-model="status" :tabs="statusTabs" />
</template>

<script setup lang="ts">
const statusTabs: Tab[] = [
  { label: '全部', value: 'all', icon: '📋' },
  { label: '待处理', value: 'pending', icon: '⏳' },
  { label: '已完成', value: 'done', icon: '✅' },
];

const status = ref('all');
</script>
```

## 注意事项

1. **唯一性**：每个 Tab 的 `value` 必须唯一
2. **图标**：建议使用 Emoji，也可以使用 SVG 图标组件
3. **响应式**：组件会自动适配移动端
4. **状态保持**：切换 Tab 不会清除原 Tab 的数据

## 浏览器兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 更新日志

### v1.0.0 (2026-01-27)
- 初始版本
- 支持基础 Tab 切换功能
- 支持图标显示
- 支持双向绑定
