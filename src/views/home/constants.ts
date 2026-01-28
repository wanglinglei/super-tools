export type ToolColor = "blue" | "indigo" | "green" | "purple" | "pink" | "yellow";

export interface Tool {
  name: string;
  icon: string;
  title: string;
  description: string;
  route: string;
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
    route: "/editor/json",
    color: "blue",
  },
  {
    name: "markdown-editor",
    icon: "M↓",
    title: "Markdown 编辑器",
    description: "实时预览的 Markdown 编辑器，支持分屏和丰富的格式工具栏",
    route: "/editor/markdown",
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
    route: "/map/distance",
    color: "green",
  },
  {
    name: "weather",
    icon: "🌤️",
    title: "天气查询",
    description: "点击地图任意位置查询该区域的实时天气和未来4天预报",
    route: "/map/weather",
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
    route: "/general/timestamp",
    color: "yellow",
  },
  {
    name: "qrcode",
    icon: "📱",
    title: "二维码工具",
    description: "生成和解码二维码，支持自定义颜色、大小和中心图标",
    route: "/general/qrcode",
    color: "purple",
  },
  {
    name: "excel2json",
    icon: "📊",
    title: "Excel 转 JSON",
    description: "将 Excel 文件转换为 JSON 格式，支持自定义选择字段",
    route: "/general/excel2json",
    color: "green",
  },
  {
    name: "color",
    icon: "🎨",
    title: "颜色转换",
    description: "支持 RGB、HEX、HSL、HSV 等颜色格式的相互转换",
    route: "/general/color",
    color: "pink",
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
  {
    name: "regex-tester",
    icon: "🔍",
    title: "正则测试",
    description: "在线测试和调试正则表达式",
  },
];
