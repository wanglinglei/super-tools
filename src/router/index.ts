import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/tools/'),
  routes: [
    {
      path: '/',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/map/distance',
      name: 'map-distance',
      component: () => import('../views/map/distance/index.vue'),
      meta: {
        title: '距离计算',
      },
    },
    {
      path: '/map/weather',
      name: 'map-weather',
      component: () => import('../views/map/weather/index.vue'),
      meta: {
        title: '天气查询',
      },
    },
    {
      path: '/editor/json',
      name: 'editor-json',
      component: () => import('../views/editor/json/index.vue'),
      meta: {
        title: 'JSON 编辑器',
      },
    },
    {
      path: '/editor/markdown',
      name: 'editor-markdown',
      component: () => import('../views/editor/markdown/index.vue'),
      meta: {
        title: 'Markdown 编辑器',
      },
    },
  ],
})

export default router