import { createRouter, createWebHistory } from "vue-router";
import { ROUTER_NAME } from "./constants";
import { mapRoutes, editorRoutes, generalRoutes, codeRoutes } from "./modules";

const router = createRouter({
  history: createWebHistory("/tools/"),
  routes: [
    // 首页
    {
      path: "/",
      name: ROUTER_NAME.HOME,
      component: () => import("@/views/home/index.vue"),
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
      },
    },
  ],
});

// 路由守卫：设置页面标题
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || "Super Tools";
  next();
});

export default router;
