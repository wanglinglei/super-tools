/**
 * 编码选项配置
 */
export interface EncodeOption {
  value: string;
  label: string;
  description: string;
}

/**
 * URL 示例配置
 */
export interface UrlExample {
  name: string;
  original: string;
  encoded: string;
}

/**
 * 编码规则说明
 */
export interface EncodeRule {
  char: string;
  description: string;
  encoded: string;
}

/**
 * 保留字符配置
 */
export interface ReservedChar {
  char: string;
  encoded: string;
  description: string;
}

/**
 * 编码类型选项
 */
export const ENCODE_OPTIONS: EncodeOption[] = [
  {
    value: 'encodeURIComponent',
    label: 'encodeURIComponent',
    description: '编码所有字符（推荐）',
  },
  {
    value: 'encodeURI',
    label: 'encodeURI',
    description: '保留 URL 结构字符',
  },
  {
    value: 'escape',
    label: 'escape',
    description: '旧版编码（不推荐）',
  },
];

/**
 * 常用 URL 示例
 */
export const URL_EXAMPLES: UrlExample[] = [
  {
    name: '中文参数',
    original: 'https://example.com?name=张三&age=20',
    encoded: 'https://example.com?name=%E5%BC%A0%E4%B8%89&age=20',
  },
  {
    name: '特殊字符',
    original: 'hello world!@#$%^&*()',
    encoded: 'hello%20world!%40%23%24%25%5E%26*()',
  },
  {
    name: '邮箱地址',
    original: 'user+test@example.com',
    encoded: 'user%2Btest%40example.com',
  },
  {
    name: '空格和符号',
    original: '你好 世界！',
    encoded: '%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C%EF%BC%81',
  },
  {
    name: 'JSON 字符串',
    original: '{"name":"张三","age":20}',
    encoded: '%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22age%22%3A20%7D',
  },
  {
    name: 'URL 路径',
    original: '/api/user/张三/profile',
    encoded: '/api/user/%E5%BC%A0%E4%B8%89/profile',
  },
];

/**
 * 编码规则说明
 */
export const ENCODE_RULES: EncodeRule[] = [
  {
    char: '空格',
    description: '空格符',
    encoded: '%20 或 +',
  },
  {
    char: '!',
    description: '感叹号',
    encoded: '%21',
  },
  {
    char: '#',
    description: '井号（锚点）',
    encoded: '%23',
  },
  {
    char: '$',
    description: '美元符号',
    encoded: '%24',
  },
  {
    char: '%',
    description: '百分号',
    encoded: '%25',
  },
  {
    char: '&',
    description: '与符号（参数分隔）',
    encoded: '%26',
  },
  {
    char: "'",
    description: '单引号',
    encoded: '%27',
  },
  {
    char: '(',
    description: '左括号',
    encoded: '%28',
  },
  {
    char: ')',
    description: '右括号',
    encoded: '%29',
  },
  {
    char: '*',
    description: '星号',
    encoded: '%2A',
  },
  {
    char: '+',
    description: '加号',
    encoded: '%2B',
  },
  {
    char: ',',
    description: '逗号',
    encoded: '%2C',
  },
  {
    char: '/',
    description: '斜杠（路径分隔）',
    encoded: '%2F',
  },
  {
    char: ':',
    description: '冒号（协议分隔）',
    encoded: '%3A',
  },
  {
    char: ';',
    description: '分号',
    encoded: '%3B',
  },
  {
    char: '=',
    description: '等号（参数赋值）',
    encoded: '%3D',
  },
  {
    char: '?',
    description: '问号（查询字符串开始）',
    encoded: '%3F',
  },
  {
    char: '@',
    description: '@符号',
    encoded: '%40',
  },
  {
    char: '[',
    description: '左方括号',
    encoded: '%5B',
  },
  {
    char: ']',
    description: '右方括号',
    encoded: '%5D',
  },
];

/**
 * URL 保留字符
 */
export const RESERVED_CHARS: ReservedChar[] = [
  { char: ':', encoded: '%3A', description: '协议分隔符' },
  { char: '/', encoded: '%2F', description: '路径分隔符' },
  { char: '?', encoded: '%3F', description: '查询字符串' },
  { char: '#', encoded: '%23', description: '锚点/片段' },
  { char: '[', encoded: '%5B', description: '左方括号' },
  { char: ']', encoded: '%5D', description: '右方括号' },
  { char: '@', encoded: '%40', description: '用户信息' },
  { char: '!', encoded: '%21', description: '子分隔符' },
  { char: '$', encoded: '%24', description: '子分隔符' },
  { char: '&', encoded: '%26', description: '参数分隔符' },
  { char: "'", encoded: '%27', description: '单引号' },
  { char: '(', encoded: '%28', description: '左括号' },
  { char: ')', encoded: '%29', description: '右括号' },
  { char: '*', encoded: '%2A', description: '星号' },
  { char: '+', encoded: '%2B', description: '加号' },
  { char: ',', encoded: '%2C', description: '逗号' },
  { char: ';', encoded: '%3B', description: '分号' },
  { char: '=', encoded: '%3D', description: '等号' },
];
