import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

/**
 * 编码工具路由模块
 */
const codeRoutes: RouteRecordRaw = {
  path: "/code",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/code/regex",
  children: [
    {
      path: "regex",
      name: ROUTER_NAME.CODE_REGEX,
      component: () => import("@/views/code/regex/index.vue"),
      meta: {
        title: "正则测试",
      },
    },
    {
      path: "url-parser",
      name: ROUTER_NAME.CODE_URL_PARSER,
      component: () => import("@/views/code/urlParser/index.vue"),
      meta: {
        title: "URL 编解码",
      },
    },
  ],
};

export default codeRoutes;
