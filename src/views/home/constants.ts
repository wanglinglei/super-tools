export type ToolColor = "blue" | "indigo" | "green" | "purple" | "pink" | "yellow";
import { ROUTER_NAME } from '@/router/constants';
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
    routeName: "code-regex",
    color: "indigo",
  },
  {
    name: "url-parser",
    icon: "🔗",
    title: "URL 编解码",
    description: "URL 编码和解码工具，支持多种编码方式和常用示例",
    routeName: "code-url-parser",
    color: "blue",
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
  {
    name: "base64",
    icon: "🔐",
    title: "Base64 编解码",
    description: "文本和图片的 Base64 编码解码",
  },
];

/**
 * 工具分类颜色类型
 */
export type SectionColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'pink' | 'indigo';

/**
 * 工具分类卡片类型
 */
export type CardType = 'tool' | 'coming';

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
    id: 'editor',
    title: '📝 编辑器工具',
    accentColor: 'blue',
    cardType: 'tool',
    tools: editorTools,
  },
  {
    id: 'map',
    title: '🗺️ 地图工具',
    accentColor: 'green',
    cardType: 'tool',
    tools: mapTools,
  },
  {
    id: 'code',
    title: '💻 编码工具',
    accentColor: 'indigo',
    cardType: 'tool',
    tools: codeTools,
  },
  {
    id: 'general',
    title: '🔧 通用工具',
    accentColor: 'yellow',
    cardType: 'tool',
    tools: generalTools,
  },
  {
    id: 'coming',
    title: '🚀 更多工具',
    accentColor: 'purple',
    cardType: 'coming',
    tools: comingTools,
  },
];
