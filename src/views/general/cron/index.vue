<template>
  <ToolLayout title="Cron 表达式" icon="⏰" :content-padding="false">
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空" @click="clearAll" />
    </template>

    <div class="flex flex-col h-full p-4 gap-4">
      <!-- 输入区域 -->
      <div class="card-p flex-shrink-0">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-title">Cron 表达式</h2>
          <span class="text-xs text-gray-500">支持 5 或 6 位 (秒 分 时 日 月 周)</span>
        </div>
        <div class="flex gap-2">
          <input
            v-model="cronExpression"
            type="text"
            class="input-base flex-1 font-mono text-lg"
            placeholder="* * * * *"
            @input="handleInput"
          />
          <button class="btn-primary px-4" @click="parseCron">解析</button>
        </div>
        <div class="mt-2 text-sm text-gray-600" v-if="nextRunTimes.length > 0">
          下次运行: <span class="font-mono font-bold text-blue-600">{{ nextRunTimes[0] }}</span>
        </div>
        <div class="mt-1 text-sm text-red-500" v-if="error">{{ error }}</div>
      </div>

      <!-- 生成器区域 -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <!-- 左侧：生成器 -->
        <div class="card-p flex flex-col min-h-0 overflow-hidden">
          <h2 class="text-title mb-3">生成器</h2>
          <div class="flex-1 overflow-auto">
            <CronGenerator v-model="cronExpression" @change="handleInput" />
          </div>
        </div>

        <!-- 右侧：最近运行时间 -->
        <div class="card-p flex flex-col min-h-0 overflow-hidden">
          <h2 class="text-title mb-3">最近运行时间</h2>
          <div class="flex-1 overflow-auto">
            <NextRunTimes :times="nextRunTimes" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import CronGenerator from "./components/CronGenerator.vue";
import NextRunTimes from "./components/NextRunTimes.vue";
import cronParser from "cron-parser";

const cronExpression = ref("* * * * *");
const nextRunTimes = ref<string[]>([]);
const error = ref("");

function parseCron() {
  error.value = "";
  nextRunTimes.value = [];
  
  if (!cronExpression.value.trim()) return;

  try {
    const interval = (cronParser as any).parseExpression(cronExpression.value);
    const times = [];
    for (let i = 0; i < 10; i++) {
      times.push(interval.next().toString());
    }
    nextRunTimes.value = times;
  } catch (err) {
    error.value = "无效的 Cron 表达式: " + (err as Error).message;
  }
}

function handleInput() {
  parseCron();
}

function clearAll() {
  cronExpression.value = "";
  nextRunTimes.value = [];
  error.value = "";
}

// 初始化解析一次
parseCron();
</script>
