/*
 * @Author: wanglinglei
 * @Date: 2026-01-28 16:27:57
 * @Description:  工具函数入口文件
 * @FilePath: /super-tools/src/utils/index.ts
 * @LastEditTime: 2026-01-28 16:39:47
 */

// 文件下载相关
export { downloadFile } from "./file";

// 快捷方法（语法糖）
export {
  downloadJson,
  downloadMarkdown,
  downloadText,
  downloadImage,
} from "./file";

// 剪贴板相关
export {
  copyToClipboard,
  copyWithCallback,
  isClipboardSupported,
  readFromClipboard,
} from "./clipboard";

// 错误处理相关
export {
  setupErrorHandler,
  getErrorQueue,
  clearErrorQueue,
} from "./errorHandler";
