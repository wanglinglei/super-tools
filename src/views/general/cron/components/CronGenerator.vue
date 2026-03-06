<template>
  <div class="flex flex-col h-full">
    <!-- Tab 切换 -->
    <div class="flex border-b border-gray-200 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 focus:outline-none"
        :class="{ 'border-b-2 border-blue-600 text-blue-600': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 配置区域 -->
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="activeTab === 'second'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="second.type" value="*" class="form-radio text-blue-600" />
            <span>每秒</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="second.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从 <input type="number" v-model="second.start" min="0" max="59" class="w-16 input-sm" /> 秒开始，每 <input type="number" v-model="second.step" min="1" max="59" class="w-16 input-sm" /> 秒执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="second.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="second.specific" placeholder="1,2,3" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'minute'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="minute.type" value="*" class="form-radio text-blue-600" />
            <span>每分钟</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="minute.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从 <input type="number" v-model="minute.start" min="0" max="59" class="w-16 input-sm" /> 分开始，每 <input type="number" v-model="minute.step" min="1" max="59" class="w-16 input-sm" /> 分执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="minute.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="minute.specific" placeholder="1,2,3" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'hour'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="hour.type" value="*" class="form-radio text-blue-600" />
            <span>每小时</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="hour.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从 <input type="number" v-model="hour.start" min="0" max="23" class="w-16 input-sm" /> 时开始，每 <input type="number" v-model="hour.step" min="1" max="23" class="w-16 input-sm" /> 时执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="hour.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="hour.specific" placeholder="1,2,3" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'day'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="day.type" value="*" class="form-radio text-blue-600" />
            <span>每日</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="day.type" value="?" class="form-radio text-blue-600" />
            <span>不指定 (用于周配置生效时)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="day.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从 <input type="number" v-model="day.start" min="1" max="31" class="w-16 input-sm" /> 日开始，每 <input type="number" v-model="day.step" min="1" max="31" class="w-16 input-sm" /> 日执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="day.type" value="last" class="form-radio text-blue-600" />
            <span>本月最后一天</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="day.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="day.specific" placeholder="1,2,3" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'month'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="month.type" value="*" class="form-radio text-blue-600" />
            <span>每月</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="month.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从 <input type="number" v-model="month.start" min="1" max="12" class="w-16 input-sm" /> 月开始，每 <input type="number" v-model="month.step" min="1" max="12" class="w-16 input-sm" /> 月执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="month.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="month.specific" placeholder="1,2,3" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>

      <div v-if="activeTab === 'week'">
        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="week.type" value="*" class="form-radio text-blue-600" />
            <span>每周</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="week.type" value="?" class="form-radio text-blue-600" />
            <span>不指定 (用于日配置生效时)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="week.type" value="cycle" class="form-radio text-blue-600" />
            <span>周期: 从星期 <input type="number" v-model="week.start" min="1" max="7" class="w-16 input-sm" /> 开始，每 <input type="number" v-model="week.step" min="1" max="7" class="w-16 input-sm" /> 周执行一次</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="radio" v-model="week.type" value="range" class="form-radio text-blue-600" />
            <span>指定: <input type="text" v-model="week.specific" placeholder="MON,TUE,WED" class="input-sm w-full" /></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const activeTab = ref("second");
const tabs = [
  { label: "秒", value: "second" },
  { label: "分", value: "minute" },
  { label: "时", value: "hour" },
  { label: "日", value: "day" },
  { label: "月", value: "month" },
  { label: "周", value: "week" },
];

const second = reactive({ type: "*", start: 0, step: 1, specific: "" });
const minute = reactive({ type: "*", start: 0, step: 1, specific: "" });
const hour = reactive({ type: "*", start: 0, step: 1, specific: "" });
const day = reactive({ type: "*", start: 1, step: 1, specific: "" });
const month = reactive({ type: "*", start: 1, step: 1, specific: "" });
const week = reactive({ type: "?", start: 1, step: 1, specific: "" });

function generateCron() {
  const parts = [];

  // Second
  if (second.type === "*") parts.push("*");
  else if (second.type === "cycle") parts.push(`${second.start}/${second.step}`);
  else if (second.type === "range") parts.push(second.specific || "*");

  // Minute
  if (minute.type === "*") parts.push("*");
  else if (minute.type === "cycle") parts.push(`${minute.start}/${minute.step}`);
  else if (minute.type === "range") parts.push(minute.specific || "*");

  // Hour
  if (hour.type === "*") parts.push("*");
  else if (hour.type === "cycle") parts.push(`${hour.start}/${hour.step}`);
  else if (hour.type === "range") parts.push(hour.specific || "*");

  // Day
  if (day.type === "*") parts.push("*");
  else if (day.type === "?") parts.push("?");
  else if (day.type === "cycle") parts.push(`${day.start}/${day.step}`);
  else if (day.type === "last") parts.push("L");
  else if (day.type === "range") parts.push(day.specific || "*");

  // Month
  if (month.type === "*") parts.push("*");
  else if (month.type === "cycle") parts.push(`${month.start}/${month.step}`);
  else if (month.type === "range") parts.push(month.specific || "*");

  // Week
  if (week.type === "*") parts.push("*");
  else if (week.type === "?") parts.push("?");
  else if (week.type === "cycle") parts.push(`${week.start}/${week.step}`);
  else if (week.type === "range") parts.push(week.specific || "?");

  const cron = parts.join(" ");
  emit("update:modelValue", cron);
  emit("change", cron);
}

watch([second, minute, hour, day, month, week], generateCron, { deep: true });
</script>

<style scoped>
.input-sm {
  @apply border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500;
}
</style>
