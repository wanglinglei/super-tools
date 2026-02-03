import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

/**
 * 通用工具路由模块
 */
const generalRoutes: RouteRecordRaw = {
  path: "/general",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/general/timestamp",
  children: [
    {
      path: "timestamp",
      name: ROUTER_NAME.GENERAL_TIMESTAMP,
      component: () => import("@/views/general/timestamp/index.vue"),
      meta: {
        title: "时间戳转换",
      },
    },
    {
      path: "qrcode",
      name: ROUTER_NAME.GENERAL_QRCODE,
      component: () => import("@/views/general/qrcode/index.vue"),
      meta: {
        title: "二维码生成",
      },
    },
    {
      path: "excel2json",
      name: ROUTER_NAME.GENERAL_EXCEL2JSON,
      component: () => import("@/views/general/excel2json/index.vue"),
      meta: {
        title: "Excel 转 JSON",
      },
    },
    {
      path: "color",
      name: ROUTER_NAME.GENERAL_COLOR,
      component: () => import("@/views/general/color/index.vue"),
      meta: {
        title: "颜色转换",
      },
    },
  ],
};

export default generalRoutes;
