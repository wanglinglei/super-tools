<template>
  <div class="h-full overflow-y-auto">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">序号</th>
          <th scope="col" class="px-6 py-3">执行时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, index) in times" :key="index" class="bg-white border-b hover:bg-gray-50">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ index + 1 }}</td>
          <td class="px-6 py-4 font-mono text-blue-600">{{ time }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="times.length === 0" class="text-center text-gray-400 mt-4">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  times: string[];
}>();
</script>
