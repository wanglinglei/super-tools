/**
 * 文件操作工具函数
 * 
 * @module file
 * @description 提供文件下载、保存等常用文件操作功能
 * @design 使用策略模式处理不同类型的数据下载
 */

/**
 * 支持的数据源类型
 */
export type DataSource = string | Blob | object;

/**
 * 数据源类型枚举
 */
enum DataSourceType {
  TEXT = 'text',
  DATA_URL = 'dataUrl',
  BLOB = 'blob',
  JSON = 'json',
}

/**
 * 文件下载选项
 */
export interface DownloadOptions {
  /** 文件名（必填） */
  filename: string;
  /** MIME 类型（可选，默认根据文件扩展名推断） */
  mimeType?: string;
  /** 是否自动添加时间戳（可选，默认 false） */
  addTimestamp?: boolean;
}

/**
 * 常用 MIME 类型映射
 */
const MIME_TYPES: Record<string, string> = {
  json: 'application/json',
  txt: 'text/plain',
  md: 'text/markdown',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/typescript',
  xml: 'application/xml',
  csv: 'text/csv',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  pdf: 'application/pdf',
  zip: 'application/zip',
};

/**
 * 根据文件扩展名推断 MIME 类型
 * 
 * @param {string} filename - 文件名
 * @returns {string} MIME 类型，如果无法推断则返回 'application/octet-stream'
 * 
 * @example
 * getMimeType('data.json'); // 'application/json'
 * getMimeType('document.md'); // 'text/markdown'
 * getMimeType('image.png'); // 'image/png'
 */
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext && MIME_TYPES[ext] ? MIME_TYPES[ext] : 'application/octet-stream';
}

/**
 * 生成带时间戳的文件名
 * 
 * @param {string} filename - 原始文件名
 * @returns {string} 带时间戳的文件名
 * 
 * @example
 * addTimestampToFilename('data.json'); 
 * // 'data_1706123456789.json'
 * 
 * addTimestampToFilename('document.md');
 * // 'document_1706123456789.md'
 */
function addTimestampToFilename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    // 没有扩展名
    return `${filename}_${Date.now()}`;
  }
  
  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex);
  return `${name}_${Date.now()}${ext}`;
}

/**
 * 检测数据源类型
 * 
 * @param {DataSource} data - 数据源
 * @returns {DataSourceType} 数据源类型
 */
function detectDataSourceType(data: DataSource): DataSourceType {
  // 检测 Blob
  if (data instanceof Blob) {
    return DataSourceType.BLOB;
  }
  
  // 检测字符串
  if (typeof data === 'string') {
    // 检测 Data URL
    if (data.startsWith('data:')) {
      return DataSourceType.DATA_URL;
    }
    // 普通文本
    return DataSourceType.TEXT;
  }
  
  // 检测对象（JSON）
  if (typeof data === 'object' && data !== null) {
    return DataSourceType.JSON;
  }
  
  throw new Error('不支持的数据类型');
}

/**
 * 数据处理策略接口
 */
interface DataStrategy {
  /**
   * 将数据转换为可下载的 URL
   * @param data - 原始数据
   * @param mimeType - MIME 类型
   * @returns [下载 URL, 是否需要清理]
   */
  process(data: DataSource, mimeType: string): [string, boolean];
}

/**
 * 文本数据处理策略
 */
class TextStrategy implements DataStrategy {
  process(data: string, mimeType: string): [string, boolean] {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return [url, true]; // 需要清理
  }
}

/**
 * Data URL 处理策略
 */
class DataUrlStrategy implements DataStrategy {
  process(data: string, _mimeType: string): [string, boolean] {
    return [data, false]; // Data URL 不需要清理
  }
}

/**
 * Blob 处理策略
 */
class BlobStrategy implements DataStrategy {
  process(data: Blob, _mimeType: string): [string, boolean] {
    const url = URL.createObjectURL(data);
    return [url, true]; // 需要清理
  }
}

/**
 * JSON 数据处理策略
 */
class JsonStrategy implements DataStrategy {
  process(data: object, mimeType: string): [string, boolean] {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return [url, true]; // 需要清理
  }
}

/**
 * 策略工厂
 */
const STRATEGIES: Record<DataSourceType, DataStrategy> = {
  [DataSourceType.TEXT]: new TextStrategy(),
  [DataSourceType.DATA_URL]: new DataUrlStrategy(),
  [DataSourceType.BLOB]: new BlobStrategy(),
  [DataSourceType.JSON]: new JsonStrategy(),
};

/**
 * 触发浏览器下载（核心方法，消除重复代码）
 * 
 * @param {string} url - 下载 URL
 * @param {string} filename - 文件名
 * @param {boolean} needsCleanup - 是否需要清理 URL
 * 
 * @private
 */
function triggerDownload(url: string, filename: string, needsCleanup: boolean): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 某些浏览器需要将链接添加到 DOM
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 清理 Object URL
  if (needsCleanup) {
    URL.revokeObjectURL(url);
  }
}

/**
 * 下载文件（统一入口，策略模式）
 * 
 * @param {DataSource} data - 数据源（文本、Data URL、Blob 或对象）
 * @param {DownloadOptions} options - 下载选项
 * @throws {Error} 如果数据为空、文件名未提供或数据类型不支持
 * 
 * @example
 * // 下载文本文件
 * downloadFile('Hello World', {
 *   filename: 'note.txt',
 *   addTimestamp: true
 * });
 * 
 * @example
 * // 下载 JSON 数据
 * downloadFile({ name: 'test', value: 123 }, {
 *   filename: 'data.json'
 * });
 * 
 * @example
 * // 下载 Data URL（图片）
 * downloadFile(qrcodeDataUrl, {
 *   filename: 'qrcode.png',
 *   addTimestamp: true
 * });
 * 
 * @example
 * // 下载 Blob
 * const blob = new Blob(['content'], { type: 'text/plain' });
 * downloadFile(blob, {
 *   filename: 'file.txt'
 * });
 */
export function downloadFile(data: DataSource, options: DownloadOptions): void {
  // 参数校验
  if (!data) {
    throw new Error('数据不能为空');
  }
  
  if (!options.filename) {
    throw new Error('文件名不能为空');
  }
  
  // 字符串类型额外校验
  if (typeof data === 'string' && data.trim().length === 0) {
    throw new Error('文件内容不能为空');
  }
  
  // 处理文件名
  let filename = options.filename;
  if (options.addTimestamp) {
    filename = addTimestampToFilename(filename);
  }
  
  // 确定 MIME 类型
  const mimeType = options.mimeType || getMimeType(filename);
  
  // 检测数据类型并选择策略
  const dataType = detectDataSourceType(data);
  const strategy = STRATEGIES[dataType];
  
  // 执行策略处理数据
  const [url, needsCleanup] = strategy.process(data, mimeType);
  
  // 触发下载
  triggerDownload(url, filename, needsCleanup);
}

/**
 * 下载文本内容为文件
 * 
 * @param {string} content - 文件内容（文本）
 * @param {DownloadOptions} options - 下载选项
 * @throws {Error} 如果内容为空或文件名未提供
 * 
 * @example
 * downloadTextFile('{"name": "test"}', {
 *   filename: 'data.json'
 * });
 * 
 * @deprecated 推荐使用 downloadFile() 统一方法
 */
export function downloadTextFile(content: string, options: DownloadOptions): void {
  downloadFile(content, options);
}

/**
 * 下载 Data URL 为文件
 * 
 * @param {string} dataUrl - Data URL（如 base64 编码的图片）
 * @param {DownloadOptions} options - 下载选项
 * @throws {Error} 如果 Data URL 为空或文件名未提供
 * 
 * @example
 * downloadDataUrl(qrcodeDataUrl, {
 *   filename: 'qrcode.png',
 *   addTimestamp: true
 * });
 * 
 * @deprecated 推荐使用 downloadFile() 统一方法
 */
export function downloadDataUrl(dataUrl: string, options: DownloadOptions): void {
  downloadFile(dataUrl, options);
}

/**
 * 下载 Blob 为文件
 * 
 * @param {Blob} blob - Blob 对象
 * @param {DownloadOptions} options - 下载选项
 * @throws {Error} 如果 Blob 为空或文件名未提供
 * 
 * @example
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * downloadBlob(blob, {
 *   filename: 'hello.txt'
 * });
 * 
 * @deprecated 推荐使用 downloadFile() 统一方法
 */
export function downloadBlob(blob: Blob, options: DownloadOptions): void {
  downloadFile(blob, options);
}

/**
 * 快捷方法：下载 JSON 文件
 * 
 * @param {any} data - 要保存的 JavaScript 对象
 * @param {string} filename - 文件名（不含扩展名）
 * @param {boolean} addTimestamp - 是否添加时间戳（可选，默认 true）
 * @throws {Error} 如果数据无法序列化为 JSON
 * 
 * @example
 * // 下载对象为 JSON 文件
 * downloadJson({ name: 'test', value: 123 }, 'data');
 * // 生成文件: data_1706123456789.json
 * 
 * @example
 * // 下载数组为 JSON 文件，不添加时间戳
 * downloadJson([1, 2, 3], 'numbers', false);
 * // 生成文件: numbers.json
 */
export function downloadJson(data: any, filename: string, addTimestamp: boolean = true): void {
  if (typeof data !== 'object' || data === null) {
    throw new Error('数据必须是对象或数组');
  }
  
  try {
    downloadFile(data, {
      filename: `${filename}.json`,
      addTimestamp,
    });
  } catch (error) {
    throw new Error('数据无法序列化为 JSON: ' + (error as Error).message);
  }
}

/**
 * 快捷方法：下载 Markdown 文件
 * 
 * @param {string} content - Markdown 内容
 * @param {string} filename - 文件名（不含扩展名）
 * @param {boolean} addTimestamp - 是否添加时间戳（可选，默认 true）
 * 
 * @example
 * downloadMarkdown('# Hello World\n\nThis is a test.', 'document');
 * // 生成文件: document_1706123456789.md
 */
export function downloadMarkdown(content: string, filename: string, addTimestamp: boolean = true): void {
  downloadFile(content, {
    filename: `${filename}.md`,
    addTimestamp,
  });
}

/**
 * 快捷方法：下载文本文件
 * 
 * @param {string} content - 文本内容
 * @param {string} filename - 文件名（不含扩展名）
 * @param {boolean} addTimestamp - 是否添加时间戳（可选，默认 true）
 * 
 * @example
 * downloadText('Hello World', 'note');
 * // 生成文件: note_1706123456789.txt
 */
export function downloadText(content: string, filename: string, addTimestamp: boolean = true): void {
  downloadFile(content, {
    filename: `${filename}.txt`,
    addTimestamp,
  });
}

/**
 * 快捷方法：下载图片（从 Data URL）
 * 
 * @param {string} dataUrl - 图片的 Data URL
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} format - 图片格式（可选，默认 'png'）
 * @param {boolean} addTimestamp - 是否添加时间戳（可选，默认 true）
 * 
 * @example
 * downloadImage(qrcodeDataUrl, 'qrcode', 'png');
 * // 生成文件: qrcode_1706123456789.png
 */
export function downloadImage(
  dataUrl: string,
  filename: string,
  format: string = 'png',
  addTimestamp: boolean = true
): void {
  downloadFile(dataUrl, {
    filename: `${filename}.${format}`,
    addTimestamp,
  });
}
