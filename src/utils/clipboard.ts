/**
 * 剪贴板工具函数
 * 提供复制文本到剪贴板的功能
 */

/**
 * 复制文本到剪贴板
 * 
 * @param text - 要复制的文本内容
 * @returns Promise<boolean> - 复制是否成功
 * 
 * @example
 * ```typescript
 * // 基础用法
 * const success = await copyToClipboard('Hello World');
 * if (success) {
 *   console.log('复制成功');
 * }
 * 
 * // 配合 try-catch 使用
 * try {
 *   await copyToClipboard('Hello World');
 *   showMessage('已复制到剪贴板', 'success');
 * } catch (error) {
 *   showMessage('复制失败', 'error');
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    console.warn('copyToClipboard: 复制内容为空');
    return false;
  }

  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // 降级方案：使用 document.execCommand（已废弃但兼容性好）
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error('copyToClipboard 失败:', error);
    
    // 如果 Clipboard API 失败，尝试降级方案
    try {
      return fallbackCopyToClipboard(text);
    } catch (fallbackError) {
      console.error('fallbackCopyToClipboard 失败:', fallbackError);
      return false;
    }
  }
}

/**
 * 降级复制方案（兼容旧浏览器）
 * 使用 document.execCommand 实现复制功能
 * 
 * @param text - 要复制的文本
 * @returns boolean - 是否复制成功
 */
function fallbackCopyToClipboard(text: string): boolean {
  // 创建临时 textarea 元素
  const textarea = document.createElement('textarea');
  textarea.value = text;
  
  // 设置样式，使其不可见
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2em';
  textarea.style.height = '2em';
  textarea.style.padding = '0';
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.boxShadow = 'none';
  textarea.style.background = 'transparent';
  textarea.style.opacity = '0';
  
  // 添加到 DOM
  document.body.appendChild(textarea);
  
  // 选中文本
  textarea.focus();
  textarea.select();
  
  try {
    // 执行复制命令
    const successful = document.execCommand('copy');
    return successful;
  } finally {
    // 清理：移除临时元素
    document.body.removeChild(textarea);
  }
}

/**
 * 同步复制文本到剪贴板（带回调）
 * 适用于需要在复制后执行特定操作的场景
 * 
 * @param text - 要复制的文本
 * @param onSuccess - 复制成功回调
 * @param onError - 复制失败回调
 * 
 * @example
 * ```typescript
 * copyWithCallback(
 *   'Hello World',
 *   () => showMessage('复制成功', 'success'),
 *   (error) => showMessage('复制失败', 'error')
 * );
 * ```
 */
export function copyWithCallback(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): void {
  copyToClipboard(text)
    .then((success) => {
      if (success && onSuccess) {
        onSuccess();
      } else if (!success && onError) {
        onError(new Error('复制失败'));
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    });
}

/**
 * 检查浏览器是否支持 Clipboard API
 * 
 * @returns boolean - 是否支持
 * 
 * @example
 * ```typescript
 * if (isClipboardSupported()) {
 *   console.log('浏览器支持 Clipboard API');
 * }
 * ```
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * 读取剪贴板内容
 * 注意：需要用户授权
 * 
 * @returns Promise<string> - 剪贴板内容
 * 
 * @example
 * ```typescript
 * try {
 *   const text = await readFromClipboard();
 *   console.log('剪贴板内容:', text);
 * } catch (error) {
 *   console.error('读取失败:', error);
 * }
 * ```
 */
export async function readFromClipboard(): Promise<string> {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    throw new Error('浏览器不支持读取剪贴板');
  }

  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('readFromClipboard 失败:', error);
    throw error;
  }
}
