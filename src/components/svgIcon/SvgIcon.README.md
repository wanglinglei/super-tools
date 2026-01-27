# SvgIcon 组件使用说明

统一管理项目中的 SVG 图标，便于复用和维护。

## 基本用法

```vue
<template>
  <SvgIcon name="check" />
  <SvgIcon name="upload" size="24px" />
  <SvgIcon name="trash" color="#ff0000" />
  <SvgIcon name="copy" size="18px" class-name="mr-2" />
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon.vue';
</script>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | string | - | 图标名称（必填） |
| size | string | '20px' | 图标尺寸 |
| color | string | 'currentColor' | 图标颜色 |
| className | string | '' | 额外的 CSS 类名 |

## 可用图标列表

| 图标名称 | 说明 | 使用示例 |
|---------|------|---------|
| repair | 修复/工具图标 | `<SvgIcon name="repair" />` |
| check | 校验/对勾图标 | `<SvgIcon name="check" />` |
| upload | 上传图标 | `<SvgIcon name="upload" />` |
| download | 下载/保存图标 | `<SvgIcon name="download" />` |
| copy | 复制图标 | `<SvgIcon name="copy" />` |
| trash | 删除/清空图标 | `<SvgIcon name="trash" />` |
| eye | 预览/查看图标 | `<SvgIcon name="eye" />` |
| format | 格式化图标 | `<SvgIcon name="format" />` |
| split | 分屏图标 | `<SvgIcon name="split" />` |

## 添加新图标

在 `SvgIcon.vue` 的 `icons` 对象中添加新的图标定义：

```javascript
const icons: Record<string, any> = {
  // 现有图标...
  
  // 添加新图标
  'new-icon': defineComponent({
    setup() {
      return () => [
        h('path', { d: 'M...' }),
        h('circle', { cx: '12', cy: '12', r: '10' }),
      ];
    },
  }),
};
```

## 注意事项

1. 所有图标使用统一的 `viewBox="0 0 24 24"`
2. 默认使用 `currentColor` 继承父元素颜色
3. 图标内部已设置 `flex-shrink: 0` 防止被压缩
4. 建议使用 `size` 属性而不是 CSS 设置尺寸，确保宽高一致
