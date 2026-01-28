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
        <ToolSection
          v-for="section in toolSections"
          :key="section.id"
          :title="section.title"
          :accent-color="section.accentColor"
        >
          <!-- 工具卡片 -->
          <template v-if="section.cardType === 'tool'">
            <ToolCard
              v-for="tool in section.tools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
              :route-name="(tool as Tool).routeName"
              :color="(tool as Tool).color"
            />
          </template>

          <!-- 敬请期待卡片 -->
          <template v-else-if="section.cardType === 'coming' && section.tools.length > 0">
            <ComingSoonCard
              v-for="tool in section.tools"
              :key="tool.name"
              :icon="tool.icon"
              :title="tool.title"
              :description="tool.description"
            />
          </template>
        </ToolSection>
      </div>

      <!-- 页脚信息 -->
      <div class="mt-16 text-center text-gray-500 text-sm">
        <p>© 2026 Super Tools. 持续更新中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolSection from "./components/ToolSection.vue";
import ToolCard from "./components/ToolCard.vue";
import ComingSoonCard from "./components/ComingSoonCard.vue";
import { toolSections, type Tool } from "./constants";
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
