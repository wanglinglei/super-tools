<template>
  <svg
    :class="className"
    :style="{ width: size, height: size }"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';

interface Props {
  name: string;
  size?: string;
  color?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: '20px',
  color: 'currentColor',
  className: '',
});

// 图标路径定义
const icons: Record<string, any> = {
  // 修复工具图标
  repair: defineComponent({
    setup() {
      return () =>
        h('path', {
          d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
        });
    },
  }),

  // 校验图标
  check: defineComponent({
    setup() {
      return () => [
        h('path', { d: 'M9 12l2 2 4-4' }),
        h('circle', { cx: '12', cy: '12', r: '10' }),
      ];
    },
  }),

  // 上传图标
  upload: defineComponent({
    setup() {
      return () => [
        h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
        h('polyline', { points: '17 8 12 3 7 8' }),
        h('line', { x1: '12', y1: '3', x2: '12', y2: '15' }),
      ];
    },
  }),

  // 下载/保存图标
  download: defineComponent({
    setup() {
      return () => [
        h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
        h('polyline', { points: '7 10 12 15 17 10' }),
        h('line', { x1: '12', y1: '15', x2: '12', y2: '3' }),
      ];
    },
  }),

  // 复制图标
  copy: defineComponent({
    setup() {
      return () => [
        h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
        h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
      ];
    },
  }),

  // 删除/清空图标
  trash: defineComponent({
    setup() {
      return () => [
        h('polyline', { points: '3 6 5 6 21 6' }),
        h('path', {
          d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
        }),
        h('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
        h('line', { x1: '14', y1: '11', x2: '14', y2: '17' }),
      ];
    },
  }),

  // 预览/眼睛图标
  eye: defineComponent({
    setup() {
      return () => [
        h('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
        h('circle', { cx: '12', cy: '12', r: '3' }),
      ];
    },
  }),

  // 格式化图标
  format: defineComponent({
    setup() {
      return () => [
        h('polyline', { points: '4 7 4 4 20 4 20 7' }),
        h('line', { x1: '9', y1: '20', x2: '15', y2: '20' }),
        h('line', { x1: '12', y1: '4', x2: '12', y2: '20' }),
      ];
    },
  }),

  // 分屏图标
  split: defineComponent({
    setup() {
      return () => [
        h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
        h('line', { x1: '12', y1: '3', x2: '12', y2: '21' }),
      ];
    },
  }),
};

const iconComponent = computed(() => {
  return icons[props.name] || icons.check;
});
</script>

<style scoped>
svg {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}
</style>
