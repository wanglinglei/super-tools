/**
 * 文本 Diff 工具常量配置
 */

/**
 * 对比视图模式
 */
export type ViewMode = "unified" | "side-by-side";

export const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: "unified", label: "统一视图" },
  { key: "side-by-side", label: "并排视图" },
];

/**
 * Diff 行类型
 */
export type DiffType = "equal" | "added" | "removed";

export interface DiffLine {
  type: DiffType;
  content: string;
  oldLineNo?: number;
  newLineNo?: number;
}

/**
 * Diff 统计信息
 */
export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

/**
 * 并排视图行对
 */
export interface SideBySidePair {
  left: { lineNo: number; content: string; type: "equal" | "removed" } | null;
  right: { lineNo: number; content: string; type: "equal" | "added" } | null;
}

/**
 * 示例接口
 */
export interface DiffExample {
  name: string;
  original: string;
  modified: string;
  description: string;
}

/**
 * 常用示例
 */
export const DIFF_EXAMPLES: DiffExample[] = [
  {
    name: "变量修改",
    original: `const name = "hello";
const age = 18;
const city = "Beijing";`,
    modified: `const name = "world";
const age = 20;
const city = "Beijing";
const country = "China";`,
    description: "变量值修改和新增行",
  },
  {
    name: "函数重构",
    original: `function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}`,
    modified: `function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}`,
    description: "TypeScript 类型和函数替换",
  },
  {
    name: "配置升级",
    original: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.0.0",
    "axios": "^0.21.0"
  }
}`,
    modified: `{
  "name": "my-app",
  "version": "2.0.0",
  "dependencies": {
    "vue": "^3.5.0",
    "axios": "^1.6.0",
    "pinia": "^2.1.0"
  }
}`,
    description: "package.json 版本升级",
  },
];

/**
 * 基于 LCS（最长公共子序列）的 Diff 算法
 */
export function computeDiff(
  oldText: string,
  newText: string,
  options: { ignoreWhitespace: boolean; ignoreCase: boolean } = {
    ignoreWhitespace: false,
    ignoreCase: false,
  }
): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  /**
   * 行比较函数（支持选项）
   */
  const compareLine = (a: string, b: string): boolean => {
    let lineA = a;
    let lineB = b;
    if (options.ignoreWhitespace) {
      lineA = lineA.trim();
      lineB = lineB.trim();
    }
    if (options.ignoreCase) {
      lineA = lineA.toLowerCase();
      lineB = lineB.toLowerCase();
    }
    return lineA === lineB;
  };

  const m = oldLines.length;
  const n = newLines.length;

  // 构建 LCS DP 表
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (compareLine(oldLines[i - 1]!, newLines[j - 1]!)) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
      } else {
        dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
      }
    }
  }

  // 回溯生成 diff 结果
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && compareLine(oldLines[i - 1]!, newLines[j - 1]!)) {
      result.unshift({
        type: "equal",
        content: oldLines[i - 1]!,
        oldLineNo: i,
        newLineNo: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
      result.unshift({
        type: "added",
        content: newLines[j - 1]!,
        newLineNo: j,
      });
      j--;
    } else {
      result.unshift({
        type: "removed",
        content: oldLines[i - 1]!,
        oldLineNo: i,
      });
      i--;
    }
  }

  return result;
}

/**
 * 计算 Diff 统计信息
 */
export function computeStats(diffLines: DiffLine[]): DiffStats {
  return diffLines.reduce(
    (stats, line) => {
      if (line.type === "added") stats.added++;
      else if (line.type === "removed") stats.removed++;
      else stats.unchanged++;
      return stats;
    },
    { added: 0, removed: 0, unchanged: 0 } as DiffStats
  );
}

/**
 * 将统一 diff 结果转换为并排视图行对
 */
export function toSideBySide(diffLines: DiffLine[]): SideBySidePair[] {
  const pairs: SideBySidePair[] = [];

  for (const line of diffLines) {
    if (line.type === "equal") {
      pairs.push({
        left: { lineNo: line.oldLineNo!, content: line.content, type: "equal" },
        right: {
          lineNo: line.newLineNo!,
          content: line.content,
          type: "equal",
        },
      });
    } else if (line.type === "removed") {
      pairs.push({
        left: {
          lineNo: line.oldLineNo!,
          content: line.content,
          type: "removed",
        },
        right: null,
      });
    } else {
      pairs.push({
        left: null,
        right: {
          lineNo: line.newLineNo!,
          content: line.content,
          type: "added",
        },
      });
    }
  }

  return pairs;
}

/**
 * 生成可复制的统一 diff 文本
 */
export function formatDiffText(diffLines: DiffLine[]): string {
  return diffLines
    .map((line) => {
      const prefix =
        line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
      return `${prefix} ${line.content}`;
    })
    .join("\n");
}
