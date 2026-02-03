import type { RouteRecordRaw } from "vue-router";
import { ROUTER_NAME } from "../constants";

/**
 * 地图工具路由模块
 */
const mapRoutes: RouteRecordRaw = {
  path: "/map",
  component: () => import("@/layouts/RouterLayout.vue"),
  redirect: "/map/distance",
  children: [
    {
      path: "distance",
      name: ROUTER_NAME.MAP_DISTANCE,
      component: () => import("@/views/map/distance/index.vue"),
      meta: {
        title: "距离计算",
      },
    },
    {
      path: "weather",
      name: ROUTER_NAME.MAP_WEATHER,
      component: () => import("@/views/map/weather/index.vue"),
      meta: {
        title: "天气查询",
      },
    },
  ],
};

export default mapRoutes;
