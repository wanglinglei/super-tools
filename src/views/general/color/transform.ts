/**
 * 颜色格式转换工具函数集
 * 
 * 支持以下颜色格式的相互转换：
 * - HEX (十六进制): #RRGGBB
 * - RGB (红绿蓝): rgb(r, g, b) / rgba(r, g, b, a)
 * - HSL (色相/饱和度/亮度): hsl(h, s%, l%) / hsla(h, s%, l%, a)
 * - HSV (色相/饱和度/明度): hsv(h, s%, v%)
 * 
 * @module color/transform
 */

/**
 * RGB 颜色对象
 * @typedef {Object} RgbColor
 * @property {number} r - 红色通道值 (0-255)
 * @property {number} g - 绿色通道值 (0-255)
 * @property {number} b - 蓝色通道值 (0-255)
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL 颜色对象
 * @typedef {Object} HslColor
 * @property {number} h - 色相 (0-360°)
 * @property {number} s - 饱和度 (0-100%)
 * @property {number} l - 亮度 (0-100%)
 */
export interface HslColor {
  h: number;
  s: number;
  l: number;
}

/**
 * HSV 颜色对象
 * @typedef {Object} HsvColor
 * @property {number} h - 色相 (0-360°)
 * @property {number} s - 饱和度 (0-100%)
 * @property {number} v - 明度 (0-100%)
 */
export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

// ==================== HEX ↔ RGB 转换 ====================

/**
 * 将 HEX 颜色值转换为 RGB 格式
 * 
 * @param {string} hex - HEX 颜色值，支持 #RRGGBB 或 RRGGBB 格式
 * @returns {RgbColor | null} RGB 颜色对象，解析失败返回 null
 * 
 * @example
 * hexToRgb('#43ad7f'); // { r: 67, g: 173, b: 127 }
 * hexToRgb('43ad7f');  // { r: 67, g: 173, b: 127 }
 * hexToRgb('#xyz');    // null
 */
export function hexToRgb(hex: string): RgbColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * 将 RGB 颜色值转换为 HEX 格式
 * 
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {string} HEX 颜色值，格式为 #RRGGBB
 * 
 * @example
 * rgbToHex(67, 173, 127);  // '#43ad7f'
 * rgbToHex(255, 0, 0);     // '#ff0000'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// ==================== RGB ↔ HSL 转换 ====================

/**
 * 将 RGB 颜色值转换为 HSL 格式
 * 
 * 算法基于 CSS 标准的 RGB 到 HSL 转换公式
 * 
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {HslColor} HSL 颜色对象
 * 
 * @example
 * rgbToHsl(67, 173, 127);  // { h: 154, s: 44.2, l: 47.1 }
 * rgbToHsl(255, 0, 0);     // { h: 0, s: 100, l: 50 }
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  // 归一化到 0-1 范围
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    // 计算饱和度
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // 计算色相
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100 * 10) / 10,
    l: Math.round(l * 100 * 10) / 10,
  };
}

/**
 * 将 HSL 颜色值转换为 RGB 格式
 * 
 * 算法基于 CSS 标准的 HSL 到 RGB 转换公式
 * 
 * @param {number} h - 色相 (0-360°)
 * @param {number} s - 饱和度 (0-100%)
 * @param {number} l - 亮度 (0-100%)
 * @returns {RgbColor} RGB 颜色对象
 * 
 * @example
 * hslToRgb(154, 44.2, 47.1);  // { r: 67, g: 173, b: 127 }
 * hslToRgb(0, 100, 50);       // { r: 255, g: 0, b: 0 }
 */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  // 归一化到 0-1 范围
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    // 无饱和度时为灰色
    r = g = b = l;
  } else {
    /**
     * HSL 到 RGB 的辅助函数
     * @param {number} p - 计算参数 p
     * @param {number} q - 计算参数 q
     * @param {number} t - 色相分量
     * @returns {number} RGB 分量值
     */
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ==================== RGB ↔ HSV 转换 ====================

/**
 * 将 RGB 颜色值转换为 HSV 格式
 * 
 * HSV (Hue, Saturation, Value) 色彩模型更接近人类对颜色的感知
 * 
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {HsvColor} HSV 颜色对象
 * 
 * @example
 * rgbToHsv(67, 173, 127);  // { h: 154, s: 61.3, v: 67.8 }
 * rgbToHsv(255, 0, 0);     // { h: 0, s: 100, v: 100 }
 */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  // 归一化到 0-1 范围
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    // 计算色相
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100 * 10) / 10,
    v: Math.round(v * 100 * 10) / 10,
  };
}

/**
 * 将 HSV 颜色值转换为 RGB 格式
 * 
 * 算法基于 HSV 色彩空间到 RGB 的标准转换公式
 * 
 * @param {number} h - 色相 (0-360°)
 * @param {number} s - 饱和度 (0-100%)
 * @param {number} v - 明度 (0-100%)
 * @returns {RgbColor} RGB 颜色对象
 * 
 * @example
 * hsvToRgb(154, 61.3, 67.8);  // { r: 67, g: 173, b: 127 }
 * hsvToRgb(0, 100, 100);      // { r: 255, g: 0, b: 0 }
 */
export function hsvToRgb(h: number, s: number, v: number): RgbColor {
  // 归一化到 0-1 范围
  h /= 360;
  s /= 100;
  v /= 100;

  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  // 根据色相区间计算 RGB 值
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = g = b = 0;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ==================== 颜色字符串解析函数 ====================

/**
 * 解析 RGB/RGBA 颜色字符串
 * 
 * @param {string} rgb - RGB 颜色字符串，支持 rgb(r, g, b) 或 rgba(r, g, b, a) 格式
 * @returns {RgbColor | null} RGB 颜色对象，解析失败返回 null
 * 
 * @example
 * parseRgb('rgb(67, 173, 127)');      // { r: 67, g: 173, b: 127 }
 * parseRgb('rgba(67, 173, 127, 0.5)'); // { r: 67, g: 173, b: 127 }
 * parseRgb('invalid');                 // null
 */
export function parseRgb(rgb: string): RgbColor | null {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match || !match[1] || !match[2] || !match[3]) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
  };
}

/**
 * 解析 HSL/HSLA 颜色字符串
 * 
 * @param {string} hsl - HSL 颜色字符串，支持 hsl(h, s%, l%) 或 hsla(h, s%, l%, a) 格式
 * @returns {HslColor | null} HSL 颜色对象，解析失败返回 null
 * 
 * @example
 * parseHsl('hsl(154, 44.2%, 47.1%)');      // { h: 154, s: 44.2, l: 47.1 }
 * parseHsl('hsla(154, 44.2%, 47.1%, 0.5)'); // { h: 154, s: 44.2, l: 47.1 }
 * parseHsl('invalid');                      // null
 */
export function parseHsl(hsl: string): HslColor | null {
  const match = hsl.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%/);
  if (!match || !match[1] || !match[2] || !match[3]) return null;
  return {
    h: parseInt(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

/**
 * 解析 HSV 颜色字符串
 * 
 * @param {string} hsv - HSV 颜色字符串，格式为 hsv(h, s%, v%)
 * @returns {HsvColor | null} HSV 颜色对象，解析失败返回 null
 * 
 * @example
 * parseHsv('hsv(154, 61.3%, 67.8%)');  // { h: 154, s: 61.3, v: 67.8 }
 * parseHsv('invalid');                 // null
 */
export function parseHsv(hsv: string): HsvColor | null {
  const match = hsv.match(/hsv\((\d+),\s*([\d.]+)%,\s*([\d.]+)%/);
  if (!match || !match[1] || !match[2] || !match[3]) return null;
  return {
    h: parseInt(match[1]),
    s: parseFloat(match[2]),
    v: parseFloat(match[3]),
  };
}

// ==================== 辅助函数 ====================

/**
 * 将 HSV 颜色字符串转换为 RGB 字符串
 * 
 * 这是一个便捷函数，用于直接从 HSV 字符串获取 RGB 字符串
 * 
 * @param {string} hsv - HSV 颜色字符串，格式为 hsv(h, s%, v%)
 * @returns {string} RGB 颜色字符串，格式为 rgb(r, g, b)，解析失败返回空字符串
 * 
 * @example
 * hsvToRgbString('hsv(154, 61.3%, 67.8%)');  // 'rgb(67, 173, 127)'
 * hsvToRgbString('invalid');                 // ''
 */
export function hsvToRgbString(hsv: string): string {
  const parsed = parseHsv(hsv);
  if (!parsed) return '';
  const rgb = hsvToRgb(parsed.h, parsed.s, parsed.v);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
