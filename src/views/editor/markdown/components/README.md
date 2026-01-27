# Markdown 编辑器组件说明

## formatSvg.vue

Markdown 编辑器专用的格式图标组件。

### 使用方式

```vue
<template>
  <FormatSvg name="bold" />
  <FormatSvg name="italic" />
  <FormatSvg name="heading" />
</template>

<script setup>
import FormatSvg from './components/formatSvg.vue';
</script>
```

### Props

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 图标名称 |

### 可用图标

| 图标名称 | 说明 |
|---------|------|
| bold | 加粗 |
| italic | 斜体 |
| heading | 标题 |
| quote | 引用 |
| code | 代码 |
| list | 无序列表 |
| orderedList | 有序列表 |
| link | 链接 |
| image | 图片 |
| table | 表格 |

### 样式

- 图标尺寸：16x16px
- 颜色：继承父元素的 `currentColor`
- 默认样式类：`.format-icon`

### 特点

- 仅用于 Markdown 编辑器页面
- 不放在公共组件中，避免全局污染
- 使用简洁的 SVG 路径定义
- 支持类型提示
