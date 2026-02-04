import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { ROUTER_NAME } from "./constants";
import { mapRoutes, editorRoutes, generalRoutes, codeRoutes } from "./modules";

// 扩展路由 meta 类型
declare module "vue-router" {
  interface RouteMeta {
    /** 页面标题 */
    title?: string;
    /** 过渡动画名称: fade | slide | scale */
    transition?: "fade" | "slide" | "scale";
    /** 是否需要缓存 */
    keepAlive?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory("/tools/"),
  routes: [
    // 首页
    {
      path: "/",
      name: ROUTER_NAME.HOME,
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "Super Tools",
        transition: "fade",
      },
    },

    // 工具模块路由
    mapRoutes,
    editorRoutes,
    generalRoutes,
    codeRoutes,

    // 404 页面
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "页面未找到",
        transition: "fade",
      },
    },
  ],

  // 滚动行为
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: "smooth" };
  },
});

// 路由切换计时（用于性能监控）
let routeStartTime = 0;

/**
 * 路由前置守卫
 */
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    // 记录路由切换开始时间
    routeStartTime = performance.now();

    // 设置页面标题
    document.title = to.meta.title || "Super Tools";

    // 根据导航方向设置过渡动画
    // 从首页进入工具页使用 slide，其他使用 fade
    if (from.path === "/" && to.path !== "/") {
      to.meta.transition = "slide";
    }

    next();
  }
);

/**
 * 路由后置守卫
 */
router.afterEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 计算路由切换耗时
    const routeTime = performance.now() - routeStartTime;

    // 开发环境输出路由切换信息
    if (import.meta.env.DEV && routeTime > 0) {
      console.debug(
        `🚀 路由切换: ${from.path} → ${to.path} (${routeTime.toFixed(2)}ms)`
      );
    }
  }
);

/**
 * 路由错误处理
 */
router.onError((error) => {
  console.error("🚨 路由错误:", error);

  // 如果是动态导入失败（chunk 加载失败），尝试刷新页面
  if (error.message.includes("Failed to fetch dynamically imported module")) {
    window.location.reload();
  }
});

export default router;
