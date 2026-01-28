# 颜色格式配置常量

颜色转换工具的配置文件，定义了所有支持的颜色格式及其相关配置。

## 📋 导出内容

### 类型定义

#### `ColorFormatType`

支持的颜色格式类型（唯一标识符）

```typescript
export type ColorFormatType = 'hex' | 'rgb' | 'hsl' | 'hsv';
```

#### `ColorFormatConfig`

颜色格式配置项接口

```typescript
export interface ColorFormatConfig {
  /** 格式类型（唯一标识） */
  type: ColorFormatType;
  
  /** 卡片标题 */
  title: string;
  
  /** 格式名称（显示在输入框前） */
  format: string;
  
  /** 输入框占位符 */
  placeholder: string;
  
  /** 输出格式（转换为其他格式） */
  outputFormats: string[];
}
```

### 配置常量

#### `COLOR_FORMATS`

所有支持的颜色格式配置数组

```typescript
export const COLOR_FORMATS: ColorFormatConfig[] = [
  {
    type: 'hex',
    title: 'HEX 输入',
    format: 'HEX',
    placeholder: '#43ad7f',
    outputFormats: ['RGB', 'HSL', 'HSV'],
  },
  {
    type: 'rgb',
    title: 'RGB 输入',
    format: 'RGB',
    placeholder: 'rgb(67, 173, 127)',
    outputFormats: ['HEX', 'HSL', 'HSV'],
  },
  {
    type: 'hsl',
    title: 'HSL 输入',
    format: 'HSL',
    placeholder: 'hsl(154, 44.2%, 47.1%)',
    outputFormats: ['HEX', 'RGB', 'HSV'],
  },
  {
    type: 'hsv',
    title: 'HSV 输入',
    format: 'HSV',
    placeholder: 'hsv(154, 61.3%, 67.8%)',
    outputFormats: ['HEX', 'RGB', 'HSL'],
  },
];
```

#### `DEFAULT_COLOR`

默认颜色值（初始化和重置时使用）

```typescript
export const DEFAULT_COLOR = {
  hex: '#43ad7f',
  rgb: 'rgb(67, 173, 127)',
  hsl: 'hsl(154, 44.2%, 47.1%)',
  hsv: 'hsv(154, 61.3%, 67.8%)',
};
```

#### `DEFAULT_ALPHA`

默认透明度值

```typescript
export const DEFAULT_ALPHA = 1;
```

## 🔧 使用示例

### 基础用法

```typescript
import { COLOR_FORMATS, DEFAULT_COLOR, DEFAULT_ALPHA } from './constants';

// 获取所有格式配置
console.log(COLOR_FORMATS);
// [
//   { type: 'hex', title: 'HEX 输入', ... },
//   { type: 'rgb', title: 'RGB 输入', ... },
//   ...
// ]

// 使用默认颜色初始化
const colorInputs = reactive({
  hex: DEFAULT_COLOR.hex,
  rgb: DEFAULT_COLOR.rgb,
  hsl: DEFAULT_COLOR.hsl,
  hsv: DEFAULT_COLOR.hsv,
});

// 使用默认透明度
const alpha = ref(DEFAULT_ALPHA);
```

### 在组件中使用 v-for

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <ColorFormatCard
      v-for="formatConfig in COLOR_FORMATS"
      :key="formatConfig.type"
      :title="formatConfig.title"
      :format="formatConfig.format"
      :placeholder="formatConfig.placeholder"
      v-model="colorInputs[formatConfig.type]"
      :outputs="getOutputsArray(formatConfig.type)"
      @copy="copyText"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { COLOR_FORMATS, DEFAULT_COLOR } from './constants';

const colorInputs = reactive({
  hex: DEFAULT_COLOR.hex,
  rgb: DEFAULT_COLOR.rgb,
  hsl: DEFAULT_COLOR.hsl,
  hsv: DEFAULT_COLOR.hsv,
});
</script>
```

### 查找特定格式配置

```typescript
// 根据 type 查找配置
const hexConfig = COLOR_FORMATS.find(c => c.type === 'hex');
console.log(hexConfig?.title); // 'HEX 输入'

// 获取某个格式的输出格式列表
const rgbOutputs = COLOR_FORMATS.find(c => c.type === 'rgb')?.outputFormats;
console.log(rgbOutputs); // ['HEX', 'HSL', 'HSV']
```

### 遍历所有格式

```typescript
// 初始化所有格式的输入值
const initAllFormats = () => {
  COLOR_FORMATS.forEach(config => {
    colorInputs[config.type] = DEFAULT_COLOR[config.type];
  });
};

// 重置所有格式
const resetAllFormats = () => {
  Object.keys(DEFAULT_COLOR).forEach(key => {
    colorInputs[key as ColorFormatType] = DEFAULT_COLOR[key as ColorFormatType];
  });
};
```

## 🎯 扩展指南

### 添加新的颜色格式

假设要添加 CMYK 格式支持：

#### 1. 更新类型定义

```typescript
// 添加到 ColorFormatType
export type ColorFormatType = 'hex' | 'rgb' | 'hsl' | 'hsv' | 'cmyk';
```

#### 2. 添加配置项

```typescript
export const COLOR_FORMATS: ColorFormatConfig[] = [
  // ... 现有格式
  {
    type: 'cmyk',
    title: 'CMYK 输入',
    format: 'CMYK',
    placeholder: 'cmyk(0%, 0%, 0%, 100%)',
    outputFormats: ['HEX', 'RGB', 'HSL', 'HSV'],
  },
];
```

#### 3. 添加默认值

```typescript
export const DEFAULT_COLOR = {
  hex: '#43ad7f',
  rgb: 'rgb(67, 173, 127)',
  hsl: 'hsl(154, 44.2%, 47.1%)',
  hsv: 'hsv(154, 61.3%, 67.8%)',
  cmyk: 'cmyk(61%, 0%, 27%, 32%)', // 新增
};
```

#### 4. 实现转换函数

在 `transform.ts` 中添加：
```typescript
// 解析 CMYK
export function parseCmyk(cmyk: string): CmykColor | null {
  // 实现解析逻辑
}

// CMYK 转 RGB
export function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  // 实现转换算法
}

// RGB 转 CMYK
export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  // 实现转换算法
}
```

#### 5. 更新主组件逻辑

在 `index.vue` 的 `handleFormatInput()` 和 `getOutputsArray()` 中添加 CMYK 的处理逻辑：

```typescript
function handleFormatInput(formatType: ColorFormatType) {
  let rgb: RgbColor | null = null;
  
  switch (formatType) {
    // ... 现有格式处理
    case 'cmyk':
      const cmyk = parseCmyk(colorInputs.cmyk);
      if (cmyk) rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      break;
  }
  
  if (rgb) syncAllFormats(rgb);
}
```

#### 6. 测试新格式

```typescript
// 测试 CMYK 格式
const cmykInput = 'cmyk(0%, 100%, 100%, 0%)';
const cmykColor = parseCmyk(cmykInput);
console.log(cmykColor); // { c: 0, m: 100, y: 100, k: 0 }

const rgb = cmykToRgb(0, 100, 100, 0);
console.log(rgb); // { r: 255, g: 0, b: 0 } (红色)
```

### 修改现有格式配置

#### 修改占位符

```typescript
{
  type: 'hex',
  title: 'HEX 输入',
  format: 'HEX',
  placeholder: '#FF5733', // 修改为更明显的橙色
  outputFormats: ['RGB', 'HSL', 'HSV'],
}
```

#### 调整输出格式顺序

```typescript
{
  type: 'rgb',
  title: 'RGB 输入',
  format: 'RGB',
  placeholder: 'rgb(67, 173, 127)',
  outputFormats: ['HSL', 'HSV', 'HEX'], // 调整顺序：先 HSL，后 HEX
}
```

#### 修改标题和格式名称

```typescript
{
  type: 'hsl',
  title: 'HSL (色相/饱和度/亮度)', // 更详细的标题
  format: 'HSL',
  placeholder: 'hsl(154, 44.2%, 47.1%)',
  outputFormats: ['HEX', 'RGB', 'HSV'],
}
```

### 调整默认颜色

```typescript
// 修改为品牌主色
export const DEFAULT_COLOR = {
  hex: '#007AFF',
  rgb: 'rgb(0, 122, 255)',
  hsl: 'hsl(211, 100%, 50%)',
  hsv: 'hsv(211, 100%, 100%)',
};

// 修改默认透明度为半透明
export const DEFAULT_ALPHA = 0.8;
```

## 📊 配置项说明

### `type` - 格式类型

- **作用**：唯一标识符，用于内部逻辑判断
- **命名规则**：小写字母，简短明了
- **示例**：`'hex'`, `'rgb'`, `'hsl'`

### `title` - 卡片标题

- **作用**：显示在卡片顶部的标题
- **建议**：简洁明了，包含格式名称
- **示例**：`'HEX 输入'`, `'RGB 输入'`

### `format` - 格式名称

- **作用**：显示在输入框前的标签
- **建议**：使用大写缩写，2-4 个字符
- **示例**：`'HEX'`, `'RGB'`, `'CMYK'`

### `placeholder` - 输入占位符

- **作用**：输入框的示例文本
- **建议**：使用该格式的有效示例值
- **示例**：`'#43ad7f'`, `'rgb(67, 173, 127)'`

### `outputFormats` - 输出格式列表

- **作用**：定义该格式需要转换输出的其他格式
- **建议**：不包含自身，列出所有其他格式
- **示例**：`['RGB', 'HSL', 'HSV']`（HEX 的输出）

## 🔍 最佳实践

### 1. 保持类型一致性

确保 `type` 值与 `DEFAULT_COLOR` 对象的键一致：

```typescript
// ✅ 正确
type: 'hex'
DEFAULT_COLOR: { hex: '#43ad7f', ... }

// ❌ 错误
type: 'HEX'  // 大写
DEFAULT_COLOR: { hex: '#43ad7f', ... }  // 小写
```

### 2. 输出格式使用大写

`outputFormats` 中的格式名称应使用大写，与 `format` 保持一致：

```typescript
// ✅ 正确
outputFormats: ['RGB', 'HSL', 'HSV']

// ❌ 错误
outputFormats: ['rgb', 'hsl', 'hsv']
```

### 3. 提供有效的占位符

占位符应该是该格式的有效示例：

```typescript
// ✅ 正确
placeholder: 'rgb(67, 173, 127)'

// ❌ 错误
placeholder: 'rgb(r, g, b)'  // 不是有效值
```

### 4. 默认颜色的一致性

所有格式的默认颜色应该代表同一个颜色：

```typescript
// ✅ 正确 - 都代表 #43ad7f
DEFAULT_COLOR = {
  hex: '#43ad7f',
  rgb: 'rgb(67, 173, 127)',
  hsl: 'hsl(154, 44.2%, 47.1%)',
  hsv: 'hsv(154, 61.3%, 67.8%)',
};

// ❌ 错误 - 不同颜色
DEFAULT_COLOR = {
  hex: '#43ad7f',  // 绿色
  rgb: 'rgb(255, 0, 0)',  // 红色
  // ...
};
```

## 📝 注意事项

1. **类型安全**：
   - 使用 TypeScript 类型定义确保配置正确
   - 避免手动输入格式字符串，使用类型约束

2. **扩展性**：
   - 添加新格式时，确保更新所有相关配置
   - 保持配置的完整性和一致性

3. **性能考虑**：
   - `COLOR_FORMATS` 是静态常量，不会在运行时改变
   - 可以安全地在 `v-for` 中使用

4. **向后兼容**：
   - 修改现有格式配置时要考虑向后兼容
   - 新增格式不会影响现有功能

## 📚 相关文档

- [transform.ts API 文档](./transform.md) - 颜色转换函数库
- [ColorFormatCard 组件文档](./components/README.md) - 格式卡片组件
- [颜色转换工具使用说明](./README.md) - 工具整体文档

## 🔄 更新日志

### v1.0.0 (2026-01-27)
- 初始版本
- 支持 HEX、RGB、HSL、HSV 四种格式
- 配置化架构设计
- 类型安全的 TypeScript 定义
