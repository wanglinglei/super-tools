export type ToolColor =
  | "blue"
  | "indigo"
  | "green"
  | "purple"
  | "pink"
  | "yellow";
import { ROUTER_NAME } from "@/router/constants";
export interface Tool {
  name: string;
  icon: string;
  title: string;
  description: string;
  routeName: string;
  color: ToolColor;
}

export interface ComingTool {
  name: string;
  icon: string;
  title: string;
  description: string;
}

/**
 * 编辑器工具列表
 */
export const editorTools: Tool[] = [
  {
    name: "json-editor",
    icon: "{ }",
    title: "JSON 编辑器",
    description: "在线编辑、格式化、校验 JSON 数据，支持智能修复常见错误",
    routeName: ROUTER_NAME.EDITOR_JSON,
    color: "blue",
  },
  {
    name: "markdown-editor",
    icon: "M↓",
    title: "Markdown 编辑器",
    description: "实时预览的 Markdown 编辑器，支持分屏和丰富的格式工具栏",
    routeName: ROUTER_NAME.EDITOR_MARKDOWN,
    color: "indigo",
  },
  {
    name: "flowchart-editor",
    icon: "💠",
    title: "流程图编辑器",
    description: "可视化流程图编辑器，支持拖拽节点、连线、导出 SVG/PNG",
    routeName: ROUTER_NAME.EDITOR_FLOWCHART,
    color: "green",
  },
];

/**
 * 地图工具列表
 */
export const mapTools: Tool[] = [
  {
    name: "distance",
    icon: "📏",
    title: "距离计算",
    description: "基于高德地图计算两点间的直线距离，支持点击选点和手动输入",
    routeName: ROUTER_NAME.MAP_DISTANCE,
    color: "green",
  },
  {
    name: "weather",
    icon: "🌤️",
    title: "天气查询",
    description: "点击地图任意位置查询该区域的实时天气和未来4天预报",
    routeName: ROUTER_NAME.MAP_WEATHER,
    color: "blue",
  },
];

/**
 * 图片工具列表
 */
export const imageTools: Tool[] = [
  {
    name: "image-crop",
    icon: "✂️",
    title: "图片裁剪",
    description: "在线图片裁剪工具，支持旋转、缩放、翻转和自定义比例",
    routeName: ROUTER_NAME.IMAGE_CROP,
    color: "pink",
  },
];

/**
 * 通用工具列表
 */
export const generalTools: Tool[] = [
  {
    name: "timestamp",
    icon: "⏰",
    title: "时间戳转换",
    description: "时间戳与日期时间互相转换，支持秒和毫秒，提供快捷预设",
    routeName: ROUTER_NAME.GENERAL_TIMESTAMP,
    color: "yellow",
  },
  {
    name: "qrcode",
    icon: "📱",
    title: "二维码工具",
    description: "生成和解码二维码，支持自定义颜色、大小和中心图标",
    routeName: ROUTER_NAME.GENERAL_QRCODE,
    color: "purple",
  },
  {
    name: "excel2json",
    icon: "📊",
    title: "Excel 转 JSON",
    description: "将 Excel 文件转换为 JSON 格式，支持自定义选择字段",
    routeName: ROUTER_NAME.GENERAL_EXCEL2JSON,
    color: "green",
  },
  {
    name: "color",
    icon: "🎨",
    title: "颜色转换",
    description: "支持 RGB、HEX、HSL、HSV 等颜色格式的相互转换",
    routeName: ROUTER_NAME.GENERAL_COLOR,
    color: "pink",
  },
  {
    name: "diff",
    icon: "📄",
    title: "文本 Diff",
    description: "对比两段文本的差异，支持统一视图和并排视图，高亮显示变更",
    routeName: ROUTER_NAME.GENERAL_DIFF,
    color: "indigo",
  },
  {
    name: "cron",
    icon: "⏰",
    title: "Cron 表达式",
    description: "Cron 表达式解析与生成，支持最近运行时间预览",
    routeName: ROUTER_NAME.GENERAL_CRON,
    color: "blue",
  },
  {
    name: "geojson2svg",
    icon: "🗺️",
    title: "GeoJSON 转 SVG",
    description: "将 GeoJSON 要素转换为 SVG 矢量图，支持样式配置与下载",
    routeName: ROUTER_NAME.GENERAL_GEOJSON2SVG,
    color: "indigo",
  },
  {
    name: "coordinate",
    icon: "📍",
    title: "坐标系转换",
    description: "支持 WGS84、GCJ-02、BD-09 三种坐标系互相转换",
    routeName: ROUTER_NAME.GENERAL_COORDINATE,
    color: "blue",
  },
];

/**
 * 编码工具列表
 */
export const codeTools: Tool[] = [
  {
    name: "regex-tester",
    icon: "🔍",
    title: "正则测试",
    description: "在线测试和调试正则表达式，支持匹配结果预览和常用正则模板",
    routeName: ROUTER_NAME.CODE_REGEX,
    color: "indigo",
  },
  {
    name: "url-parser",
    icon: "🔗",
    title: "URL 编解码",
    description: "URL 编码和解码工具，支持多种编码方式和常用示例",
    routeName: ROUTER_NAME.CODE_URL_PARSER,
    color: "blue",
  },
  {
    name: "base64",
    icon: "🔐",
    title: "Base64 编解码",
    description: "文本和图片的 Base64 编码解码，支持 UTF-8 和多种图片格式",
    routeName: ROUTER_NAME.CODE_BASE64,
    color: "purple",
  },
  {
    name: "jwt",
    icon: "🔐",
    title: "JWT 解码",
    description: "JWT Token 解码工具，查看 Header、Payload 及过期时间",
    routeName: ROUTER_NAME.CODE_JWT,
    color: "green",
  },
];

/**
 * 即将推出的工具列表
 */
export const comingTools: ComingTool[] = [
  {
    name: "html-editor",
    icon: "</>",
    title: "HTML 编辑器",
    description: "在线编辑和预览 HTML 代码",
  },
  {
    name: "sql-formatter",
    icon: "SQL",
    title: "SQL 格式化",
    description: "格式化和美化 SQL 语句",
  },
  {
    name: "unit-converter",
    icon: "🔄",
    title: "单位转换",
    description: "长度、重量、温度等单位快速转换",
  },
];

/**
 * 工具分类颜色类型
 */
export type SectionColor =
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "red"
  | "pink"
  | "indigo";

/**
 * 工具分类卡片类型
 */
export type CardType = "tool" | "coming";

/**
 * 工具分类配置接口
 */
export interface ToolSection {
  id: string;
  title: string;
  accentColor: SectionColor;
  cardType: CardType;
  tools: Tool[] | ComingTool[];
}

/**
 * 工具分类配置列表
 * 用于在首页通过 v-for 渲染各个工具分类
 */
export const toolSections: ToolSection[] = [
  {
    id: "editor",
    title: "📝 编辑器工具",
    accentColor: "blue",
    cardType: "tool",
    tools: editorTools,
  },
  {
    id: "map",
    title: "🗺️ 地图工具",
    accentColor: "green",
    cardType: "tool",
    tools: mapTools,
  },
  {
    id: "image",
    title: "🖼️ 图片工具",
    accentColor: "pink",
    cardType: "tool",
    tools: imageTools,
  },
  {
    id: "code",
    title: "💻 编码工具",
    accentColor: "indigo",
    cardType: "tool",
    tools: codeTools,
  },
  {
    id: "general",
    title: "🔧 通用工具",
    accentColor: "yellow",
    cardType: "tool",
    tools: generalTools,
  },
  {
    id: "coming",
    title: "🚀 更多工具",
    accentColor: "purple",
    cardType: "coming",
    tools: comingTools,
  },
];
