/**
 * 颜色格式配置
 */

/**
 * 颜色格式类型
 */
export type ColorFormatType = 'hex' | 'rgb' | 'hsl' | 'hsv';

/**
 * 颜色格式配置项
 */
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

/**
 * 所有支持的颜色格式配置
 */
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

/**
 * 默认颜色值
 */
export const DEFAULT_COLOR = {
  hex: '#43ad7f',
  rgb: 'rgb(67, 173, 127)',
  hsl: 'hsl(154, 44.2%, 47.1%)',
  hsv: 'hsv(154, 61.3%, 67.8%)',
};

/**
 * 默认透明度
 */
export const DEFAULT_ALPHA = 1;
