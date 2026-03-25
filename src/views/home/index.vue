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

      <!-- 左侧目录 + 右侧工具内容 -->
      <div class="relative">
        <!-- 左侧一级目录锚点 -->
        <aside class="catalog-aside">
          <div class="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
            <h2 class="text-sm font-semibold text-gray-700 mb-3 tracking-wide">工具目录</h2>
            <nav class="space-y-1">
              <a
                v-for="section in toolSections"
                :key="section.id"
                :href="`#${getSectionAnchor(section.id)}`"
                @click.prevent="scrollToSection(section.id)"
                class="block px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                :class="
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                "
              >
                {{ section.title }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- 工具分类 -->
        <div class="space-y-12">
          <div
            v-for="section in toolSections"
            :key="section.id"
            :id="getSectionAnchor(section.id)"
            class="scroll-mt-6"
          >
            <ToolSection
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
        </div>

      </div>

      <!-- 页脚信息 -->
      <div class="mt-16 text-center text-gray-500 text-sm">
        <p>© 2026 Super Tools. 持续更新中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import ToolSection from "./components/ToolSection.vue";
import ToolCard from "./components/ToolCard.vue";
import ComingSoonCard from "./components/ComingSoonCard.vue";
import { toolSections, type Tool } from "./constants";

const activeSection = ref(toolSections[0]?.id ?? "");

const getSectionAnchor = (sectionId: string | number) => `section-${sectionId}`;
const scrollToSection = (sectionId: string | number) => {
  const target = document.getElementById(getSectionAnchor(sectionId));
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
};

let sectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) {
        return;
      }

      const sectionId = visibleSection.target.id.replace("section-", "");
      const matchedSection = toolSections.find((section) => String(section.id) === sectionId);

      if (matchedSection) {
        activeSection.value = matchedSection.id;
      }
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0.1, 0.3, 0.5],
    }
  );

  toolSections.forEach((section) => {
    const target = document.getElementById(getSectionAnchor(section.id));
    if (target) {
      sectionObserver?.observe(target);
    }
  });
});

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  sectionObserver = null;
});
</script>

<style scoped>
.container {
  max-width: 1280px;
}

/* 默认隐藏，避免移动端占位 */
.catalog-aside {
  display: none;
}

@media (min-width: 1024px) {
  .catalog-aside {
    display: block;
    position: sticky;
    top: 1rem;
    width: 14rem;
    z-index: 10;
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 1800px) {
  .catalog-aside {
    position: fixed;
    top: 2rem;
    left: max(8px, calc((100vw - 1280px) / 2 - 14rem - 16px));
    width: 14rem;
    z-index: 10;
    margin-bottom: 0;
  }
}
</style>
