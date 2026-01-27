<template>
  <svg
    class="format-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- 加粗 -->
    <path v-if="name === 'bold'" d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>

    <!-- 斜体 -->
    <template v-else-if="name === 'italic'">
      <line x1="19" y1="4" x2="10" y2="4"></line>
      <line x1="14" y1="20" x2="5" y2="20"></line>
      <line x1="15" y1="4" x2="9" y2="20"></line>
    </template>

    <!-- 标题 -->
    <path v-else-if="name === 'heading'" d="M6 12h12 M6 4v16 M18 4v16"></path>

    <!-- 引用 -->
    <path v-else-if="name === 'quote'" d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>

    <!-- 代码 -->
    <template v-else-if="name === 'code'">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </template>

    <!-- 无序列表 -->
    <template v-else-if="name === 'list'">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </template>

    <!-- 有序列表 -->
    <template v-else-if="name === 'orderedList'">
      <line x1="10" y1="6" x2="21" y2="6"></line>
      <line x1="10" y1="12" x2="21" y2="12"></line>
      <line x1="10" y1="18" x2="21" y2="18"></line>
      <path d="M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
    </template>

    <!-- 链接 -->
    <template v-else-if="name === 'link'">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </template>

    <!-- 图片 -->
    <template v-else-if="name === 'image'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </template>

    <!-- 表格 -->
    <template v-else-if="name === 'table'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
      <line x1="12" y1="3" x2="12" y2="21"></line>
    </template>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  name: 'bold' | 'italic' | 'heading' | 'quote' | 'code' | 'list' | 'orderedList' | 'link' | 'image' | 'table';
}

defineProps<Props>();
</script>

<style scoped>
.format-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-block;
}
</style>
