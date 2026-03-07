import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

const reporterRoutes: RouteRecordRaw = {
  path: "/reporter",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/reporter/list",
  children: [
    {
      path: "list",
      name: ROUTER_NAME.REPORTER_LIST,
      component: () => import("@/views/reporter/index.vue"),
      meta: {
        title: "对话分析报告",
      },
    },
  ],
};

export default reporterRoutes;
