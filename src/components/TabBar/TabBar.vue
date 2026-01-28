<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="px-6 py-1">
      <div class="flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ 'tab-btn-active': modelValue === tab.value }"
          @click="$emit('update:modelValue', tab.value)"
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
  value: string;
  icon?: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.tab-btn {
  @apply px-3 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent;
  @apply hover:text-gray-800 hover:border-gray-300 transition-all cursor-pointer;
  @apply flex items-center;
}

.tab-btn-active {
  @apply text-blue-600 border-blue-500;
  @apply hover:text-blue-700 hover:border-blue-600;
}
</style>
