import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

/**
 * 图片工具路由模块
 */
const imageRoutes: RouteRecordRaw = {
  path: "/image",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/image/crop",
  children: [
    {
      path: "crop",
      name: ROUTER_NAME.IMAGE_CROP,
      component: () => import("@/views/image/crop/index.vue"),
      meta: {
        title: "图片裁剪",
      },
    },
  ],
};

export default imageRoutes;
