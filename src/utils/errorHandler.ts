/**
 * 全局错误处理器
 * 统一捕获和处理应用中的各类错误
 */
import type { App, ComponentPublicInstance } from "vue";

interface ErrorInfo {
  type: "vue" | "promise" | "script" | "resource";
  message: string;
  stack?: string;
  componentName?: string;
  hook?: string;
  timestamp: number;
}

// 错误日志队列（可用于上报）
const errorQueue: ErrorInfo[] = [];
const MAX_ERROR_QUEUE_SIZE = 50;

/**
 * 记录错误信息
 */
function logError(info: ErrorInfo) {
  // 添加到队列
  errorQueue.push(info);
  if (errorQueue.length > MAX_ERROR_QUEUE_SIZE) {
    errorQueue.shift();
  }

  // 开发环境输出详细错误
  if (import.meta.env.DEV) {
    console.group(`🚨 [${info.type.toUpperCase()}] ${info.message}`);
    console.error("详情:", info);
    if (info.stack) {
      console.error("堆栈:", info.stack);
    }
    console.groupEnd();
  }

  // 生产环境可以上报到监控平台
  // reportToMonitor(info);
}

/**
 * 获取组件名称
 */
function getComponentName(vm: ComponentPublicInstance | null): string {
  if (!vm) return "Unknown";

  const name = vm.$options?.name || vm.$options?.__name;
  if (name) return name;

  // 尝试从文件路径获取
  const file = vm.$options?.__file;
  if (file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    return match?.[1] || "Anonymous";
  }

  return "Anonymous";
}

/**
 * 设置 Vue 错误处理
 */
function setupVueErrorHandler(app: App) {
  app.config.errorHandler = (
    err: unknown,
    vm: ComponentPublicInstance | null,
    info: string
  ) => {
    const error = err as Error;

    logError({
      type: "vue",
      message: error.message || String(err),
      stack: error.stack,
      componentName: getComponentName(vm),
      hook: info,
      timestamp: Date.now(),
    });
  };

  // Vue 警告处理（仅开发环境）
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, _vm, trace) => {
      console.warn(`⚠️ [Vue Warn] ${msg}`);
      if (trace) {
        console.warn("Trace:", trace);
      }
    };
  }
}

/**
 * 设置 Promise 未捕获错误处理
 */
function setupPromiseErrorHandler() {
  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      // 阻止默认行为（控制台报错）
      event.preventDefault();

      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;

      logError({
        type: "promise",
        message: `Unhandled Promise Rejection: ${message}`,
        stack,
        timestamp: Date.now(),
      });
    }
  );
}

/**
 * 设置全局脚本错误处理
 */
function setupScriptErrorHandler() {
  window.onerror = (
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): boolean => {
    // 忽略跨域脚本错误
    if (message === "Script error." && !source) {
      return true;
    }

    logError({
      type: "script",
      message: String(message),
      stack: error?.stack || `at ${source}:${lineno}:${colno}`,
      timestamp: Date.now(),
    });

    return true; // 阻止默认错误处理
  };
}

/**
 * 设置资源加载错误处理
 */
function setupResourceErrorHandler() {
  window.addEventListener(
    "error",
    (event: ErrorEvent) => {
      const target = event.target as HTMLElement;

      // 只处理资源加载错误（img, script, link 等）
      if (
        target &&
        (target.tagName === "IMG" ||
          target.tagName === "SCRIPT" ||
          target.tagName === "LINK")
      ) {
        const src =
          (target as HTMLImageElement).src ||
          (target as HTMLScriptElement).src ||
          (target as HTMLLinkElement).href;

        logError({
          type: "resource",
          message: `资源加载失败: ${target.tagName.toLowerCase()}`,
          stack: `URL: ${src}`,
          timestamp: Date.now(),
        });
      }
    },
    true // 捕获阶段
  );
}

/**
 * 初始化全局错误处理
 */
export function setupErrorHandler(app: App) {
  setupVueErrorHandler(app);
  setupPromiseErrorHandler();
  setupScriptErrorHandler();
  setupResourceErrorHandler();

  // 开发环境提示
  if (import.meta.env.DEV) {
    console.info("✅ 全局错误处理已启用");
  }
}

/**
 * 获取错误日志队列（用于调试或上报）
 */
export function getErrorQueue(): ErrorInfo[] {
  return [...errorQueue];
}

/**
 * 清空错误日志队列
 */
export function clearErrorQueue() {
  errorQueue.length = 0;
}
