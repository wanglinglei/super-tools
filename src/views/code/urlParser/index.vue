<template>
  <ToolLayout title="URL 编解码" icon="🔗" :content-padding="false">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <template v-if="activeTab === 'encoder'">
        <ToolButton icon="check" text="URL 编码" @click="handleEncode" />
        <ToolButton icon="format" text="URL 解码" @click="handleDecode" />
        <ToolButton icon="copy" text="复制结果" @click="copyOutput" />
      </template>
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- Tab 切换 -->
    <div class="sticky top-0 z-10">
      <TabBar v-model="activeTab" :tabs="tabs" />
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-4">
      <div class="max-w-7xl mx-auto">
        <UrlEncoder v-if="activeTab === 'encoder'" ref="encoderRef" />
        <UrlParamsEditor v-else-if="activeTab === 'params'" ref="paramsRef" />
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import type { Tab } from "@/components/TabBar/TabBar.vue";
import UrlEncoder from "./components/UrlEncoder.vue";
import UrlParamsEditor from "./components/UrlParamsEditor.vue";

// Tab 配置
const tabs: Tab[] = [
  { label: "URL 编解码", value: "encoder", icon: "📝" },
  { label: "参数编辑", value: "params", icon: "🔧" },
];

// Tab 状态
const activeTab = ref<"encoder" | "params">("encoder");

// 组件引用
const encoderRef = ref<InstanceType<typeof UrlEncoder> | null>(null);
const paramsRef = ref<InstanceType<typeof UrlParamsEditor> | null>(null);

// 代理方法
const handleEncode = () => encoderRef.value?.handleEncode();
const handleDecode = () => encoderRef.value?.handleDecode();
const copyOutput = () => encoderRef.value?.copyOutput();

// 清空所有
const clearAll = () => {
  if (activeTab.value === "encoder") {
    encoderRef.value?.clearAll();
  } else {
    paramsRef.value?.clearAll();
  }
};
</script>
