<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"
  >
    <div class="text-center px-4">
      <!-- 404 图标 -->
      <div class="text-9xl font-bold text-gray-200 mb-4">404</div>

      <!-- 提示信息 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">页面未找到</h1>
        <p class="text-gray-500">抱歉，您访问的页面不存在或已被移除</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-4 justify-center">
        <button
          class="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
          @click="goHome"
        >
          🏠 返回首页
        </button>
        <button
          class="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          @click="goBack"
        >
          ← 返回上页
        </button>
      </div>
    </div>
  </div>
</template>
