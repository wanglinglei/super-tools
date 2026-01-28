<template>
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 页面头部 -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">🛠️ Super Tools</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          一站式在线工具集合，提供编辑器、地图、转换等多种实用工具
        </p>
      </div>

      <!-- 工具分类 -->
      <div class="space-y-12">
        <!-- 编辑器工具 -->
        <section>
          <div class="flex items-center mb-6">
            <div class="w-1 h-8 bg-blue-500 rounded mr-3"></div>
            <h2 class="text-2xl font-bold text-gray-800">📝 编辑器工具</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              v-for="tool in editorTools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
              :route="tool.route"
              :color="tool.color"
            />
          </div>
        </section>

        <!-- 地图工具 -->
        <section>
          <div class="flex items-center mb-6">
            <div class="w-1 h-8 bg-green-500 rounded mr-3"></div>
            <h2 class="text-2xl font-bold text-gray-800">🗺️ 地图工具</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              v-for="tool in mapTools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
              :route="tool.route"
              :color="tool.color"
            />
          </div>
        </section>

        <!-- 通用工具 -->
        <section>
          <div class="flex items-center mb-6">
            <div class="w-1 h-8 bg-yellow-500 rounded mr-3"></div>
            <h2 class="text-2xl font-bold text-gray-800">🔧 通用工具</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              v-for="tool in generalTools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
              :route="tool.route"
              :color="tool.color"
            />
          </div>
        </section>

        <!-- 敬请期待 -->
        <section v-if="comingTools.length > 0">
          <div class="flex items-center mb-6">
            <div class="w-1 h-8 bg-purple-500 rounded mr-3"></div>
            <h2 class="text-2xl font-bold text-gray-800">🚀 更多工具</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComingSoonCard
              v-for="tool in comingTools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
            />
          </div>
        </section>
      </div>

      <!-- 页脚信息 -->
      <div class="mt-16 text-center text-gray-500 text-sm">
        <p>© 2026 Super Tools. 持续更新中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolCard from "./components/ToolCard.vue";
import ComingSoonCard from "./components/ComingSoonCard.vue";
import { editorTools, mapTools, generalTools, comingTools } from "./constants";
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
