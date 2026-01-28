import { createRouter, createWebHistory } from 'vue-router'
import { ROUTER_NAME } from './constants'
const router = createRouter({
  history: createWebHistory('/tools/'),
  routes: [
    {
      path: '/',
      name: ROUTER_NAME.HOME,
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/map/distance',
      name: ROUTER_NAME.MAP_DISTANCE,
      component: () => import('../views/map/distance/index.vue'),
      meta: {
        title: '距离计算',
      },
    },
    {
      path: '/map/weather',
      name: ROUTER_NAME.MAP_WEATHER,
      component: () => import('../views/map/weather/index.vue'),
      meta: {
        title: '天气查询',
      },
    },
    {
      path: '/editor/json',
      name: ROUTER_NAME.EDITOR_JSON,
      component: () => import('../views/editor/json/index.vue'),
      meta: {
        title: 'JSON 编辑器',
      },
    },
    {
      path: '/editor/markdown',
      name: ROUTER_NAME.EDITOR_MARKDOWN,
      component: () => import('../views/editor/markdown/index.vue'),
      meta: {
        title: 'Markdown 编辑器',
      },
    },
    {
      path: '/general/timestamp',
      name: ROUTER_NAME.GENERAL_TIMESTAMP,
      component: () => import('../views/general/timestamp/index.vue'),
      meta: {
        title: '时间戳转换',
      },
    },
    {
      path: '/general/qrcode',
      name: ROUTER_NAME.GENERAL_QRCODE,
      component: () => import('../views/general/qrcode/index.vue'),
      meta: {
        title: '二维码生成',
      },
    },
    {
      path: '/general/excel2json',
      name: ROUTER_NAME.GENERAL_EXCEL2JSON,
      component: () => import('../views/general/excel2json/index.vue'),
      meta: {
        title: 'Excel 转 JSON',
      },
    },
    {
      path: '/general/color',
      name: ROUTER_NAME.GENERAL_COLOR,
      component: () => import('../views/general/color/index.vue'),
      meta: {
        title: '颜色转换',
      },
    },
    {
      path: '/code/regex',
      name: ROUTER_NAME.CODE_REGEX,
      component: () => import('../views/code/regex/index.vue'),
      meta: {
        title: '正则测试',
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || 'super-tools'
  next()
})

export default router