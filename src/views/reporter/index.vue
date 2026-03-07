<template>
  <ToolLayout title="对话分析报告" icon="📊">
    <template #header-left>
      <ToolButton icon="format" text="刷新" @click="loadData" />
    </template>

    <div class="max-w-7xl mx-auto space-y-3 pb-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 gap-3">
        <div class="card-p text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.total ?? '–' }}</div>
          <div class="text-xs text-gray-500 mt-1">总记录数</div>
        </div>
        <div class="card-p text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.avg_score ?? '–' }}</div>
          <div class="text-xs text-gray-500 mt-1">平均质量分</div>
        </div>
        <div class="card-p text-center">
          <div class="text-2xl font-bold text-purple-600">{{ lastReported }}</div>
          <div class="text-xs text-gray-500 mt-1">最近上报</div>
        </div>
      </div>

      <!-- 搜索筛选栏 -->
      <div class="card-p flex gap-3 flex-wrap items-center">
        <input
          v-model="filter.keyword"
          type="text"
          placeholder="搜索问题场景 / 解决逻辑..."
          class="input-base flex-1 min-w-48"
          @keyup.enter="doSearch"
        />
        <input
          v-model="filter.workspaceSlug"
          type="text"
          placeholder="工作区过滤"
          class="input-base w-40"
          @keyup.enter="doSearch"
        />
        <select v-model="filter.pageSize" class="input-base w-24" @change="doSearch">
          <option value="10">10 条</option>
          <option value="20">20 条</option>
          <option value="50">50 条</option>
        </select>
        <button class="btn-primary px-4 py-1.5 rounded-lg text-sm" @click="doSearch">搜索</button>
        <button class="btn-sm border border-gray-200" @click="resetFilter">重置</button>
      </div>

      <!-- 数据表格 -->
      <div class="card-p overflow-x-auto">
        <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
          <div class="animate-spin text-2xl mr-2">⏳</div>
          <span>加载中...</span>
        </div>
        <div v-else-if="list.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
          <div class="text-4xl mb-3">📭</div>
          <div class="text-sm">暂无数据</div>
        </div>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-xs text-gray-500">
              <th class="text-left py-2 pr-3 font-medium w-20">质量分</th>
              <th class="text-left py-2 pr-3 font-medium w-28">工作区</th>
              <th class="text-left py-2 pr-3 font-medium w-24">技术栈</th>
              <th class="text-left py-2 pr-3 font-medium">问题场景</th>
              <th class="text-left py-2 pr-3 font-medium">解决思路</th>
              <th class="text-left py-2 pr-3 font-medium w-32">上报时间</th>
              <th class="text-left py-2 font-medium w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in list" :key="row.conversation_id">
              <tr
                class="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                @click="toggleExpand(row.conversation_id)"
              >
                <td class="py-2.5 pr-3">
                  <span :class="scoreClass(row.quality_score)" class="inline-block px-2 py-0.5 rounded-full text-xs font-bold">
                    {{ row.quality_score ?? '–' }}
                  </span>
                </td>
                <td class="py-2.5 pr-3 text-gray-600 truncate max-w-28">{{ row.workspace_slug || '–' }}</td>
                <td class="py-2.5 pr-3 text-gray-500 text-xs truncate max-w-24">{{ row.language_stack || '–' }}</td>
                <td class="py-2.5 pr-3 text-gray-700 max-w-xs">
                  <div class="line-clamp-2">{{ row.problem_scenario }}</div>
                </td>
                <td class="py-2.5 pr-3 text-gray-600 max-w-xs">
                  <div class="line-clamp-2">{{ row.solution_logic || '–' }}</div>
                </td>
                <td class="py-2.5 pr-3 text-gray-400 text-xs whitespace-nowrap">{{ formatDate(row.reported_at) }}</td>
                <td class="py-2.5">
                  <button
                    class="text-blue-400 hover:text-blue-600 text-xs transition-colors"
                    @click.stop="toggleExpand(row.conversation_id)"
                  >
                    {{ expanded === row.conversation_id ? '收起' : '展开' }}
                  </button>
                </td>
              </tr>
              <!-- 展开详情行 -->
              <tr v-if="expanded === row.conversation_id" :key="`${row.conversation_id}-detail`">
                <td colspan="7" class="pb-4 pt-1 px-2">
                  <div class="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                    <div class="grid grid-cols-2 gap-3 text-xs text-gray-500">
                      <div><span class="font-medium text-gray-700">会话 ID：</span>{{ row.conversation_id }}</div>
                      <div><span class="font-medium text-gray-700">用户：</span>{{ row.user_id || '–' }}</div>
                      <div><span class="font-medium text-gray-700">项目：</span>{{ row.project_id || '–' }}</div>
                      <div><span class="font-medium text-gray-700">创建时间：</span>{{ formatDate(row.created_at) }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-medium text-gray-700 mb-1">问题场景</div>
                      <div class="text-gray-600 leading-relaxed">{{ row.problem_scenario }}</div>
                    </div>
                    <div v-if="row.solution_logic">
                      <div class="text-xs font-medium text-gray-700 mb-1">解决思路</div>
                      <div class="text-gray-600 leading-relaxed">{{ row.solution_logic }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
        <button
          class="btn-sm border border-gray-200 px-3"
          :disabled="filter.page <= 1"
          :class="{ 'opacity-40 cursor-not-allowed': filter.page <= 1 }"
          @click="goPage(filter.page - 1)"
        >← 上一页</button>
        <span class="text-sm text-gray-500">
          第 <span class="font-medium text-gray-800">{{ filter.page }}</span> / {{ totalPages }} 页
          &nbsp;共 <span class="font-medium text-gray-800">{{ total }}</span> 条
        </span>
        <button
          class="btn-sm border border-gray-200 px-3"
          :disabled="filter.page >= totalPages"
          :class="{ 'opacity-40 cursor-not-allowed': filter.page >= totalPages }"
          @click="goPage(filter.page + 1)"
        >下一页 →</button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import type { MessageType } from "@/composables/useMessage";

const showMessage = inject<(text: string, type?: MessageType) => void>("showMessage");

// ── 接口类型 ────────────────────────────────────────────────────────────────────

interface AnalysisRow {
  conversation_id: string;
  workspace_slug: string;
  user_id: string;
  project_id: string;
  problem_scenario: string;
  solution_logic: string;
  language_stack: string;
  quality_score: number | null;
  reported_at: string;
  created_at: string;
}

interface Stats {
  total: number | null;
  avg_score: number | null;
  last_reported: string | null;
}

// ── 状态 ────────────────────────────────────────────────────────────────────────

const loading = ref(false);
const list    = ref<AnalysisRow[]>([]);
const total   = ref(0);
const stats   = ref<Stats>({ total: null, avg_score: null, last_reported: null });
const expanded = ref<string | null>(null);

const filter = ref({
  page:          1,
  pageSize:      20,
  keyword:       "",
  workspaceSlug: "",
});

const totalPages = computed(() => Math.ceil(total.value / filter.value.pageSize) || 1);

const lastReported = computed(() => {
  if (!stats.value.last_reported) return "–";
  return formatDate(stats.value.last_reported);
});

// ── 请求 ────────────────────────────────────────────────────────────────────────

const BASE = (import.meta.env.VITE_REPORTER_API as string) || "/reporter-api";

async function fetchList() {
  const { page, pageSize, keyword, workspaceSlug } = filter.value;
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    ...(keyword && { keyword }),
    ...(workspaceSlug && { workspaceSlug }),
  });
  const res = await fetch(`${BASE}/list?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ total: number; list: AnalysisRow[] }>;
}

async function fetchStats() {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Stats>;
}

async function loadData() {
  loading.value = true;
  expanded.value = null;
  try {
    const [listRes, statsRes] = await Promise.all([fetchList(), fetchStats()]);
    list.value  = listRes.list;
    total.value = listRes.total;
    stats.value = statsRes;
  } catch (err: any) {
    showMessage?.(`加载失败：${err.message}`, "error");
  } finally {
    loading.value = false;
  }
}

// ── 操作 ────────────────────────────────────────────────────────────────────────

function doSearch() {
  filter.value.page = 1;
  loadData();
}

function resetFilter() {
  filter.value = { page: 1, pageSize: 20, keyword: "", workspaceSlug: "" };
  loadData();
}

function goPage(p: number) {
  filter.value.page = p;
  loadData();
}

function toggleExpand(id: string) {
  expanded.value = expanded.value === id ? null : id;
}

// ── 工具函数 ────────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return "–";
  return new Date(d).toLocaleString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function scoreClass(score: number | null) {
  if (score == null) return "bg-gray-100 text-gray-400";
  if (score >= 8)    return "bg-green-100 text-green-700";
  if (score >= 6)    return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-500";
}

onMounted(loadData);
</script>
