<template>
  <div class="bg-white border-b border-gray-200">
    <div class="px-4 py-2">
      <div class="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="getTabKey(tab)"
          class="tab-btn"
          :class="{ 'tab-btn-active': modelValue === getTabKey(tab) }"
          @click="$emit('update:modelValue', getTabKey(tab))"
        >
          <span v-if="tab.icon" class="text-base mr-1.5">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Tab {
  label: string;
  /** 支持 value 或 key 作为标识符 */
  value?: string;
  key?: string;
  icon?: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

defineProps<Props>();
defineEmits<{
  "update:modelValue": [value: string];
}>();

/**
 * 获取 tab 的唯一标识（兼容 value 和 key）
 */
const getTabKey = (tab: Tab): string => {
  return tab.value ?? tab.key ?? "";
};
</script>

<style scoped>
.tab-btn {
  @apply px-4 py-1.5 text-sm font-medium rounded-md;
  @apply bg-transparent text-gray-600;
  @apply hover:text-gray-800 hover:bg-gray-200 transition-all cursor-pointer;
  @apply flex items-center;
}

.tab-btn-active {
  @apply bg-white text-blue-600 shadow-sm;
  @apply hover:text-blue-700 hover:bg-white;
}
</style>
