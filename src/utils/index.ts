/*
 * @Author: wanglinglei
 * @Date: 2026-01-28 16:27:57
 * @Description:  工具函数入口文件
 * @FilePath: /super-tools/src/utils/index.ts
 * @LastEditTime: 2026-01-28 16:39:47
 */


// 推荐使用的核心方法
export { downloadFile } from './file';

// 快捷方法（语法糖）
export {
  downloadJson,
  downloadMarkdown,
  downloadText,
  downloadImage,
} from './file';
