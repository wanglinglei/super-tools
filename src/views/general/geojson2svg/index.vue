<template>
  <ToolLayout title="GeoJSON 转 SVG" icon="🗺️">
    <template #header-left>
      <ToolButton icon="upload" text="上传 GeoJSON" @click="selectFile" />
      <ToolButton icon="format" text="转换为 SVG" @click="convertToSvg" />
      <ToolButton icon="copy" text="复制 SVG" :disabled="!svgOutput" @click="copySvg" />
    </template>

    <template #header-right>
      <ToolButton
        type="icon"
        icon="download"
        title="下载 SVG"
        :disabled="!svgOutput"
        @click="downloadSvg"
      />
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <div class="max-w-7xl mx-auto space-y-3">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div class="card-p space-y-3">
          <div class="flex-between">
            <h2 class="text-title">GeoJSON 文件</h2>
            <span class="text-hint">支持 .geojson / .json</span>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept=".geojson,.json,application/geo+json,application/json"
            class="hidden"
            @change="handleFileChange"
          />
          <div
            v-if="!fileName"
            class="rounded-lg border border-dashed p-8 text-center transition-colors"
            :class="
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            "
            @dragenter.prevent="onDragEnter"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
          >
            <div class="text-3xl mb-2">📁</div>
            <div class="text-sm text-gray-600 mb-1">拖拽 GeoJSON 文件到这里</div>
            <div class="text-xs text-gray-500 mb-3">或点击下方按钮选择文件</div>
            <button class="btn-sm" @click="selectFile">选择文件</button>
          </div>
          <div v-else class="space-y-2">
            <div class="rounded-lg bg-blue-50 p-3 flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-800">{{ fileName }}</div>
                <div class="text-xs text-gray-500">大小：{{ formatBytes(fileSize) }}</div>
              </div>
              <button class="btn-sm" @click="selectFile">重新上传</button>
            </div>
            <div class="rounded-lg border border-gray-200 bg-gray-900 text-gray-100 p-3 text-xs overflow-auto max-h-96">
              <pre><code>{{ geojsonInput }}</code></pre>
            </div>
          </div>
        </div>

        <div class="card-p space-y-3">
          <h2 class="text-title">输出设置</h2>
          <div class="grid grid-cols-2 gap-2">
            <label class="text-sm text-gray-700">
              宽度
              <input v-model.number="svgWidth" type="number" min="64" class="input-base mt-1" />
            </label>
            <label class="text-sm text-gray-700">
              高度
              <input v-model.number="svgHeight" type="number" min="64" class="input-base mt-1" />
            </label>
            <label class="text-sm text-gray-700">
              填充色
              <input v-model="fillColor" type="color" class="input-base h-10 mt-1 p-1" />
            </label>
            <label class="text-sm text-gray-700">
              描边色
              <input v-model="strokeColor" type="color" class="input-base h-10 mt-1 p-1" />
            </label>
            <label class="text-sm text-gray-700 col-span-2">
              描边宽度
              <input
                v-model.number="strokeWidth"
                type="number"
                min="0"
                step="0.5"
                class="input-base mt-1"
              />
            </label>
          </div>

          <div v-if="svgOutput" class="grid grid-cols-3 gap-2">
            <div class="rounded-lg bg-blue-50 p-2 text-center">
              <div class="text-xs text-gray-600">路径数量</div>
              <div class="text-lg font-bold text-blue-600">{{ pathCount }}</div>
            </div>
            <div class="rounded-lg bg-green-50 p-2 text-center">
              <div class="text-xs text-gray-600">宽度</div>
              <div class="text-lg font-bold text-green-600">{{ svgWidth }}</div>
            </div>
            <div class="rounded-lg bg-purple-50 p-2 text-center">
              <div class="text-xs text-gray-600">高度</div>
              <div class="text-lg font-bold text-purple-600">{{ svgHeight }}</div>
            </div>
          </div>

          <div v-if="svgOutput" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700">SVG 预览</h3>
            <div class="preview-box" v-html="svgOutput"></div>
          </div>
        </div>
      </div>

      <div class="card-p">
        <div class="flex-between mb-2">
          <h2 class="text-title">SVG 代码</h2>
          <button class="btn-sm" :disabled="!svgOutput" @click="copySvg">复制代码</button>
        </div>
        <pre class="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-80"><code>{{
          svgOutput || "转换后会在这里显示 SVG 代码"
        }}</code></pre>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import geojson2svgPkg from "geojson2svg";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import { copyToClipboard, downloadFile } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

type RawGeoJSON = Record<string, any>;

const { GeoJSON2SVG } = geojson2svgPkg as unknown as {
  GeoJSON2SVG: new (options: Record<string, any>) => {
    convert: (geojson: RawGeoJSON) => string[];
  };
};

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

const fileInputRef = ref<HTMLInputElement | null>(null);
const fileName = ref("");
const fileSize = ref(0);
const isDragging = ref(false);
const geojsonInput = ref("");
const svgOutput = ref("");
const svgWidth = ref(800);
const svgHeight = ref(500);
const fillColor = ref("#3b82f6");
const strokeColor = ref("#1d4ed8");
const strokeWidth = ref(1.5);

const pathCount = computed(() => {
  if (!svgOutput.value) {
    return 0;
  }
  return (svgOutput.value.match(/<path\b/g) || []).length;
});

function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 100 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function selectFile() {
  fileInputRef.value?.click();
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }

  await processFile(file);
  target.value = "";
}

async function processFile(file: File) {
  try {
    const text = await file.text();
    JSON.parse(text);
    fileName.value = file.name;
    fileSize.value = file.size;
    geojsonInput.value = text;
    showMessage("文件读取成功");
    convertToSvg();
  } catch (error) {
    console.error("读取 GeoJSON 文件失败:", error);
    showMessage("文件格式无效，请上传合法的 GeoJSON/JSON", "error");
  }
}

function isSupportedGeojsonFile(file: File) {
  const lowerName = file.name.toLowerCase();
  const validExt = lowerName.endsWith(".geojson") || lowerName.endsWith(".json");
  const validMime =
    file.type === "application/geo+json" || file.type === "application/json" || file.type === "";
  return validExt || validMime;
}

function onDragEnter() {
  isDragging.value = true;
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave(event: DragEvent) {
  const current = event.currentTarget as HTMLElement | null;
  const related = event.relatedTarget as Node | null;
  if (current && related && current.contains(related)) {
    return;
  }
  isDragging.value = false;
}

async function onDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file) {
    return;
  }
  if (!isSupportedGeojsonFile(file)) {
    showMessage("仅支持 .geojson 或 .json 文件", "warning");
    return;
  }
  await processFile(file);
}

function collectPoints(raw: unknown, points: Array<[number, number]>) {
  if (!Array.isArray(raw)) {
    return;
  }

  if (typeof raw[0] === "number" && typeof raw[1] === "number") {
    points.push([raw[0], raw[1]]);
    return;
  }

  for (const item of raw) {
    collectPoints(item, points);
  }
}

function collectCoordinates(geojson: RawGeoJSON, points: Array<[number, number]>) {
  if (!geojson || typeof geojson !== "object") {
    return;
  }

  if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
    for (const feature of geojson.features) {
      collectCoordinates(feature, points);
    }
    return;
  }

  if (geojson.type === "Feature" && geojson.geometry) {
    collectCoordinates(geojson.geometry, points);
    return;
  }

  if (geojson.coordinates) {
    collectPoints(geojson.coordinates, points);
  }

  if (geojson.geometries && Array.isArray(geojson.geometries)) {
    for (const geometry of geojson.geometries) {
      collectCoordinates(geometry, points);
    }
  }
}

function getMapExtent(geojson: RawGeoJSON) {
  const points: Array<[number, number]> = [];
  collectCoordinates(geojson, points);

  if (points.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const extentWidth = Math.max(maxX - minX, 1e-6);
  const extentHeight = Math.max(maxY - minY, 1e-6);
  const padding = Math.max(extentWidth, extentHeight) * 0.05;

  return {
    left: minX - padding,
    bottom: minY - padding,
    right: maxX + padding,
    top: maxY + padding,
  };
}

function normalizeExtentToViewport(
  extent: { left: number; bottom: number; right: number; top: number },
  viewportWidth: number,
  viewportHeight: number
) {
  const width = Math.max(extent.right - extent.left, 1e-6);
  const height = Math.max(extent.top - extent.bottom, 1e-6);
  const viewportAspect = Math.max(viewportWidth, 1) / Math.max(viewportHeight, 1);
  const extentAspect = width / height;

  const centerX = (extent.left + extent.right) / 2;
  const centerY = (extent.bottom + extent.top) / 2;

  if (extentAspect > viewportAspect) {
    const targetHeight = width / viewportAspect;
    const halfHeight = targetHeight / 2;
    return {
      left: extent.left,
      right: extent.right,
      bottom: centerY - halfHeight,
      top: centerY + halfHeight,
    };
  }

  const targetWidth = height * viewportAspect;
  const halfWidth = targetWidth / 2;
  return {
    left: centerX - halfWidth,
    right: centerX + halfWidth,
    bottom: extent.bottom,
    top: extent.top,
  };
}

function convertToSvg() {
  if (!geojsonInput.value.trim()) {
    showMessage("请先上传 GeoJSON 文件", "warning");
    return;
  }

  try {
    const geojson = JSON.parse(geojsonInput.value) as RawGeoJSON;
    const rawExtent = getMapExtent(geojson);
    if (!rawExtent) {
      showMessage("未找到有效坐标，请检查 GeoJSON 数据", "error");
      return;
    }
    const mapExtent = normalizeExtentToViewport(rawExtent, svgWidth.value, svgHeight.value);

    const converter = new GeoJSON2SVG({
      viewportSize: {
        width: svgWidth.value,
        height: svgHeight.value,
      },
      mapExtent,
      attributes: {
        fill: fillColor.value,
        stroke: strokeColor.value,
        "stroke-width": strokeWidth.value,
      },
    });

    const pathList = converter.convert(geojson);
    if (!Array.isArray(pathList) || pathList.length === 0) {
      showMessage("转换结果为空，请检查输入数据", "error");
      return;
    }

    svgOutput.value = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth.value}" height="${svgHeight.value}" viewBox="0 0 ${svgWidth.value} ${svgHeight.value}">\n${pathList.join("\n")}\n</svg>`;
    showMessage("转换成功");
  } catch (error) {
    console.error("GeoJSON 转 SVG 失败:", error);
    showMessage((error as Error).message || "转换失败", "error");
  }
}

async function copySvg() {
  if (!svgOutput.value) {
    showMessage("暂无可复制的 SVG", "warning");
    return;
  }
  const success = await copyToClipboard(svgOutput.value);
  showMessage(success ? "SVG 已复制" : "复制失败", success ? "success" : "error");
}

function downloadSvg() {
  if (!svgOutput.value) {
    showMessage("请先完成转换", "warning");
    return;
  }

  try {
    downloadFile(svgOutput.value, {
      filename: "geojson.svg",
      mimeType: "image/svg+xml",
      addTimestamp: true,
    });
    showMessage("下载成功");
  } catch (error) {
    showMessage((error as Error).message || "下载失败", "error");
  }
}

function clearAll() {
  fileName.value = "";
  fileSize.value = 0;
  isDragging.value = false;
  geojsonInput.value = "";
  svgOutput.value = "";
  showMessage("已清空");
}
</script>

<style scoped>
.preview-box {
  @apply border border-gray-200 rounded-lg bg-white p-3 overflow-auto;
  min-height: 260px;
}

.preview-box :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>
