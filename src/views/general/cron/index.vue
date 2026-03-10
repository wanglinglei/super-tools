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
          <div class="flex items-center gap-2">
            <select
              class="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="applyPreset"
            >
              <option value="" disabled selected>常用预设...</option>
              <option
                v-for="preset in presets"
                :key="preset.value"
                :value="preset.value"
              >
                {{ preset.label }}
              </option>
            </select>
            <span class="text-xs text-gray-500">支持 5 或 6 位</span>
          </div>
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
        
        <!-- 自然语言描述 -->
        <div class="mt-2" v-if="cronDescription">
          <span class="text-sm font-medium text-green-600">含义: {{ cronDescription }}</span>
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
import cronstrue from "cronstrue/i18n";

const cronExpression = ref("* * * * *");
const nextRunTimes = ref<string[]>([]);
const cronDescription = ref("");
const error = ref("");

const presets = [
  { label: "每分钟", value: "* * * * *" },
  { label: "每小时", value: "0 * * * *" },
  { label: "每天 0 点", value: "0 0 * * *" },
  { label: "每周一 0 点", value: "0 0 * * 1" },
  { label: "每月 1 号 0 点", value: "0 0 1 * *" },
  { label: "每年 1 月 1 号 0 点", value: "0 0 1 1 *" },
  { label: "工作日早9点到晚6点", value: "0 9-18 * * 1-5" },
];

function parseCron() {
  error.value = "";
  nextRunTimes.value = [];
  cronDescription.value = "";
  
  if (!cronExpression.value.trim()) return;

  try {
    // 1. 解析下次运行时间
    // 兼容处理 ESM/CommonJS 导入
    const parser = (cronParser as any).default || cronParser;
    const parseFn = parser.parseExpression || parser; // 某些版本直接导出函数
    
    if (typeof parseFn !== 'function') {
        throw new Error('cron-parser library not loaded correctly');
    }

    let interval;
    try {
      interval = parseFn(cronExpression.value);
    } catch (e: any) {
      // 如果报错需要 new，尝试 new 调用
      if (e.message && e.message.includes("Class constructor")) {
        interval = new parseFn(cronExpression.value);
      } else {
        throw e;
      }
    }

    const times = [];
    for (let i = 0; i < 10; i++) {
      times.push(interval.next().toString());
    }
    nextRunTimes.value = times;

    // 2. 生成自然语言描述
    try {
      cronDescription.value = cronstrue.toString(cronExpression.value, {
        locale: "zh_CN",
        use24HourTimeFormat: true,
      });
    } catch (e) {
      // cronstrue 可能不支持某些复杂的 6 位表达式，忽略错误
    }

  } catch (err) {
    error.value = "无效的 Cron 表达式: " + (err as Error).message;
  }
}

function handleInput() {
  parseCron();
}

function applyPreset(e: Event) {
  const select = e.target as HTMLSelectElement;
  if (select.value) {
    cronExpression.value = select.value;
    parseCron();
    // 重置 select 选中项，以便下次可以选择同一个
    select.value = "";
  }
}

function clearAll() {
  cronExpression.value = "";
  nextRunTimes.value = [];
  cronDescription.value = "";
  error.value = "";
}

// 初始化解析一次
parseCron();
</script>
