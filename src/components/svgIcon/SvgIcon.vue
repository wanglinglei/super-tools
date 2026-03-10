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
import { computed, defineComponent, h } from "vue";

interface Props {
  name: string;
  size?: string;
  color?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "20px",
  color: "currentColor",
  className: "",
});

// 图标路径定义
const icons: Record<string, any> = {
  // 首页图标
  home: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        h("polyline", { points: "9 22 9 12 15 12 15 22" }),
      ];
    },
  }),

  // 修复工具图标
  repair: defineComponent({
    setup() {
      return () =>
        h("path", {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
        });
    },
  }),

  // 校验图标
  check: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M9 12l2 2 4-4" }),
        h("circle", { cx: "12", cy: "12", r: "10" }),
      ];
    },
  }),

  // 上传图标
  upload: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        h("polyline", { points: "17 8 12 3 7 8" }),
        h("line", { x1: "12", y1: "3", x2: "12", y2: "15" }),
      ];
    },
  }),

  // 下载/保存图标
  download: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        h("polyline", { points: "7 10 12 15 17 10" }),
        h("line", { x1: "12", y1: "15", x2: "12", y2: "3" }),
      ];
    },
  }),

  // 复制图标
  copy: defineComponent({
    setup() {
      return () => [
        h("rect", {
          x: "9",
          y: "9",
          width: "13",
          height: "13",
          rx: "2",
          ry: "2",
        }),
        h("path", {
          d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
        }),
      ];
    },
  }),

  // 删除/清空图标
  trash: defineComponent({
    setup() {
      return () => [
        h("polyline", { points: "3 6 5 6 21 6" }),
        h("path", {
          d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
        }),
        h("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
        h("line", { x1: "14", y1: "11", x2: "14", y2: "17" }),
      ];
    },
  }),

  // 预览/眼睛图标
  eye: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
        h("circle", { cx: "12", cy: "12", r: "3" }),
      ];
    },
  }),

  // 格式化图标
  format: defineComponent({
    setup() {
      return () => [
        h("polyline", { points: "4 7 4 4 20 4 20 7" }),
        h("line", { x1: "9", y1: "20", x2: "15", y2: "20" }),
        h("line", { x1: "12", y1: "4", x2: "12", y2: "20" }),
      ];
    },
  }),

  // 分屏图标
  split: defineComponent({
    setup() {
      return () => [
        h("rect", {
          x: "3",
          y: "3",
          width: "18",
          height: "18",
          rx: "2",
          ry: "2",
        }),
        h("line", { x1: "12", y1: "3", x2: "12", y2: "21" }),
      ];
    },
  }),

  // 撤销图标
  undo: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M3 7v6h6" }),
        h("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" }),
      ];
    },
  }),

  // 重做图标
  redo: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M21 7v6h-6" }),
        h("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" }),
      ];
    },
  }),

  // 保存图标
  save: defineComponent({
    setup() {
      return () => [
        h("path", {
          d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",
        }),
        h("polyline", { points: "17 21 17 13 7 13 7 21" }),
        h("polyline", { points: "7 3 7 8 15 8" }),
      ];
    },
  }),

  // 放大
  "zoom-in": defineComponent({
    setup() {
      return () => [
        h("circle", { cx: "11", cy: "11", r: "8" }),
        h("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
        h("line", { x1: "11", y1: "8", x2: "11", y2: "14" }),
        h("line", { x1: "8", y1: "11", x2: "14", y2: "11" }),
      ];
    },
  }),

  // 缩小
  "zoom-out": defineComponent({
    setup() {
      return () => [
        h("circle", { cx: "11", cy: "11", r: "8" }),
        h("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
        h("line", { x1: "8", y1: "11", x2: "14", y2: "11" }),
      ];
    },
  }),

  // 左旋 (逆时针)
  "rotate-ccw": defineComponent({
    setup() {
      return () => [
        h("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
        h("path", { d: "M3 3v5h5" }),
      ];
    },
  }),

  // 右旋 (顺时针)
  "rotate-cw": defineComponent({
    setup() {
      return () => [
        h("path", { d: "M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
        h("path", { d: "M21 3v5h-5" }),
      ];
    },
  }),

  // 水平翻转 (arrows-h -> move-horizontal 替代)
  "arrows-h": defineComponent({
    setup() {
      return () => [
        h("polyline", { points: "18 8 22 12 18 16" }),
        h("polyline", { points: "6 8 2 12 6 16" }),
        h("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
      ];
    },
  }),

  // 垂直翻转 (arrows-v -> move-vertical 替代)
  "arrows-v": defineComponent({
    setup() {
      return () => [
        h("polyline", { points: "8 18 12 22 16 18" }),
        h("polyline", { points: "8 6 12 2 16 6" }),
        h("line", { x1: "12", y1: "2", x2: "12", y2: "22" }),
      ];
    },
  }),

  // 重置/刷新
  refresh: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M23 4v6h-6" }),
        h("path", { d: "M1 20v-6h6" }),
        h("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }),
      ];
    },
  }),

  // 裁剪
  crop: defineComponent({
    setup() {
      return () => [
        h("path", { d: "M6.13 1L6 16a2 2 0 0 0 2 2h15" }),
        h("path", { d: "M1 6.13L16 6a2 2 0 0 1 2 2v15" }),
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
