/**
 * 正则表达式修饰符配置
 */
export interface RegexFlag {
  value: string;
  label: string;
}

/**
 * 常用正则表达式配置
 */
export interface CommonRegex {
  name: string;
  pattern: string;
  example?: string;
}

/**
 * 正则表达式符号说明
 */
export interface RegexSymbol {
  symbol: string;
  description: string;
  example?: string;
}

/**
 * 正则表达式修饰符列表
 */
export const REGEX_FLAGS: RegexFlag[] = [
  { value: 'g', label: '全局匹配' },
  { value: 'i', label: '忽略大小写' },
  { value: 'm', label: '多行匹配' },
  { value: 's', label: '点号匹配所有字符' },
  { value: 'u', label: 'Unicode 模式' },
];

/**
 * 常用正则表达式库
 */
export const COMMON_REGEX: CommonRegex[] = [
  {
    name: '手机号码',
    pattern: '^1[3-9]\\d{9}$',
    example: '13812345678',
  },
  {
    name: '邮箱地址',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    example: 'example@email.com',
  },
  {
    name: '身份证号',
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',
    example: '110101199001011234',
  },
  {
    name: 'URL 链接',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    example: 'https://www.example.com',
  },
  {
    name: 'IPv4 地址',
    pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    example: '192.168.1.1',
  },
  {
    name: '中文字符',
    pattern: '^[\\u4e00-\\u9fa5]+$',
    example: '你好世界',
  },
  {
    name: '日期 YYYY-MM-DD',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    example: '2024-01-28',
  },
  {
    name: '时间 HH:mm:ss',
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$',
    example: '23:59:59',
  },
  {
    name: '整数',
    pattern: '^-?\\d+$',
    example: '-123 或 456',
  },
  {
    name: '小数',
    pattern: '^-?\\d+\\.\\d+$',
    example: '3.14 或 -0.5',
  },
  {
    name: '邮政编码',
    pattern: '^\\d{6}$',
    example: '100000',
  },
  {
    name: '用户名',
    pattern: '^[a-zA-Z0-9_-]{4,16}$',
    example: 'user_name123',
  },
  {
    name: '密码强度（中等）',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
    example: '至少8位，含大小写字母和数字',
  },
  {
    name: '十六进制颜色',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    example: '#FF5733 或 #F73',
  },
  {
    name: 'HTML 标签',
    pattern: '<[^>]+>',
    example: '<div> 或 <p class="text">',
  },
  {
    name: '银行卡号',
    pattern: '^\\d{16,19}$',
    example: '6222000000000000',
  },
];

/**
 * 正则表达式符号说明库
 */
export const REGEX_SYMBOLS: RegexSymbol[] = [
  { symbol: '.', description: '匹配任意单个字符（除换行符）', example: 'a.c 匹配 abc, a1c' },
  { symbol: '^', description: '匹配字符串开头', example: '^hello 匹配以hello开头' },
  { symbol: '$', description: '匹配字符串结尾', example: 'world$ 匹配以world结尾' },
  { symbol: '*', description: '匹配前面的字符0次或多次', example: 'ab*c 匹配 ac, abc, abbc' },
  { symbol: '+', description: '匹配前面的字符1次或多次', example: 'ab+c 匹配 abc, abbc' },
  { symbol: '?', description: '匹配前面的字符0次或1次', example: 'ab?c 匹配 ac, abc' },
  { symbol: '{n}', description: '匹配前面的字符恰好n次', example: 'a{3} 匹配 aaa' },
  { symbol: '{n,}', description: '匹配前面的字符至少n次', example: 'a{2,} 匹配 aa, aaa, aaaa' },
  { symbol: '{n,m}', description: '匹配前面的字符n到m次', example: 'a{2,4} 匹配 aa, aaa, aaaa' },
  { symbol: '[]', description: '字符集合，匹配其中任意一个', example: '[abc] 匹配 a, b, c' },
  { symbol: '[^]', description: '排除字符集合', example: '[^abc] 不匹配 a, b, c' },
  { symbol: '\\d', description: '匹配数字，等价于[0-9]', example: '\\d{4} 匹配 2024' },
  { symbol: '\\D', description: '匹配非数字', example: '\\D+ 匹配非数字字符' },
  { symbol: '\\w', description: '匹配字母、数字、下划线', example: '\\w+ 匹配 hello_123' },
  { symbol: '\\W', description: '匹配非字母、数字、下划线', example: '\\W+ 匹配特殊字符' },
  { symbol: '\\s', description: '匹配空白字符（空格、制表符等）', example: '\\s+ 匹配空白' },
  { symbol: '\\S', description: '匹配非空白字符', example: '\\S+ 匹配非空白' },
  { symbol: '|', description: '或操作符', example: 'cat|dog 匹配 cat 或 dog' },
  { symbol: '()', description: '捕获组', example: '(\\d{3})-(\\d{4}) 捕获分组' },
  { symbol: '(?:)', description: '非捕获组', example: '(?:ab)+ 不捕获但分组' },
  { symbol: '\\b', description: '单词边界', example: '\\bword\\b 匹配独立单词' },
  { symbol: '\\B', description: '非单词边界', example: '\\B\\w 匹配非边界的字母' },
  { symbol: '(?=)', description: '正向先行断言', example: 'a(?=b) 匹配后面是b的a' },
  { symbol: '(?!)', description: '负向先行断言', example: 'a(?!b) 匹配后面不是b的a' },
];
