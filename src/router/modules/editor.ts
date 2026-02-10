import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

/**
 * 编辑器工具路由模块
 */
const editorRoutes: RouteRecordRaw = {
  path: "/editor",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/editor/json",
  children: [
    {
      path: "json",
      name: ROUTER_NAME.EDITOR_JSON,
      component: () => import("@/views/editor/json/index.vue"),
      meta: {
        title: "JSON 编辑器",
      },
    },
    {
      path: "markdown",
      name: ROUTER_NAME.EDITOR_MARKDOWN,
      component: () => import("@/views/editor/markdown/index.vue"),
      meta: {
        title: "Markdown 编辑器",
      },
    },
    {
      path: "flowchart",
      name: ROUTER_NAME.EDITOR_FLOWCHART,
      component: () => import("@/views/editor/flowchart/index.vue"),
      meta: {
        title: "流程图编辑器",
      },
    },
  ],
};

export default editorRoutes;
