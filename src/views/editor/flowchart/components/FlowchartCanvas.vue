<template>
  <div
    class="relative w-full h-full overflow-hidden bg-white select-none"
    ref="containerRef"
    @contextmenu.prevent
  >
    <!-- 文本编辑浮层 -->
    <input
      v-if="editingNodeId"
      ref="textInputRef"
      v-model="editingText"
      class="editing-input"
      :style="editingInputStyle"
      @blur="finishEditing"
      @keydown.enter="finishEditing"
      @keydown.escape="cancelEditing"
    />

    <!-- SVG 画布 -->
    <svg
      ref="svgRef"
      class="w-full h-full"
      :viewBox="viewBoxStr"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      @wheel.prevent="onWheel"
    >
      <defs>
        <!-- 小网格 -->
        <pattern
          id="smallGrid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#f0f0f0"
            stroke-width="0.5"
          />
        </pattern>
        <!-- 大网格 -->
        <pattern
          id="grid"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="1"
          />
        </pattern>
        <!-- 箭头标记 -->
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
        </marker>
        <!-- 选中状态箭头 -->
        <marker
          id="arrowhead-selected"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
        </marker>
        <!-- 连线中箭头 -->
        <marker
          id="arrowhead-connecting"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
        </marker>
      </defs>

      <!-- 网格背景 -->
      <rect
        x="-5000"
        y="-5000"
        width="10000"
        height="10000"
        fill="url(#grid)"
      />

      <!-- 连接线 -->
      <g v-for="conn in connections" :key="conn.id">
        <!-- 透明加粗路径用于点击 -->
        <path
          :d="getConnPath(conn)"
          fill="none"
          stroke="transparent"
          stroke-width="12"
          class="cursor-pointer"
          @mousedown.stop="selectConnection(conn.id)"
        />
        <!-- 可见的连接线 -->
        <path
          :d="getConnPath(conn)"
          fill="none"
          :stroke="selectedConnectionId === conn.id ? '#2563eb' : '#9ca3af'"
          :stroke-width="selectedConnectionId === conn.id ? 2.5 : 2"
          :marker-end="
            selectedConnectionId === conn.id
              ? 'url(#arrowhead-selected)'
              : 'url(#arrowhead)'
          "
          class="pointer-events-none"
        />
        <!-- 连线标签背景 -->
        <text
          v-if="conn.label"
          :x="getConnLabelPos(conn).x"
          :y="getConnLabelPos(conn).y"
          text-anchor="middle"
          dominant-baseline="middle"
          font-weight="500"
          class="conn-text pointer-events-none"
          fill="white"
          stroke="white"
          stroke-width="4"
          paint-order="stroke"
        >
          {{ conn.label }}
        </text>
        <!-- 连线标签文字 -->
        <text
          v-if="conn.label"
          :x="getConnLabelPos(conn).x"
          :y="getConnLabelPos(conn).y"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="selectedConnectionId === conn.id ? '#2563eb' : '#6b7280'"
          font-weight="500"
          class="conn-text pointer-events-none"
        >
          {{ conn.label }}
        </text>
      </g>

      <!-- 临时连接线（正在连线时） -->
      <path
        v-if="isConnecting && connectingFrom"
        :d="tempConnectionPath"
        fill="none"
        stroke="#2563eb"
        stroke-width="2"
        stroke-dasharray="6 3"
        marker-end="url(#arrowhead-connecting)"
        class="pointer-events-none"
      />

      <!-- 对齐辅助线 -->
      <g v-if="isDragging && guides.length > 0">
        <line
          v-for="(guide, index) in guides"
          :key="index"
          :x1="guide.type === 'vertical' ? guide.pos : -5000"
          :y1="guide.type === 'horizontal' ? guide.pos : -5000"
          :x2="guide.type === 'vertical' ? guide.pos : 5000"
          :y2="guide.type === 'horizontal' ? guide.pos : 5000"
          stroke="#f59e0b"
          stroke-width="1"
          stroke-dasharray="4 2"
          class="pointer-events-none"
        />
      </g>

      <!-- 节点 -->
      <g
        v-for="node in nodes"
        :key="node.id"
        class="flowchart-node"
        :class="{ selected: selectedNodeId === node.id }"
        @mousedown.stop="onNodeMouseDown($event, node)"
        @dblclick.stop="onNodeDblClick(node)"
      >
        <!-- 开始/结束 节点：圆角矩形 -->
        <rect
          v-if="node.type === 'start' || node.type === 'end'"
          :x="node.x"
          :y="node.y"
          :width="node.width"
          :height="node.height"
          :rx="node.height / 2"
          :ry="node.height / 2"
          :fill="getNodeConfig(node.type).fillColor"
          :stroke="
            selectedNodeId === node.id
              ? '#2563eb'
              : getNodeConfig(node.type).strokeColor
          "
          :stroke-width="selectedNodeId === node.id ? 2.5 : 2"
        />

        <!-- 处理节点：圆角矩形 -->
        <rect
          v-if="node.type === 'process'"
          :x="node.x"
          :y="node.y"
          :width="node.width"
          :height="node.height"
          rx="6"
          ry="6"
          :fill="getNodeConfig(node.type).fillColor"
          :stroke="
            selectedNodeId === node.id
              ? '#2563eb'
              : getNodeConfig(node.type).strokeColor
          "
          :stroke-width="selectedNodeId === node.id ? 2.5 : 2"
        />

        <!-- 判断节点：菱形 -->
        <polygon
          v-if="node.type === 'decision'"
          :points="getDiamondPointsFn(node)"
          :fill="getNodeConfig(node.type).fillColor"
          :stroke="
            selectedNodeId === node.id
              ? '#2563eb'
              : getNodeConfig(node.type).strokeColor
          "
          :stroke-width="selectedNodeId === node.id ? 2.5 : 2"
        />

        <!-- 输入/输出节点：平行四边形 -->
        <polygon
          v-if="node.type === 'io'"
          :points="getParallelogramPointsFn(node)"
          :fill="getNodeConfig(node.type).fillColor"
          :stroke="
            selectedNodeId === node.id
              ? '#2563eb'
              : getNodeConfig(node.type).strokeColor
          "
          :stroke-width="selectedNodeId === node.id ? 2.5 : 2"
        />

        <!-- 节点文字 -->
        <text
          :x="node.x + node.width / 2"
          :y="node.y + node.height / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="
            selectedNodeId === node.id
              ? '#1e40af'
              : getNodeConfig(node.type).textColor
          "
          font-weight="500"
          class="node-text pointer-events-none"
        >
          {{ node.text }}
        </text>

        <!-- 端口 -->
        <g class="node-ports" :class="{ visible: selectedNodeId === node.id }">
          <circle
            v-for="port in getNodePortsFn(node)"
            :key="port.direction"
            :cx="port.x"
            :cy="port.y"
            r="5"
            fill="white"
            stroke="#2563eb"
            stroke-width="2"
            class="port-circle"
            @mousedown.stop="onPortMouseDown($event, port)"
            @mouseup.stop="onPortMouseUp(port)"
          />
        </g>
      </g>
    </svg>

    <!-- 缩放控件 -->
    <div class="absolute bottom-4 right-4 flex items-center gap-1">
      <button class="zoom-btn" title="缩小" @click="zoomOut">−</button>
      <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
      <button class="zoom-btn" title="放大" @click="zoomIn">+</button>
      <button class="zoom-btn ml-1" title="重置视图" @click="resetView">
        ⟲
      </button>
    </div>

    <!-- 提示信息 -->
    <div
      v-if="isConnecting"
      class="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full shadow-md"
    >
      点击目标节点的端口完成连线，按 Esc 取消
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import type {
  FlowNode,
  FlowConnection,
  PortDirection,
  PortInfo,
  NodeType,
} from "../constants";
import {
  NODE_CONFIGS,
  getNodePorts as getNodePortsFn,
  getPortPosition,
  getConnectionPath,
  getDiamondPoints as getDiamondPointsFn,
  getParallelogramPoints as getParallelogramPointsFn,
  generateNodeId,
  generateConnId,
  DEFAULT_NODES,
  DEFAULT_CONNECTIONS,
} from "../constants";

// ==================== 历史记录状态 ====================

interface HistoryState {
  nodes: FlowNode[];
  connections: FlowConnection[];
}

const history = ref<HistoryState[]>([]);
const historyIndex = ref(-1);
const MAX_HISTORY = 50;

// ==================== 数据状态 ====================

const nodes = ref<FlowNode[]>(JSON.parse(JSON.stringify(DEFAULT_NODES)));
const connections = ref<FlowConnection[]>(
  JSON.parse(JSON.stringify(DEFAULT_CONNECTIONS))
);

// ==================== 历史记录管理 ====================

/**
 * 记录当前状态到历史记录
 */
function recordState() {
  // 如果当前处于历史记录中间，删除后面的记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }

  // 添加新记录
  history.value.push({
    nodes: JSON.parse(JSON.stringify(nodes.value)),
    connections: JSON.parse(JSON.stringify(connections.value)),
  });

  // 限制历史记录长度
  if (history.value.length > MAX_HISTORY) {
    history.value.shift();
  } else {
    historyIndex.value++;
  }
}

/**
 * 撤销
 */
function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    const state = history.value[historyIndex.value];
    nodes.value = JSON.parse(JSON.stringify(state?.nodes));
    connections.value = JSON.parse(JSON.stringify(state?.connections));
    selectedNodeId.value = null;
    selectedConnectionId.value = null;
  }
}

/**
 * 重做
 */
function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    const state = history.value[historyIndex.value];
    nodes.value = JSON.parse(JSON.stringify(state?.nodes));
    connections.value = JSON.parse(JSON.stringify(state?.connections));
    selectedNodeId.value = null;
    selectedConnectionId.value = null;
  }
}

/**
 * 获取撤销/重做可用状态
 */
function getHistoryStatus() {
  return {
    canUndo: historyIndex.value > 0,
    canRedo: historyIndex.value < history.value.length - 1,
  };
}

// ==================== 数据导入导出 ====================

/**
 * 导出数据为 JSON 对象
 */
function exportJson() {
  return {
    version: "1.0",
    nodes: nodes.value,
    connections: connections.value,
  };
}

/**
 * 导入 JSON 数据
 */
function importJson(data: any) {
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.connections)) {
    throw new Error("无效的数据格式");
  }

  nodes.value = data.nodes;
  connections.value = data.connections;
  selectedNodeId.value = null;
  selectedConnectionId.value = null;

  // 重置历史记录
  history.value = [];
  historyIndex.value = -1;
  recordState();
}

// ==================== DOM 引用 ====================

const containerRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const textInputRef = ref<HTMLInputElement | null>(null);

// ==================== 视图状态 ====================

const zoom = ref(1);
const viewOffsetX = ref(0);
const viewOffsetY = ref(0);
const containerWidth = ref(800);
const containerHeight = ref(600);

const viewBoxStr = computed(() => {
  const w = containerWidth.value / zoom.value;
  const h = containerHeight.value / zoom.value;
  return `${viewOffsetX.value} ${viewOffsetY.value} ${w} ${h}`;
});

// ==================== 选择状态 ====================

const selectedNodeId = ref<string | null>(null);
const selectedConnectionId = ref<string | null>(null);

// ==================== 对齐辅助线状态 ====================

interface AlignmentGuide {
  type: "vertical" | "horizontal";
  pos: number;
}

const guides = ref<AlignmentGuide[]>([]);
const SNAP_THRESHOLD = 5;

// ==================== 拖拽状态 ====================

const isDragging = ref(false);
const dragNodeId = ref<string | null>(null);
const dragStartSvgX = ref(0);
const dragStartSvgY = ref(0);
const dragNodeStartX = ref(0);
const dragNodeStartY = ref(0);

// ==================== 画布平移状态 ====================

const isPanning = ref(false);
const panStartScreenX = ref(0);
const panStartScreenY = ref(0);
const panOriginX = ref(0);
const panOriginY = ref(0);

// ==================== 连线状态 ====================

const isConnecting = ref(false);
const connectingFrom = ref<PortInfo | null>(null);
const tempConnEnd = ref({ x: 0, y: 0 });

const tempConnectionPath = computed(() => {
  if (!connectingFrom.value) return "";
  const from = connectingFrom.value;
  return getConnectionPath(
    { x: from.x, y: from.y },
    from.direction,
    tempConnEnd.value,
    guessTargetDirection(from, tempConnEnd.value)
  );
});

// ==================== 文本编辑状态 ====================

const editingNodeId = ref<string | null>(null);
const editingText = ref("");

const editingInputStyle = computed(() => {
  if (!editingNodeId.value || !containerRef.value) return {};
  const node = nodes.value.find((n) => n.id === editingNodeId.value);
  if (!node) return {};

  // SVG 坐标转换为屏幕坐标
  const screenX = (node.x + node.width / 2 - viewOffsetX.value) * zoom.value;
  const screenY = (node.y + node.height / 2 - viewOffsetY.value) * zoom.value;
  const width = node.width * zoom.value;

  return {
    position: "absolute" as const,
    left: `${screenX - width / 2}px`,
    top: `${screenY - 14 * zoom.value}px`,
    width: `${width}px`,
    height: `${28 * zoom.value}px`,
    fontSize: `${14 * zoom.value}px`,
    zIndex: 100,
  };
});

// ==================== 坐标转换 ====================

/**
 * 将屏幕坐标转换为 SVG 坐标
 */
function screenToSvg(screenX: number, screenY: number) {
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  const relX = screenX - rect.left;
  const relY = screenY - rect.top;
  return {
    x: viewOffsetX.value + relX / zoom.value,
    y: viewOffsetY.value + relY / zoom.value,
  };
}

/**
 * 根据起点方向和终点位置猜测目标端口方向
 */
function guessTargetDirection(
  from: PortInfo,
  to: { x: number; y: number }
): PortDirection {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDy > absDx) {
    return dy > 0 ? "top" : "bottom";
  } else {
    return dx > 0 ? "left" : "right";
  }
}

// ==================== 节点辅助方法 ====================

function getNodeConfig(type: NodeType) {
  return NODE_CONFIGS[type];
}

function findNodeById(id: string): FlowNode | undefined {
  return nodes.value.find((n) => n.id === id);
}

// ==================== 连接线辅助方法 ====================

function getConnPath(conn: FlowConnection): string {
  const fromNode = findNodeById(conn.fromNodeId);
  const toNode = findNodeById(conn.toNodeId);
  if (!fromNode || !toNode) return "";

  const fromPos = getPortPosition(fromNode, conn.fromPort);
  const toPos = getPortPosition(toNode, conn.toPort);
  return getConnectionPath(fromPos, conn.fromPort, toPos, conn.toPort);
}

function getConnLabelPos(conn: FlowConnection): { x: number; y: number } {
  const fromNode = findNodeById(conn.fromNodeId);
  const toNode = findNodeById(conn.toNodeId);
  if (!fromNode || !toNode) return { x: 0, y: 0 };

  const fromPos = getPortPosition(fromNode, conn.fromPort);
  const toPos = getPortPosition(toNode, conn.toPort);
  return {
    x: (fromPos.x + toPos.x) / 2,
    y: (fromPos.y + toPos.y) / 2 - 10,
  };
}

// ==================== 画布交互 ====================

function onCanvasMouseDown(e: MouseEvent) {
  // 取消文本编辑
  if (editingNodeId.value) {
    finishEditing();
  }

  // 取消连线
  if (isConnecting.value && e.button === 0) {
    cancelConnecting();
    return;
  }

  // 左键点击空白：取消选中 & 开始平移
  if (e.button === 0) {
    selectedNodeId.value = null;
    selectedConnectionId.value = null;

    // 开始平移
    isPanning.value = true;
    panStartScreenX.value = e.clientX;
    panStartScreenY.value = e.clientY;
    panOriginX.value = viewOffsetX.value;
    panOriginY.value = viewOffsetY.value;
  }
}

function onCanvasMouseMove(e: MouseEvent) {
  // 正在拖拽节点
  if (isDragging.value && dragNodeId.value) {
    const svgPos = screenToSvg(e.clientX, e.clientY);
    const node = findNodeById(dragNodeId.value);
    if (node) {
      let newX = dragNodeStartX.value + (svgPos.x - dragStartSvgX.value);
      let newY = dragNodeStartY.value + (svgPos.y - dragStartSvgY.value);

      // 对齐吸附逻辑
      const newGuides: AlignmentGuide[] = [];

      // 获取其他所有节点
      const otherNodes = nodes.value.filter((n) => n.id !== node.id);

      // X 轴对齐检测 (左、中、右)
      const xTargets = [
        newX, // 左
        newX + node.width / 2, // 中
        newX + node.width, // 右
      ];
      let snappedX = false;

      // 遍历 X 轴目标点
      for (let i = 0; i < xTargets.length; i++) {
        const target = xTargets[i];
        // 查找最接近的对齐线
        for (const other of otherNodes) {
          const otherXPoints = [
            other.x, // 左
            other.x + other.width / 2, // 中
            other.x + other.width, // 右
          ];

          for (const point of otherXPoints) {
            if (target && Math.abs(target - point) < SNAP_THRESHOLD) {
              // 计算吸附后的 newX
              if (i === 0) newX = point; // 左对齐
              else if (i === 1) newX = point - node.width / 2; // 中对齐
              else newX = point - node.width; // 右对齐

              newGuides.push({ type: "vertical", pos: point });
              snappedX = true;
              break;
            }
          }
          if (snappedX) break;
        }
        if (snappedX) break;
      }

      // Y 轴对齐检测 (上、中、下)
      const yTargets = [
        newY, // 上
        newY + node.height / 2, // 中
        newY + node.height, // 下
      ];
      let snappedY = false;

      for (let i = 0; i < yTargets.length; i++) {
        const target = yTargets[i];
        for (const other of otherNodes) {
          const otherYPoints = [
            other.y, // 上
            other.y + other.height / 2, // 中
            other.y + other.height, // 下
          ];

          for (const point of otherYPoints) {
            if (target && Math.abs(target - point) < SNAP_THRESHOLD) {
              // 计算吸附后的 newY
              if (i === 0) newY = point; // 上对齐
              else if (i === 1) newY = point - node.height / 2; // 中对齐
              else newY = point - node.height; // 下对齐

              newGuides.push({ type: "horizontal", pos: point });
              snappedY = true;
              break;
            }
          }
          if (snappedY) break;
        }
        if (snappedY) break;
      }

      // 更新位置和辅助线
      node.x = Math.round(newX);
      node.y = Math.round(newY);
      guides.value = newGuides;
    }
    return;
  }

  // 正在平移画布
  if (isPanning.value) {
    const dx = (e.clientX - panStartScreenX.value) / zoom.value;
    const dy = (e.clientY - panStartScreenY.value) / zoom.value;
    viewOffsetX.value = panOriginX.value - dx;
    viewOffsetY.value = panOriginY.value - dy;
    return;
  }

  // 正在连线
  if (isConnecting.value) {
    const svgPos = screenToSvg(e.clientX, e.clientY);
    tempConnEnd.value = svgPos;
    return;
  }
}

function onCanvasMouseUp(_e: MouseEvent) {
  // 如果发生了拖拽，且位置发生了变化，记录状态
  if (isDragging.value && dragNodeId.value) {
    const node = findNodeById(dragNodeId.value);
    if (node) {
      // 简单的判断：如果当前状态与历史记录的最新状态不同，则记录
      // 这里简化处理，每次拖拽结束都记录，实际应用中可以比较坐标
      recordState();
    }
  }

  isDragging.value = false;
  dragNodeId.value = null;
  isPanning.value = false;
  guides.value = []; // 清除辅助线
}

function onWheel(e: WheelEvent) {
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;

  const mouseScreenX = e.clientX - rect.left;
  const mouseScreenY = e.clientY - rect.top;

  // 鼠标位置在 SVG 坐标系中
  const svgX = viewOffsetX.value + mouseScreenX / zoom.value;
  const svgY = viewOffsetY.value + mouseScreenY / zoom.value;

  // 更新缩放
  const factor = e.deltaY > 0 ? 0.92 : 1.08;
  const newZoom = Math.max(0.2, Math.min(3, zoom.value * factor));
  zoom.value = newZoom;

  // 保持鼠标位置不变
  viewOffsetX.value = svgX - mouseScreenX / newZoom;
  viewOffsetY.value = svgY - mouseScreenY / newZoom;
}

// ==================== 节点交互 ====================

function onNodeMouseDown(e: MouseEvent, node: FlowNode) {
  if (isConnecting.value) return;

  // 选中节点
  selectedNodeId.value = node.id;
  selectedConnectionId.value = null;

  // 开始拖拽
  isDragging.value = true;
  dragNodeId.value = node.id;
  const svgPos = screenToSvg(e.clientX, e.clientY);
  dragStartSvgX.value = svgPos.x;
  dragStartSvgY.value = svgPos.y;
  dragNodeStartX.value = node.x;
  dragNodeStartY.value = node.y;
}

function onNodeDblClick(node: FlowNode) {
  editingNodeId.value = node.id;
  editingText.value = node.text;

  nextTick(() => {
    textInputRef.value?.focus();
    textInputRef.value?.select();
  });
}

// ==================== 端口交互 ====================

function onPortMouseDown(e: MouseEvent, port: PortInfo) {
  e.preventDefault();

  // 开始连线
  isConnecting.value = true;
  connectingFrom.value = { ...port };
  tempConnEnd.value = { x: port.x, y: port.y };
}

function onPortMouseUp(port: PortInfo) {
  if (!isConnecting.value || !connectingFrom.value) return;

  const from = connectingFrom.value;

  // 不能连接到自身节点
  if (from.nodeId === port.nodeId) {
    cancelConnecting();
    return;
  }

  // 检查是否已有相同连接
  const exists = connections.value.some(
    (c) =>
      c.fromNodeId === from.nodeId &&
      c.toNodeId === port.nodeId &&
      c.fromPort === from.direction &&
      c.toPort === port.direction
  );

  if (!exists) {
    connections.value.push({
      id: generateConnId(),
      fromNodeId: from.nodeId,
      toNodeId: port.nodeId,
      fromPort: from.direction,
      toPort: port.direction,
    });
    recordState();
  }

  cancelConnecting();
}

function cancelConnecting() {
  isConnecting.value = false;
  connectingFrom.value = null;
}

// ==================== 连接线选择 ====================

function selectConnection(connId: string) {
  selectedConnectionId.value = connId;
  selectedNodeId.value = null;
}

// ==================== 文本编辑 ====================

function finishEditing() {
  if (!editingNodeId.value) return;
  const node = findNodeById(editingNodeId.value);
  if (node && editingText.value.trim()) {
    const oldText = node.text;
    if (oldText !== editingText.value.trim()) {
      node.text = editingText.value.trim();
      recordState();
    }
  }
  editingNodeId.value = null;
  editingText.value = "";
}

function cancelEditing() {
  editingNodeId.value = null;
  editingText.value = "";
}

// ==================== 键盘事件 ====================

function onKeyDown(e: KeyboardEvent) {
  // Escape：取消连线
  if (e.key === "Escape") {
    if (isConnecting.value) {
      cancelConnecting();
      return;
    }
    if (editingNodeId.value) {
      cancelEditing();
      return;
    }
    selectedNodeId.value = null;
    selectedConnectionId.value = null;
    return;
  }

  // Delete / Backspace：删除选中的节点或连接线
  if (e.key === "Delete" || e.key === "Backspace") {
    // 正在编辑文本时不处理
    if (editingNodeId.value) return;

    if (selectedNodeId.value) {
      deleteNode(selectedNodeId.value);
      recordState();
      return;
    }
    if (selectedConnectionId.value) {
      deleteConnection(selectedConnectionId.value);
      recordState();
      return;
    }
  }
}

// ==================== 删除操作 ====================

function deleteNode(nodeId: string) {
  // 同时删除相关的连接线
  connections.value = connections.value.filter(
    (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId
  );
  nodes.value = nodes.value.filter((n) => n.id !== nodeId);
  selectedNodeId.value = null;
}

function deleteConnection(connId: string) {
  connections.value = connections.value.filter((c) => c.id !== connId);
  selectedConnectionId.value = null;
}

// ==================== 缩放控件 ====================

function zoomIn() {
  const center = {
    x: viewOffsetX.value + containerWidth.value / zoom.value / 2,
    y: viewOffsetY.value + containerHeight.value / zoom.value / 2,
  };
  const newZoom = Math.min(3, zoom.value * 1.2);
  zoom.value = newZoom;
  viewOffsetX.value = center.x - containerWidth.value / newZoom / 2;
  viewOffsetY.value = center.y - containerHeight.value / newZoom / 2;
}

function zoomOut() {
  const center = {
    x: viewOffsetX.value + containerWidth.value / zoom.value / 2,
    y: viewOffsetY.value + containerHeight.value / zoom.value / 2,
  };
  const newZoom = Math.max(0.2, zoom.value / 1.2);
  zoom.value = newZoom;
  viewOffsetX.value = center.x - containerWidth.value / newZoom / 2;
  viewOffsetY.value = center.y - containerHeight.value / newZoom / 2;
}

function resetView() {
  zoom.value = 1;
  viewOffsetX.value = 0;
  viewOffsetY.value = 0;
}

// ==================== 容器尺寸监听 ====================

let resizeObserver: ResizeObserver | null = null;

function updateContainerSize() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth;
    containerHeight.value = containerRef.value.clientHeight;
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  updateContainerSize();
  document.addEventListener("keydown", onKeyDown);

  // 记录初始状态
  recordState();

  resizeObserver = new ResizeObserver(() => {
    updateContainerSize();
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
  resizeObserver?.disconnect();
});

// 监听文本输入 ref 的出现
watch(editingNodeId, (newVal) => {
  if (newVal) {
    nextTick(() => {
      textInputRef.value?.focus();
      textInputRef.value?.select();
    });
  }
});

// ==================== 暴露给父组件的方法 ====================

/**
 * 添加节点
 */
function addNode(type: NodeType) {
  const config = NODE_CONFIGS[type];
  // 在视口中心添加节点
  const centerX =
    viewOffsetX.value +
    containerWidth.value / zoom.value / 2 -
    config.defaultWidth / 2;
  const centerY =
    viewOffsetY.value +
    containerHeight.value / zoom.value / 2 -
    config.defaultHeight / 2;

  // 添加一点随机偏移避免重叠
  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = (Math.random() - 0.5) * 40;

  nodes.value.push({
    id: generateNodeId(),
    type,
    x: Math.round(centerX + offsetX),
    y: Math.round(centerY + offsetY),
    width: config.defaultWidth,
    height: config.defaultHeight,
    text: config.defaultText,
  });

  recordState();
}

/**
 * 清空所有内容
 */
function clearAll() {
  nodes.value = [];
  connections.value = [];
  selectedNodeId.value = null;
  selectedConnectionId.value = null;
  editingNodeId.value = null;
  recordState();
}

/**
 * 重置为默认示例
 */
function reset() {
  nodes.value = JSON.parse(JSON.stringify(DEFAULT_NODES));
  connections.value = JSON.parse(JSON.stringify(DEFAULT_CONNECTIONS));
  selectedNodeId.value = null;
  selectedConnectionId.value = null;
  editingNodeId.value = null;
  resetView();
  recordState();
}

/**
 * 导出为 SVG 字符串
 */
function exportSvg(): string {
  if (!svgRef.value) return "";

  // 克隆 SVG 元素
  const clone = svgRef.value.cloneNode(true) as SVGSVGElement;

  // 计算内容范围
  const bounds = getContentBounds();
  if (!bounds) return "";

  const padding = 40;
  clone.setAttribute(
    "viewBox",
    `${bounds.minX - padding} ${bounds.minY - padding} ${
      bounds.width + padding * 2
    } ${bounds.height + padding * 2}`
  );
  clone.setAttribute("width", `${bounds.width + padding * 2}`);
  clone.setAttribute("height", `${bounds.height + padding * 2}`);

  // 移除端口圆点和辅助元素的 class
  const ports = clone.querySelectorAll(".node-ports");
  ports.forEach((p) => p.remove());

  // 移除透明的点击区域路径
  const hitAreas = clone.querySelectorAll('path[stroke="transparent"]');
  hitAreas.forEach((p) => p.remove());

  const serializer = new XMLSerializer();
  return serializer.serializeToString(clone);
}

/**
 * 导出为 PNG Data URL
 */
async function exportPng(): Promise<string> {
  const svgStr = exportSvg();
  if (!svgStr) return "";

  return new Promise((resolve) => {
    const img = new Image();
    const svgBlob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2; // 高清
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
}

/**
 * 获取内容边界范围
 */
function getContentBounds() {
  if (nodes.value.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes.value) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * 获取统计信息
 */
function getStats() {
  return {
    nodeCount: nodes.value.length,
    connectionCount: connections.value.length,
  };
}

defineExpose({
  addNode,
  clearAll,
  reset,
  exportSvg,
  exportPng,
  getStats,
  undo,
  redo,
  getHistoryStatus,
  exportJson,
  importJson,
});
</script>

<style scoped>
/* 文本编辑输入框 */
.editing-input {
  @apply border-2 border-blue-500 rounded px-2 py-1 text-center bg-white;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-300;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 端口 */
.node-ports {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.node-ports.visible,
.flowchart-node:hover .node-ports {
  opacity: 1;
}

.port-circle {
  cursor: crosshair;
  transition: all 0.15s ease;
}

.port-circle:hover {
  r: 7;
  fill: #dbeafe;
}

/* 连接线 */
.connection-path {
  transition: stroke 0.15s ease;
}

/* 缩放按钮 */
.zoom-btn {
  @apply w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md;
  @apply text-gray-600 text-sm font-bold cursor-pointer;
  @apply hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100;
  @apply transition-all;
}

.zoom-label {
  @apply text-xs text-gray-500 font-medium min-w-12 text-center;
}

/* 节点文字 */
.node-text {
  font-size: 14px;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 连线文字 */
.conn-text {
  font-size: 12px;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 节点悬停效果 */
.flowchart-node {
  cursor: grab;
}

.flowchart-node:active {
  cursor: grabbing;
}
</style>
