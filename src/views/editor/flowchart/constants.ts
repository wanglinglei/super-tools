/**
 * 流程图编辑器常量定义
 *
 * @module flowchart/constants
 * @description 定义流程图节点类型、连接线、端口位置等核心数据结构
 */

// ==================== 类型定义 ====================

/** 节点类型 */
export type NodeType = "start" | "end" | "process" | "decision" | "io";

/** 端口方向 */
export type PortDirection = "top" | "right" | "bottom" | "left";

/** 流程图节点 */
export interface FlowNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

/** 流程图连接线 */
export interface FlowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPort: PortDirection;
  toPort: PortDirection;
  label?: string;
}

/** 端口位置信息 */
export interface PortInfo {
  x: number;
  y: number;
  direction: PortDirection;
  nodeId: string;
}

/** 节点类型配置 */
export interface NodeTypeConfig {
  type: NodeType;
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultText: string;
  fillColor: string;
  strokeColor: string;
  textColor: string;
}

// ==================== 节点配置 ====================

/** 节点类型配置表 */
export const NODE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  start: {
    type: "start",
    label: "开始",
    icon: "▶",
    defaultWidth: 120,
    defaultHeight: 50,
    defaultText: "开始",
    fillColor: "#ecfdf5",
    strokeColor: "#059669",
    textColor: "#065f46",
  },
  end: {
    type: "end",
    label: "结束",
    icon: "⏹",
    defaultWidth: 120,
    defaultHeight: 50,
    defaultText: "结束",
    fillColor: "#fef2f2",
    strokeColor: "#dc2626",
    textColor: "#991b1b",
  },
  process: {
    type: "process",
    label: "处理",
    icon: "▭",
    defaultWidth: 140,
    defaultHeight: 60,
    defaultText: "处理过程",
    fillColor: "#eff6ff",
    strokeColor: "#2563eb",
    textColor: "#1e40af",
  },
  decision: {
    type: "decision",
    label: "判断",
    icon: "◇",
    defaultWidth: 140,
    defaultHeight: 100,
    defaultText: "条件?",
    fillColor: "#fffbeb",
    strokeColor: "#d97706",
    textColor: "#92400e",
  },
  io: {
    type: "io",
    label: "输入/输出",
    icon: "▱",
    defaultWidth: 140,
    defaultHeight: 60,
    defaultText: "输入/输出",
    fillColor: "#f5f3ff",
    strokeColor: "#7c3aed",
    textColor: "#5b21b6",
  },
};

/** 节点类型列表（用于工具栏渲染） */
export const NODE_TYPE_LIST: NodeTypeConfig[] = Object.values(NODE_CONFIGS);

// ==================== ID 生成 ====================

let nodeCounter = 0;
export const generateNodeId = (): string =>
  `node-${Date.now()}-${++nodeCounter}`;

let connCounter = 0;
export const generateConnId = (): string =>
  `conn-${Date.now()}-${++connCounter}`;

// ==================== 端口与路径计算 ====================

/**
 * 获取节点的所有端口位置
 */
export function getNodePorts(node: FlowNode): PortInfo[] {
  const { x, y, width, height, id } = node;
  return [
    { x: x + width / 2, y: y, direction: "top", nodeId: id },
    { x: x + width, y: y + height / 2, direction: "right", nodeId: id },
    { x: x + width / 2, y: y + height, direction: "bottom", nodeId: id },
    { x: x, y: y + height / 2, direction: "left", nodeId: id },
  ];
}

/**
 * 获取节点的特定端口位置
 */
export function getPortPosition(
  node: FlowNode,
  direction: PortDirection
): { x: number; y: number } {
  const { x, y, width, height } = node;
  switch (direction) {
    case "top":
      return { x: x + width / 2, y };
    case "right":
      return { x: x + width, y: y + height / 2 };
    case "bottom":
      return { x: x + width / 2, y: y + height };
    case "left":
      return { x: x, y: y + height / 2 };
  }
}

/**
 * 计算连接线的贝塞尔曲线路径
 */
export function getConnectionPath(
  fromPos: { x: number; y: number },
  fromDir: PortDirection,
  toPos: { x: number; y: number },
  toDir: PortDirection
): string {
  const dist = Math.sqrt(
    (toPos.x - fromPos.x) ** 2 + (toPos.y - fromPos.y) ** 2
  );
  const offset = Math.max(Math.min(dist * 0.4, 100), 30);

  const getOffset = (dir: PortDirection, off: number) => {
    switch (dir) {
      case "top":
        return { x: 0, y: -off };
      case "bottom":
        return { x: 0, y: off };
      case "left":
        return { x: -off, y: 0 };
      case "right":
        return { x: off, y: 0 };
    }
  };

  const fromOff = getOffset(fromDir, offset);
  const toOff = getOffset(toDir, offset);

  return `M ${fromPos.x} ${fromPos.y} C ${fromPos.x + fromOff.x} ${
    fromPos.y + fromOff.y
  }, ${toPos.x + toOff.x} ${toPos.y + toOff.y}, ${toPos.x} ${toPos.y}`;
}

/**
 * 获取菱形（判断节点）的多边形顶点
 */
export function getDiamondPoints(node: FlowNode): string {
  const { x, y, width, height } = node;
  const cx = x + width / 2;
  const cy = y + height / 2;
  return `${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`;
}

/**
 * 获取平行四边形（输入/输出节点）的多边形顶点
 */
export function getParallelogramPoints(node: FlowNode): string {
  const { x, y, width, height } = node;
  const skew = 20;
  return `${x + skew},${y} ${x + width},${y} ${x + width - skew},${
    y + height
  } ${x},${y + height}`;
}

// ==================== 默认示例数据 ====================

/** 默认示例节点 */
export const DEFAULT_NODES: FlowNode[] = [
  {
    id: "node-default-1",
    type: "start",
    x: 330,
    y: 40,
    width: 120,
    height: 50,
    text: "开始",
  },
  {
    id: "node-default-2",
    type: "io",
    x: 320,
    y: 140,
    width: 140,
    height: 60,
    text: "输入数据",
  },
  {
    id: "node-default-3",
    type: "decision",
    x: 320,
    y: 260,
    width: 140,
    height: 100,
    text: "数据有效?",
  },
  {
    id: "node-default-4",
    type: "process",
    x: 320,
    y: 420,
    width: 140,
    height: 60,
    text: "处理数据",
  },
  {
    id: "node-default-5",
    type: "process",
    x: 560,
    y: 280,
    width: 140,
    height: 60,
    text: "显示错误",
  },
  {
    id: "node-default-6",
    type: "end",
    x: 330,
    y: 540,
    width: 120,
    height: 50,
    text: "结束",
  },
];

/** 默认示例连接线 */
export const DEFAULT_CONNECTIONS: FlowConnection[] = [
  {
    id: "conn-default-1",
    fromNodeId: "node-default-1",
    toNodeId: "node-default-2",
    fromPort: "bottom",
    toPort: "top",
  },
  {
    id: "conn-default-2",
    fromNodeId: "node-default-2",
    toNodeId: "node-default-3",
    fromPort: "bottom",
    toPort: "top",
  },
  {
    id: "conn-default-3",
    fromNodeId: "node-default-3",
    toNodeId: "node-default-4",
    fromPort: "bottom",
    toPort: "top",
    label: "是",
  },
  {
    id: "conn-default-4",
    fromNodeId: "node-default-3",
    toNodeId: "node-default-5",
    fromPort: "right",
    toPort: "left",
    label: "否",
  },
  {
    id: "conn-default-5",
    fromNodeId: "node-default-5",
    toNodeId: "node-default-2",
    fromPort: "top",
    toPort: "right",
  },
  {
    id: "conn-default-6",
    fromNodeId: "node-default-4",
    toNodeId: "node-default-6",
    fromPort: "bottom",
    toPort: "top",
  },
];
