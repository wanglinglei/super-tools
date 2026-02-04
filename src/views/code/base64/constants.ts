/**
 * Base64 编解码工具常量配置
 */

/**
 * 编码模式选项
 */
export const ENCODE_MODES = [
  {
    value: "text",
    label: "文本",
    description: "对文本内容进行 Base64 编解码",
  },
  {
    value: "image",
    label: "图片",
    description: "将图片转换为 Base64 或解码 Base64 图片",
  },
] as const;

export type EncodeMode = (typeof ENCODE_MODES)[number]["value"];

/**
 * 文本编码选项
 */
export const TEXT_ENCODE_OPTIONS = [
  {
    value: "utf8",
    label: "UTF-8",
    description: "标准 UTF-8 编码，支持中文等多语言字符",
  },
  {
    value: "ascii",
    label: "ASCII",
    description: "仅支持英文和基本符号",
  },
] as const;

export type TextEncodeOption = (typeof TEXT_ENCODE_OPTIONS)[number]["value"];

/**
 * 常用示例
 */
export interface Base64Example {
  name: string;
  original: string;
  encoded: string;
  description?: string;
}

export const BASE64_EXAMPLES: Base64Example[] = [
  {
    name: "Hello World",
    original: "Hello World",
    encoded: "SGVsbG8gV29ybGQ=",
    description: "最简单的英文示例",
  },
  {
    name: "中文文本",
    original: "你好，世界！",
    encoded: "5L2g5aW977yM5LiW55WM77yB",
    description: "UTF-8 编码的中文文本",
  },
  {
    name: "JSON 数据",
    original: '{"name":"test","value":123}',
    encoded: "eyJuYW1lIjoidGVzdCIsInZhbHVlIjoxMjN9",
    description: "JSON 格式数据",
  },
  {
    name: "URL 地址",
    original: "https://example.com/path?query=value",
    encoded: "aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoP3F1ZXJ5PXZhbHVl",
    description: "完整的 URL 地址",
  },
  {
    name: "特殊字符",
    original: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
    encoded: "IUAjJCVeJiooKV8rLT1bXXt9fDsnOiIsLi88Pj8=",
    description: "包含各种特殊字符",
  },
  {
    name: "多行文本",
    original: "第一行\n第二行\n第三行",
    encoded: "56ys5LiA6KGMCuesrOS6jOihjArnrKzkuInooYw=",
    description: "包含换行符的多行文本",
  },
];

/**
 * Base64 字符表
 */
export const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Base64 相关知识点
 */
export const BASE64_INFO = [
  {
    title: "什么是 Base64？",
    content:
      "Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式，常用于在文本环境中传输二进制数据。",
  },
  {
    title: "编码原理",
    content:
      "将每 3 个字节（24 位）分成 4 组，每组 6 位，然后映射到 64 个字符中的一个。不足 3 字节时用 = 填充。",
  },
  {
    title: "常见用途",
    content:
      "邮件附件传输、在 URL/Cookie 中嵌入数据、Data URI（内联图片）、JWT Token 等。",
  },
  {
    title: "编码后大小",
    content: "Base64 编码后的数据大小约为原始数据的 4/3 倍（约增加 33%）。",
  },
];

/**
 * 支持的图片格式
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/x-icon",
];

/**
 * 图片格式信息
 */
export const IMAGE_FORMAT_INFO = [
  { format: "PNG", mime: "image/png", description: "无损压缩，支持透明" },
  { format: "JPEG", mime: "image/jpeg", description: "有损压缩，适合照片" },
  { format: "GIF", mime: "image/gif", description: "支持动画和透明" },
  { format: "WebP", mime: "image/webp", description: "现代格式，体积小" },
  { format: "SVG", mime: "image/svg+xml", description: "矢量图，可无限缩放" },
];
