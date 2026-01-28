# 颜色格式转换工具函数库

这个模块提供了完整的颜色格式转换功能，支持 HEX、RGB、HSL、HSV 等常用颜色格式之间的相互转换。

## 📦 导出内容

### 类型定义

```typescript
// RGB 颜色对象
interface RgbColor {
  r: number;  // 红色通道 (0-255)
  g: number;  // 绿色通道 (0-255)
  b: number;  // 蓝色通道 (0-255)
}

// HSL 颜色对象
interface HslColor {
  h: number;  // 色相 (0-360°)
  s: number;  // 饱和度 (0-100%)
  l: number;  // 亮度 (0-100%)
}

// HSV 颜色对象
interface HsvColor {
  h: number;  // 色相 (0-360°)
  s: number;  // 饱和度 (0-100%)
  v: number;  // 明度 (0-100%)
}
```

### 转换函数

#### HEX ↔ RGB

```typescript
// HEX 转 RGB
hexToRgb(hex: string): RgbColor | null

// RGB 转 HEX
rgbToHex(r: number, g: number, b: number): string
```

#### RGB ↔ HSL

```typescript
// RGB 转 HSL
rgbToHsl(r: number, g: number, b: number): HslColor

// HSL 转 RGB
hslToRgb(h: number, s: number, l: number): RgbColor
```

#### RGB ↔ HSV

```typescript
// RGB 转 HSV
rgbToHsv(r: number, g: number, b: number): HsvColor

// HSV 转 RGB
hsvToRgb(h: number, s: number, v: number): RgbColor
```

### 解析函数

```typescript
// 解析 RGB 字符串
parseRgb(rgb: string): RgbColor | null

// 解析 HSL 字符串
parseHsl(hsl: string): HslColor | null

// 解析 HSV 字符串
parseHsv(hsv: string): HsvColor | null

// HSV 字符串转 RGB 字符串（便捷函数）
hsvToRgbString(hsv: string): string
```

## 🚀 使用示例

### 基础转换

```typescript
import { hexToRgb, rgbToHex, rgbToHsl, rgbToHsv } from './transform';

// HEX 转 RGB
const rgb = hexToRgb('#43ad7f');
console.log(rgb); // { r: 67, g: 173, b: 127 }

// RGB 转 HEX
const hex = rgbToHex(67, 173, 127);
console.log(hex); // '#43ad7f'

// RGB 转 HSL
const hsl = rgbToHsl(67, 173, 127);
console.log(hsl); // { h: 154, s: 44.2, l: 47.1 }

// RGB 转 HSV
const hsv = rgbToHsv(67, 173, 127);
console.log(hsv); // { h: 154, s: 61.3, v: 67.8 }
```

### 字符串解析

```typescript
import { parseRgb, parseHsl, parseHsv } from './transform';

// 解析 RGB 字符串
const rgb = parseRgb('rgb(67, 173, 127)');
console.log(rgb); // { r: 67, g: 173, b: 127 }

// 解析 RGBA 字符串
const rgba = parseRgb('rgba(67, 173, 127, 0.8)');
console.log(rgba); // { r: 67, g: 173, b: 127 }

// 解析 HSL 字符串
const hsl = parseHsl('hsl(154, 44.2%, 47.1%)');
console.log(hsl); // { h: 154, s: 44.2, l: 47.1 }

// 解析 HSV 字符串
const hsv = parseHsv('hsv(154, 61.3%, 67.8%)');
console.log(hsv); // { h: 154, s: 61.3, v: 67.8 }
```

### 完整转换流程

```typescript
import { 
  hexToRgb, 
  rgbToHsl, 
  hslToRgb, 
  rgbToHex 
} from './transform';

// HEX → RGB → HSL → RGB → HEX
const originalHex = '#43ad7f';

// 1. HEX 转 RGB
const rgb1 = hexToRgb(originalHex);
console.log('RGB:', rgb1); // { r: 67, g: 173, b: 127 }

// 2. RGB 转 HSL
const hsl = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
console.log('HSL:', hsl); // { h: 154, s: 44.2, l: 47.1 }

// 3. HSL 转 RGB
const rgb2 = hslToRgb(hsl.h, hsl.s, hsl.l);
console.log('RGB:', rgb2); // { r: 67, g: 173, b: 127 }

// 4. RGB 转 HEX
const finalHex = rgbToHex(rgb2.r, rgb2.g, rgb2.b);
console.log('HEX:', finalHex); // '#43ad7f'
```

### 实际应用场景

```typescript
import { 
  parseRgb, 
  rgbToHsl, 
  hslToRgb, 
  rgbToHex 
} from './transform';

/**
 * 调整颜色亮度
 * @param color - RGB 字符串
 * @param amount - 亮度调整量 (-100 到 100)
 */
function adjustBrightness(color: string, amount: number): string {
  // 1. 解析 RGB
  const rgb = parseRgb(color);
  if (!rgb) return color;
  
  // 2. 转换为 HSL
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // 3. 调整亮度
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
  
  // 4. 转回 RGB
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  
  // 5. 转为 HEX
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// 使用示例
const originalColor = 'rgb(67, 173, 127)';
const lighter = adjustBrightness(originalColor, 20);  // 更亮
const darker = adjustBrightness(originalColor, -20);  // 更暗

console.log('原色:', originalColor);
console.log('更亮:', lighter);
console.log('更暗:', darker);
```

## 🎨 颜色空间说明

### HEX (十六进制)

- **格式**: `#RRGGBB`
- **范围**: `#000000` ~ `#FFFFFF`
- **特点**: 简洁、CSS 常用
- **应用**: Web 开发、设计稿

### RGB (红绿蓝)

- **格式**: `rgb(r, g, b)` 或 `rgba(r, g, b, a)`
- **范围**: r/g/b: 0~255, a: 0~1
- **特点**: 直观、支持透明度
- **应用**: 图像处理、显示器

### HSL (色相/饱和度/亮度)

- **格式**: `hsl(h, s%, l%)` 或 `hsla(h, s%, l%, a)`
- **范围**: h: 0~360°, s/l: 0~100%, a: 0~1
- **特点**: 符合人类感知、易于调整
- **应用**: 主题色调整、颜色过渡

### HSV (色相/饱和度/明度)

- **格式**: `hsv(h, s%, v%)`
- **范围**: h: 0~360°, s/v: 0~100%
- **特点**: 符合色彩选择器原理
- **应用**: 设计工具、图形软件

## 🔄 转换关系图

```
       ┌─────────┐
       │   HEX   │
       └────┬────┘
            │
       ┌────▼────┐
   ┌───┤   RGB   ├───┐
   │   └─────────┘   │
   │                 │
┌──▼──┐           ┌──▼──┐
│ HSL │           │ HSV │
└─────┘           └─────┘
```

所有转换都通过 RGB 作为中间格式：
- HEX ↔ RGB ↔ HSL
- HEX ↔ RGB ↔ HSV

## ⚠️ 注意事项

### 1. 精度损失

由于浮点数运算和四舍五入，在多次转换后可能会有微小的精度损失：

```typescript
// 可能的精度损失示例
const original = { r: 67, g: 173, b: 127 };
const hsl = rgbToHsl(67, 173, 127);
const back = hslToRgb(hsl.h, hsl.s, hsl.l);

console.log(original); // { r: 67, g: 173, b: 127 }
console.log(back);     // { r: 67, g: 173, b: 127 } (通常一致，但可能有±1的误差)
```

### 2. 输入验证

解析函数会验证输入格式，返回 `null` 表示解析失败：

```typescript
parseRgb('rgb(67, 173, 127)');  // ✅ 正确
parseRgb('invalid');             // ❌ 返回 null

hexToRgb('#43ad7f');            // ✅ 正确
hexToRgb('not-a-color');        // ❌ 返回 null
```

### 3. 透明度处理

- RGB/HSL 的解析函数会忽略 alpha 通道
- 如需保留透明度，需单独处理

```typescript
// 会忽略透明度
const rgb = parseRgb('rgba(67, 173, 127, 0.5)');
console.log(rgb); // { r: 67, g: 173, b: 127 } (alpha 被忽略)
```

## 📚 参考资料

- [MDN - CSS 颜色值](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)
- [RGB 颜色模型](https://en.wikipedia.org/wiki/RGB_color_model)
- [HSL 和 HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [颜色空间转换算法](https://www.rapidtables.com/convert/color/)

## 🧪 测试

```typescript
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './transform';

// 测试 HEX ↔ RGB
console.assert(hexToRgb('#ffffff').r === 255, 'HEX to RGB: White');
console.assert(rgbToHex(0, 0, 0) === '#000000', 'RGB to HEX: Black');

// 测试 RGB ↔ HSL
const red = rgbToHsl(255, 0, 0);
console.assert(red.h === 0 && red.s === 100, 'RGB to HSL: Red');

const redRgb = hslToRgb(0, 100, 50);
console.assert(redRgb.r === 255 && redRgb.g === 0 && redRgb.b === 0, 'HSL to RGB: Red');
```

## 🔧 维护指南

### 添加新格式

如需添加新的颜色格式（如 CMYK、LAB），遵循以下步骤：

1. 在 `transform.ts` 中添加类型定义
2. 实现与 RGB 的双向转换函数
3. 添加解析函数（如需要）
4. 更新文档和示例
5. 添加测试用例

### 代码风格

- 使用 JSDoc 注释
- 提供使用示例
- 明确返回类型
- 处理边界情况
- 保持函数纯净（无副作用）
