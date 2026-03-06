<template>
  <ToolLayout title="JWT 解码" icon="🔐" :content-padding="false">
    <!-- 顶部工具栏 -->
    <template #header-right>
      <ToolButton icon="edit" text="示例 Token" @click="fillExample" />
      <ToolButton type="icon" icon="trash" title="清空" @click="clearAll" />
    </template>

    <div class="flex flex-col h-full p-4 gap-4 overflow-y-auto">
      <!-- 输入区域 -->
      <div class="card-p flex-shrink-0">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-title">Encoded Token</h2>
          <span class="text-xs text-gray-500" v-if="tokenError">
            <span class="text-red-500">{{ tokenError }}</span>
          </span>
        </div>
        <textarea
          v-model="tokenInput"
          class="textarea-base font-mono text-sm h-24"
          placeholder="粘贴 JWT Token (Header.Payload.Signature)..."
          @input="handleInput"
        ></textarea>
      </div>

      <!-- 解码结果区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96 min-h-[300px]">
        <!-- Header -->
        <div class="card-p flex flex-col min-h-0">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-title text-red-600">Header</h2>
            <span class="text-xs text-gray-400">Algorithm & Token Type</span>
          </div>
          <div class="flex-1 relative min-h-0 border rounded bg-gray-50 overflow-hidden">
            <div ref="headerEditorRef" class="absolute inset-0 w-full h-full"></div>
          </div>
        </div>

        <!-- Payload -->
        <div class="card-p flex flex-col min-h-0">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-title text-purple-600">Payload</h2>
            <span class="text-xs text-gray-400">Data & Claims</span>
          </div>
          <div class="flex-1 relative min-h-0 border rounded bg-gray-50 overflow-hidden">
            <div ref="payloadEditorRef" class="absolute inset-0 w-full h-full"></div>
          </div>
        </div>
      </div>

      <!-- 底部信息区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- 关键信息提取 -->
        <div class="card-p lg:col-span-2" v-if="payloadObj">
          <h2 class="text-title mb-3">关键信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-3 rounded border border-gray-200">
              <div class="text-xs text-gray-500 mb-1">过期时间 (exp)</div>
              <div class="font-mono text-sm" :class="isExpired ? 'text-red-600' : 'text-green-600'">
                {{ formatTime(payloadObj.exp) }}
                <span v-if="isExpired" class="text-xs ml-1 font-bold">(已过期)</span>
                <span v-else-if="payloadObj.exp" class="text-xs ml-1 text-gray-500">({{ getRelativeTime(payloadObj.exp) }})</span>
              </div>
            </div>
            <div class="bg-gray-50 p-3 rounded border border-gray-200">
              <div class="text-xs text-gray-500 mb-1">签发时间 (iat)</div>
              <div class="font-mono text-sm text-gray-800">
                {{ formatTime(payloadObj.iat) }}
              </div>
            </div>
            <div class="bg-gray-50 p-3 rounded border border-gray-200">
              <div class="text-xs text-gray-500 mb-1">生效时间 (nbf)</div>
              <div class="font-mono text-sm text-gray-800">
                {{ formatTime(payloadObj.nbf) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 常见字段说明 -->
        <div class="card-p lg:col-span-1">
          <h2 class="text-title mb-3">📖 常见字段说明</h2>
          <div class="text-xs text-gray-600 space-y-1 max-h-40 overflow-y-auto">
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">iss</span>
              <span>签发人 (Issuer)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">sub</span>
              <span>主题 (Subject)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">aud</span>
              <span>受众 (Audience)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">exp</span>
              <span>过期时间 (Expiration Time)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">nbf</span>
              <span>生效时间 (Not Before)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">iat</span>
              <span>签发时间 (Issued At)</span>
            </div>
            <div class="grid grid-cols-[40px_1fr] gap-2">
              <span class="font-mono font-bold text-purple-600">jti</span>
              <span>JWT ID (Unique Identifier)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import * as ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

const tokenInput = ref("");
const payloadObj = ref<any>(null);
const tokenError = ref("");

// Ace Editors
const headerEditorRef = ref<HTMLElement | null>(null);
const payloadEditorRef = ref<HTMLElement | null>(null);
let headerEditor: ace.Ace.Editor | null = null;
let payloadEditor: ace.Ace.Editor | null = null;

const isExpired = computed(() => {
  if (!payloadObj.value?.exp) return false;
  return payloadObj.value.exp * 1000 < Date.now();
});

// 初始化 Ace Editor
function initEditors() {
  const commonOptions: Partial<ace.Ace.EditorOptions> = {
    mode: "ace/mode/json",
    theme: "ace/theme/github",
    fontSize: 13,
    tabSize: 2,
    useSoftTabs: true,
    showPrintMargin: false,
    readOnly: true,
    highlightActiveLine: false,
    showGutter: true,
    wrap: true,
  };

  if (headerEditorRef.value) {
    headerEditor = ace.edit(headerEditorRef.value, commonOptions);
    headerEditor.setValue("{}", -1);
  }

  if (payloadEditorRef.value) {
    payloadEditor = ace.edit(payloadEditorRef.value, commonOptions);
    payloadEditor.setValue("{}", -1);
  }
}

// Base64Url 解码
function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    throw new Error("Invalid Base64 string");
  }
}

function handleInput() {
  const token = tokenInput.value.trim();
  tokenError.value = "";
  payloadObj.value = null;

  if (!token) {
    headerEditor?.setValue("{}", -1);
    payloadEditor?.setValue("{}", -1);
    return;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    tokenError.value = "无效的 JWT 格式 (应包含 3 部分)";
    return;
  }

  try {
    // Decode Header
    const headerStr = base64UrlDecode(parts[0]!);
    const header = JSON.parse(headerStr);
    headerEditor?.setValue(JSON.stringify(header, null, 2), -1);

    // Decode Payload
    const payloadStr = base64UrlDecode(parts[1]!);
    const payload = JSON.parse(payloadStr);
    payloadEditor?.setValue(JSON.stringify(payload, null, 2), -1);
    
    payloadObj.value = payload;
  } catch (e) {
    tokenError.value = "解码失败: " + (e as Error).message;
  }
}

function formatTime(timestamp: number | undefined) {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleString();
}

function getRelativeTime(timestamp: number) {
  const diff = timestamp * 1000 - Date.now();
  if (diff < 0) return "已过期";
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天后`;
  if (hours > 0) return `${hours}小时后`;
  if (minutes > 0) return `${minutes}分钟后`;
  return "即将过期";
}

function fillExample() {
  // 示例 Token (包含 exp, iat, sub, name 等字段)
  tokenInput.value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + 
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQ2NzcxNjQ4MDB9." + 
    "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  handleInput();
}

function clearAll() {
  tokenInput.value = "";
  handleInput();
}

onMounted(() => {
  initEditors();
});

onUnmounted(() => {
  headerEditor?.destroy();
  payloadEditor?.destroy();
});
</script>

<style scoped>
/* Ace Editor 样式微调 */
:deep(.ace_editor) {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace !important;
  background-color: transparent;
}
:deep(.ace_gutter) {
  background-color: #f9fafb;
}
</style>
