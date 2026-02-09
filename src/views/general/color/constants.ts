/**
 * 颜色格式配置
 */

/**
 * 颜色格式类型
 */
export type ColorFormatType = "hex" | "rgb" | "hsl" | "hsv";

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
    type: "hex",
    title: "HEX 输入",
    format: "HEX",
    placeholder: "#43ad7f",
    outputFormats: ["RGB", "HSL", "HSV"],
  },
  {
    type: "rgb",
    title: "RGB 输入",
    format: "RGB",
    placeholder: "rgb(67, 173, 127)",
    outputFormats: ["HEX", "HSL", "HSV"],
  },
  {
    type: "hsl",
    title: "HSL 输入",
    format: "HSL",
    placeholder: "hsl(154, 44.2%, 47.1%)",
    outputFormats: ["HEX", "RGB", "HSV"],
  },
  {
    type: "hsv",
    title: "HSV 输入",
    format: "HSV",
    placeholder: "hsv(154, 61.3%, 67.8%)",
    outputFormats: ["HEX", "RGB", "HSL"],
  },
];

/**
 * 默认颜色值
 */
export const DEFAULT_COLOR = {
  hex: "#43ad7f",
  rgb: "rgb(67, 173, 127)",
  hsl: "hsl(154, 44.2%, 47.1%)",
  hsv: "hsv(154, 61.3%, 67.8%)",
};

/**
 * 默认透明度
 */
export const DEFAULT_ALPHA = 1;

// ==================== 渐变色相关 ====================

/**
 * 渐变类型
 */
export type GradientType = "linear" | "radial" | "conic";

/**
 * 渐变类型选项
 */
export const GRADIENT_TYPES: { value: GradientType; label: string }[] = [
  { value: "linear", label: "线性" },
  { value: "radial", label: "径向" },
  { value: "conic", label: "锥形" },
];

/**
 * 径向渐变位置选项
 */
export const RADIAL_POSITIONS: { value: string; label: string }[] = [
  { value: "center", label: "中心" },
  { value: "top", label: "上" },
  { value: "right", label: "右" },
  { value: "bottom", label: "下" },
  { value: "left", label: "左" },
  { value: "top left", label: "左上" },
  { value: "top right", label: "右上" },
  { value: "bottom left", label: "左下" },
  { value: "bottom right", label: "右下" },
];

/**
 * 色标接口
 */
export interface ColorStop {
  color: string;
  position: number;
}

/**
 * 渐变预设接口
 */
export interface GradientPreset {
  name: string;
  icon: string;
  type: GradientType;
  angle: number;
  stops: ColorStop[];
}

/**
 * 快捷角度列表
 */
export const QUICK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * 默认渐变色标
 */
export const DEFAULT_GRADIENT_STOPS: ColorStop[] = [
  { color: "#667eea", position: 0 },
  { color: "#764ba2", position: 100 },
];

/**
 * 渐变预设列表
 */
export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    name: "日落",
    icon: "🌅",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#f093fb", position: 0 },
      { color: "#f5576c", position: 100 },
    ],
  },
  {
    name: "海洋",
    icon: "🌊",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 },
    ],
  },
  {
    name: "森林",
    icon: "🌿",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#11998e", position: 0 },
      { color: "#38ef7d", position: 100 },
    ],
  },
  {
    name: "火焰",
    icon: "🔥",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#f12711", position: 0 },
      { color: "#f5af19", position: 100 },
    ],
  },
  {
    name: "樱花",
    icon: "🌸",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#fbc2eb", position: 0 },
      { color: "#a6c1ee", position: 100 },
    ],
  },
  {
    name: "星空",
    icon: "🌙",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#0f0c29", position: 0 },
      { color: "#302b63", position: 50 },
      { color: "#24243e", position: 100 },
    ],
  },
  {
    name: "柑橘",
    icon: "🍊",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#f7971e", position: 0 },
      { color: "#ffd200", position: 100 },
    ],
  },
  {
    name: "极光",
    icon: "✨",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#00c6fb", position: 0 },
      { color: "#005bea", position: 100 },
    ],
  },
  {
    name: "彩虹",
    icon: "🌈",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#ff0000", position: 0 },
      { color: "#ff8800", position: 20 },
      { color: "#ffff00", position: 40 },
      { color: "#00cc00", position: 60 },
      { color: "#0066ff", position: 80 },
      { color: "#8b00ff", position: 100 },
    ],
  },
  {
    name: "薄荷",
    icon: "🍃",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#00b09b", position: 0 },
      { color: "#96c93d", position: 100 },
    ],
  },
  {
    name: "宇宙",
    icon: "🪐",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#fc5c7d", position: 0 },
      { color: "#6a82fb", position: 100 },
    ],
  },
  {
    name: "漩涡",
    icon: "🌀",
    type: "conic",
    angle: 0,
    stops: [
      { color: "#fd746c", position: 0 },
      { color: "#ff9068", position: 50 },
      { color: "#fd746c", position: 100 },
    ],
  },
];

/**
 * 生成渐变 CSS 值
 */
export function getGradientCSS(
  type: GradientType,
  stops: ColorStop[],
  angle: number,
  radialPosition: string
): string {
  const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");

  switch (type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    case "radial":
      return `radial-gradient(circle at ${radialPosition}, ${stopsStr})`;
    case "conic":
      return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }
}
