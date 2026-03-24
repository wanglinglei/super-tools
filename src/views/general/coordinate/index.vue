<template>
  <ToolLayout title="坐标系转换" icon="📍">
    <template #header-right>
      <ToolButton type="icon" icon="switch" title="交换源/目标" @click="swapTypes" />
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <div class="max-w-6xl mx-auto space-y-3">
      <div class="card-p space-y-3">
        <div class="flex-between">
          <h2 class="text-title">坐标系选择</h2>
          <span class="text-hint">经度在前，纬度在后</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="text-sm text-gray-700">
            源坐标系
            <select v-model="sourceType" class="input-base mt-1">
              <option v-for="item in coordinateOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
          <label class="text-sm text-gray-700">
            目标坐标系
            <select v-model="targetType" class="input-base mt-1">
              <option v-for="item in coordinateOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <div class="card-p space-y-3">
        <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
          <button
            class="tab-btn"
            :class="{ 'tab-btn-active': activeTab === 'single' }"
            @click="activeTab = 'single'"
          >
            坐标转换
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn-active': activeTab === 'batch' }"
            @click="activeTab = 'batch'"
          >
            批量转换
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn-active': activeTab === 'geojson' }"
            @click="activeTab = 'geojson'"
          >
            GeoJSON 转换
          </button>
        </div>

        <div v-if="activeTab === 'single'" class="space-y-3">
          <div class="flex-between">
            <h2 class="text-title">坐标转换</h2>
            <div class="flex items-center gap-2">
              <button class="btn-sm" @click="runConvert">执行转换</button>
              <button class="btn-sm" :disabled="!resultText" @click="copyResult">复制</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="text-sm text-gray-700">
              经度 (lng)
              <input
                v-model.trim="longitudeInput"
                type="text"
                placeholder="例如：116.397128"
                class="input-base mt-1"
              />
            </label>
            <label class="text-sm text-gray-700">
              纬度 (lat)
              <input
                v-model.trim="latitudeInput"
                type="text"
                placeholder="例如：39.916527"
                class="input-base mt-1"
              />
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="rounded-lg bg-blue-50 p-3">
              <div class="text-xs text-gray-600 mb-1">目标经度</div>
              <div class="text-lg font-bold text-blue-600 font-mono break-all">
                {{ resultLng || "--" }}
              </div>
            </div>
            <div class="rounded-lg bg-purple-50 p-3">
              <div class="text-xs text-gray-600 mb-1">目标纬度</div>
              <div class="text-lg font-bold text-purple-600 font-mono break-all">
                {{ resultLat || "--" }}
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm text-gray-700">
            {{ resultText || "输入经纬度并点击“执行转换”后显示结果" }}
          </div>
        </div>

        <div v-else-if="activeTab === 'batch'" class="space-y-3">
          <div class="flex-between">
            <h2 class="text-title">批量转换</h2>
            <div class="flex items-center gap-2">
              <button class="btn-sm" @click="runBatchConvert">执行转换</button>
              <button class="btn-sm" :disabled="!batchResultText" @click="copyBatchResult">
                复制结果
              </button>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            每行一组坐标，格式：lng,lat（也支持空格分隔），例如：
            <span class="font-mono">116.397128,39.916527</span>
          </div>
          <textarea
            v-model.trim="batchInput"
            class="input-base min-h-36 font-mono text-sm"
            placeholder="116.397128,39.916527&#10;121.473701 31.230416"
          />
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm text-gray-700 whitespace-pre-wrap">
            {{ batchResultText || "点击“执行转换”后在这里显示结果" }}
          </div>
        </div>

        <div v-else class="space-y-3">
          <div class="flex-between">
            <h2 class="text-title">GeoJSON 坐标转换</h2>
            <div class="flex items-center gap-2">
              <button class="btn-sm" @click="selectGeojsonFile">上传 GeoJSON</button>
              <button class="btn-sm" @click="runGeojsonConvert">转换数据</button>
              <button class="btn-sm" :disabled="!geojsonOutputText" @click="downloadGeojson">
                下载结果
              </button>
            </div>
          </div>
          <input
            ref="geojsonFileInputRef"
            type="file"
            accept=".geojson,.json,application/geo+json,application/json"
            class="hidden"
            @change="handleGeojsonFileChange"
          />
          <div class="text-xs text-gray-500">
            上传后会基于当前“源坐标系 -> 目标坐标系”批量转换 GeoJSON 中所有几何坐标。
          </div>
          <div class="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm text-gray-700">
            {{ geojsonStatusText }}
          </div>
          <textarea
            v-model="geojsonOutputText"
            class="input-base min-h-48 font-mono text-xs"
            placeholder="转换后的 GeoJSON 将显示在这里"
            readonly
          />
        </div>
      </div>

      <div class="card-p space-y-2">
        <h2 class="text-title">坐标系说明</h2>
        <ul class="text-sm text-gray-700 leading-6 list-disc list-inside space-y-1">
          <li>WGS84：国际通用 GPS 坐标体系，Google 地图等常用。</li>
          <li>GCJ-02：国内地图常用加密坐标系（火星坐标系），高德等使用。</li>
          <li>BD-09：百度地图坐标系，在 GCJ-02 基础上进一步偏移处理。</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import coordtransform from "coordtransform";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import { copyToClipboard, downloadFile } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

type CoordinateType = "WGS84" | "GCJ02" | "BD09";
type ConvertFn = (lng: number, lat: number) => [number, number];
type TabType = "single" | "batch" | "geojson";

const showMessage = inject<(text: string, type?: MessageType) => void>("showMessage")!;
const activeTab = ref<TabType>("single");

const coordinateOptions: Array<{ label: string; value: CoordinateType }> = [
  { label: "WGS84（地球坐标）", value: "WGS84" },
  { label: "GCJ-02（火星坐标）", value: "GCJ02" },
  { label: "BD-09（百度坐标）", value: "BD09" },
];

const sourceType = ref<CoordinateType>("WGS84");
const targetType = ref<CoordinateType>("GCJ02");
const longitudeInput = ref("");
const latitudeInput = ref("");
const resultLng = ref("");
const resultLat = ref("");
const batchInput = ref("");
const batchResultText = ref("");
const geojsonFileInputRef = ref<HTMLInputElement | null>(null);
const geojsonFileName = ref("");
const geojsonInputText = ref("");
const geojsonOutputText = ref("");
const geojsonConvertedPointCount = ref(0);

const resultText = computed(() => {
  if (!resultLng.value || !resultLat.value) {
    return "";
  }
  return `${sourceType.value} -> ${targetType.value}: ${resultLng.value}, ${resultLat.value}`;
});

const geojsonStatusText = computed(() => {
  if (!geojsonInputText.value) {
    return "请先上传 GeoJSON 文件";
  }
  if (!geojsonOutputText.value) {
    return `已加载文件：${geojsonFileName.value || "未命名文件"}，点击“转换数据”开始处理`;
  }
  return `已完成转换：${geojsonFileName.value || "未命名文件"}，共处理 ${geojsonConvertedPointCount.value} 个坐标点`;
});

const converterMap: Record<string, ConvertFn> = {
  "WGS84->GCJ02": (lng, lat) => coordtransform.wgs84togcj02(lng, lat) as [number, number],
  "WGS84->BD09": (lng, lat) => coordtransform.wgs84tobd09(lng, lat) as [number, number],
  "GCJ02->WGS84": (lng, lat) => coordtransform.gcj02towgs84(lng, lat) as [number, number],
  "GCJ02->BD09": (lng, lat) => coordtransform.gcj02tobd09(lng, lat) as [number, number],
  "BD09->WGS84": (lng, lat) => coordtransform.bd09towgs84(lng, lat) as [number, number],
  "BD09->GCJ02": (lng, lat) => coordtransform.bd09togcj02(lng, lat) as [number, number],
};

function runConvert() {
  if (sourceType.value === targetType.value) {
    showMessage("源坐标系与目标坐标系不能相同", "warning");
    return;
  }

  const lng = Number(longitudeInput.value);
  const lat = Number(latitudeInput.value);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    showMessage("请输入合法的经纬度数值", "error");
    return;
  }

  const convertKey = `${sourceType.value}->${targetType.value}`;
  const converter = converterMap[convertKey];
  if (!converter) {
    showMessage("暂不支持该转换类型", "error");
    return;
  }

  try {
    const [nextLng, nextLat] = converter(lng, lat);
    resultLng.value = nextLng.toFixed(6);
    resultLat.value = nextLat.toFixed(6);
    showMessage("转换成功");
  } catch (error) {
    console.error("坐标转换失败:", error);
    showMessage("转换失败，请检查输入", "error");
  }
}

function convertCoordinate(lng: number, lat: number): [number, number] | null {
  const convertKey = `${sourceType.value}->${targetType.value}`;
  const converter = converterMap[convertKey];
  if (!converter) {
    return null;
  }
  return converter(lng, lat);
}

function transformCoordinates(raw: unknown, counter: { value: number }): unknown {
  if (!Array.isArray(raw)) {
    return raw;
  }

  if (
    raw.length >= 2 &&
    typeof raw[0] === "number" &&
    typeof raw[1] === "number" &&
    Number.isFinite(raw[0]) &&
    Number.isFinite(raw[1])
  ) {
    const converted = convertCoordinate(raw[0], raw[1]);
    if (!converted) {
      return raw;
    }
    counter.value += 1;
    return [converted[0], converted[1], ...raw.slice(2)];
  }

  return raw.map((item) => transformCoordinates(item, counter));
}

function transformGeojsonNode(node: unknown, counter: { value: number }): unknown {
  if (!node || typeof node !== "object") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => transformGeojsonNode(item, counter));
  }

  const record = node as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === "coordinates") {
      next[key] = transformCoordinates(value, counter);
      continue;
    }
    if (key === "bbox") {
      next[key] = value;
      continue;
    }
    next[key] = transformGeojsonNode(value, counter);
  }
  return next;
}

function runBatchConvert() {
  if (sourceType.value === targetType.value) {
    showMessage("源坐标系与目标坐标系不能相同", "warning");
    return;
  }

  if (!batchInput.value.trim()) {
    showMessage("请先输入批量坐标数据", "warning");
    return;
  }

  const converter = convertCoordinate;
  const lines = batchInput.value.split(/\r?\n/);
  const outputs: string[] = [];
  let successCount = 0;

  lines.forEach((line, index) => {
    const raw = line.trim();
    if (!raw) {
      return;
    }

    const normalized = raw.replace(/，/g, ",");
    const parts = normalized.includes(",")
      ? normalized.split(",").map((item) => item.trim())
      : normalized.split(/\s+/).map((item) => item.trim());

    if (parts.length < 2) {
      outputs.push(`第 ${index + 1} 行: 格式错误 -> ${raw}`);
      return;
    }

    const lng = Number(parts[0]);
    const lat = Number(parts[1]);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      outputs.push(`第 ${index + 1} 行: 坐标非法 -> ${raw}`);
      return;
    }

    try {
      const next = converter(lng, lat);
      if (!next) {
        outputs.push(`第 ${index + 1} 行: 暂不支持该转换类型`);
        return;
      }

      const [nextLng, nextLat] = next;
      outputs.push(`${nextLng.toFixed(6)},${nextLat.toFixed(6)}`);
      successCount += 1;
    } catch {
      outputs.push(`第 ${index + 1} 行: 转换失败 -> ${raw}`);
    }
  });

  batchResultText.value = outputs.join("\n");
  if (!outputs.length) {
    showMessage("未识别到有效输入行", "warning");
    return;
  }

  showMessage(`批量转换完成：成功 ${successCount} 行，共 ${outputs.length} 行`);
}

function selectGeojsonFile() {
  geojsonFileInputRef.value?.click();
}

async function handleGeojsonFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    JSON.parse(text);
    geojsonFileName.value = file.name;
    geojsonInputText.value = text;
    geojsonOutputText.value = "";
    geojsonConvertedPointCount.value = 0;
    showMessage("GeoJSON 文件加载成功");
  } catch {
    showMessage("文件内容不是合法 JSON/GeoJSON", "error");
  } finally {
    target.value = "";
  }
}

function runGeojsonConvert() {
  if (sourceType.value === targetType.value) {
    showMessage("源坐标系与目标坐标系不能相同", "warning");
    return;
  }
  if (!geojsonInputText.value.trim()) {
    showMessage("请先上传 GeoJSON 文件", "warning");
    return;
  }

  try {
    const rawGeojson = JSON.parse(geojsonInputText.value) as unknown;
    const counter = { value: 0 };
    const convertedGeojson = transformGeojsonNode(rawGeojson, counter);
    geojsonOutputText.value = JSON.stringify(convertedGeojson, null, 2);
    geojsonConvertedPointCount.value = counter.value;
    showMessage(`GeoJSON 转换完成，共处理 ${counter.value} 个坐标点`);
  } catch (error) {
    console.error("GeoJSON 坐标转换失败:", error);
    showMessage("GeoJSON 转换失败，请检查文件内容", "error");
  }
}

function downloadGeojson() {
  if (!geojsonOutputText.value) {
    showMessage("请先完成 GeoJSON 转换", "warning");
    return;
  }

  const originalName = geojsonFileName.value || "geojson";
  const baseName = originalName.replace(/\.(geojson|json)$/i, "");
  const filename = `${baseName}_${sourceType.value.toLowerCase()}_to_${targetType.value.toLowerCase()}.geojson`;

  try {
    downloadFile(geojsonOutputText.value, {
      filename,
      mimeType: "application/geo+json",
      addTimestamp: true,
    });
    showMessage("GeoJSON 下载成功");
  } catch (error) {
    showMessage((error as Error).message || "下载失败", "error");
  }
}

function swapTypes() {
  const prevSource = sourceType.value;
  sourceType.value = targetType.value;
  targetType.value = prevSource;
}

async function copyResult() {
  if (!resultText.value) {
    showMessage("暂无可复制结果", "warning");
    return;
  }
  const success = await copyToClipboard(resultText.value);
  showMessage(success ? "已复制结果" : "复制失败", success ? "success" : "error");
}

async function copyBatchResult() {
  if (!batchResultText.value) {
    showMessage("暂无可复制结果", "warning");
    return;
  }
  const success = await copyToClipboard(batchResultText.value);
  showMessage(success ? "已复制批量结果" : "复制失败", success ? "success" : "error");
}

function clearAll() {
  longitudeInput.value = "";
  latitudeInput.value = "";
  resultLng.value = "";
  resultLat.value = "";
  batchInput.value = "";
  batchResultText.value = "";
  geojsonFileName.value = "";
  geojsonInputText.value = "";
  geojsonOutputText.value = "";
  geojsonConvertedPointCount.value = 0;
  showMessage("已清空");
}
</script>

<style scoped>
.tab-btn {
  @apply px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-600 bg-white transition-colors;
}

.tab-btn-active {
  @apply border-blue-500 text-blue-600 bg-blue-50;
}
</style>
