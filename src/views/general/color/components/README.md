# ColorFormatCard 组件

颜色格式转换卡片组件，用于显示单个颜色格式的输入和转换输出。

## 功能特性

- ✅ 支持任意颜色格式输入（HEX、RGB、HSL、HSV）
- ✅ 实时颜色预览
- ✅ 输出其他格式的转换结果
- ✅ 一键复制功能
- ✅ 统一的样式和交互

## Props

| 参数 | 说明 | 类型 | 必填 | 默认值 |
|------|------|------|------|--------|
| title | 卡片标题 | `string` | 是 | - |
| format | 输入格式名称（如 HEX、RGB） | `string` | 是 | - |
| modelValue | 输入框的值（支持 v-model） | `string` | 是 | - |
| placeholder | 输入框占位符 | `string` | 是 | - |
| previewColor | 预览颜色（用于右侧颜色块） | `string` | 是 | - |
| outputs | 输出格式列表 | `OutputFormat[]` | 是 | - |

### OutputFormat 类型

```typescript
interface OutputFormat {
  format: string;  // 格式名称（如 RGB、HSL、HSV）
  value: string;   // 格式化后的颜色值
}
```

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 输入值改变事件 | `(value: string)` |
| copy | 复制事件 | `(value: string)` |

## 使用示例

### 基础用法

```vue
<template>
  <ColorFormatCard
    v-model="hexInput"
    title="HEX 输入"
    format="HEX"
    placeholder="#43ad7f"
    :preview-color="hexInput"
    :outputs="hexOutputsArray"
    @update:model-value="handleHexInput"
    @copy="copyText"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ColorFormatCard from './components/ColorFormatCard.vue';

// 输入值
const hexInput = ref('#43ad7f');

// 输出格式列表
const hexOutputsArray = computed(() => [
  { format: 'RGB', value: 'rgb(67, 173, 127)' },
  { format: 'HSL', value: 'hsl(154, 44.2%, 47.1%)' },
  { format: 'HSV', value: 'hsv(154, 61.3%, 67.8%)' },
]);

// 处理输入
const handleHexInput = () => {
  // 转换逻辑
};

// 复制文本
const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};
</script>
```

### 完整示例（4 种格式）

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- HEX 输入 -->
    <ColorFormatCard
      v-model="hexInput"
      title="HEX 输入"
      format="HEX"
      placeholder="#43ad7f"
      :preview-color="hexInput"
      :outputs="hexOutputsArray"
      @update:model-value="handleHexInput"
      @copy="copyText"
    />

    <!-- RGB 输入 -->
    <ColorFormatCard
      v-model="rgbInput"
      title="RGB 输入"
      format="RGB"
      placeholder="rgb(67, 173, 127)"
      :preview-color="rgbInput"
      :outputs="rgbOutputsArray"
      @update:model-value="handleRgbInput"
      @copy="copyText"
    />

    <!-- HSL 输入 -->
    <ColorFormatCard
      v-model="hslInput"
      title="HSL 输入"
      format="HSL"
      placeholder="hsl(154, 44.2%, 47.1%)"
      :preview-color="hslInput"
      :outputs="hslOutputsArray"
      @update:model-value="handleHslInput"
      @copy="copyText"
    />

    <!-- HSV 输入 -->
    <ColorFormatCard
      v-model="hsvInput"
      title="HSV 输入"
      format="HSV"
      placeholder="hsv(154, 61.3%, 67.8%)"
      :preview-color="hsvToRgbString(hsvInput)"
      :outputs="hsvOutputsArray"
      @update:model-value="handleHsvInput"
      @copy="copyText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ColorFormatCard from './components/ColorFormatCard.vue';
import { 
  hexToRgb, 
  rgbToHex, 
  rgbToHsl,
  hsvToRgbString 
} from '../transform';

// 输入值
const hexInput = ref('#43ad7f');
const rgbInput = ref('rgb(67, 173, 127)');
const hslInput = ref('hsl(154, 44.2%, 47.1%)');
const hsvInput = ref('hsv(154, 61.3%, 67.8%)');

// 输出数据
const hexOutputsArray = computed(() => {
  const rgb = hexToRgb(hexInput.value);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [
    { format: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { format: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { format: 'HSV', value: '...' },
  ];
});

// 其他输出数据...

// 处理输入
const handleHexInput = () => {
  // 同步到其他格式
};

// 复制功能
const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
  console.log('已复制:', text);
};
</script>
```

## 组件结构

```
┌─────────────────────────────────┐
│  HEX 输入                       │  ← 标题
├─────────────────────────────────┤
│  HEX  [#43ad7f        ] [■]    │  ← 输入框 + 预览
├─────────────────────────────────┤
│  输出:                          │
│  RGB  [rgb(67, 173, 127)] [📋]  │  ← 输出行 1
│  HSL  [hsl(154, 44.2%...] [📋]  │  ← 输出行 2
│  HSV  [hsv(154, 61.3%...] [📋]  │  ← 输出行 3
└─────────────────────────────────┘
```

## 样式定制

组件使用 UnoCSS/Tailwind CSS 类，可通过以下方式自定义：

### 修改卡片样式

```css
/* 在父组件中覆盖 */
.color-format-card {
  @apply bg-blue-50;  /* 改变背景色 */
}
```

### 修改复制按钮样式

```css
/* 组件内已定义，可在组件文件中修改 */
.copy-btn {
  @apply w-7 h-7 bg-gray-100;
  @apply hover:bg-gray-200;
}
```

## 注意事项

1. **v-model 双向绑定**：组件支持 `v-model`，会在输入时触发 `update:modelValue` 事件

2. **颜色预览**：`previewColor` 应该是有效的 CSS 颜色值，否则预览块可能不显示颜色

3. **输出格式数组**：`outputs` 数组中的 `format` 字段会作为标签显示，`value` 字段是要复制的内容

4. **事件处理**：需要在父组件中处理 `update:modelValue` 和 `copy` 事件

5. **HSV 预览**：HSV 格式不能直接用于 CSS，需要先转换为 RGB 字符串：
   ```typescript
   :preview-color="hsvToRgbString(hsvInput)"
   ```

## 组件特点

- ✅ **可复用**：适用于任意颜色格式
- ✅ **统一样式**：所有格式卡片样式一致
- ✅ **独立复制**：每个输出结果都可单独复制
- ✅ **实时预览**：输入即时显示颜色预览
- ✅ **类型安全**：完整的 TypeScript 类型定义

## 兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 更新日志

### v1.0.0 (2026-01-27)
- 初始版本
- 支持颜色格式输入和输出
- 支持颜色预览
- 支持一键复制
