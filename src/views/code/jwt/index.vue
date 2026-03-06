<template>
  <ToolLayout title="JWT 解码" icon="🔐" :content-padding="false">
    <!-- 顶部工具栏 -->
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空" @click="clearAll" />
    </template>

    <div class="flex flex-col h-full p-4 gap-4">
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
          class="textarea-base font-mono text-sm h-32"
          placeholder="粘贴 JWT Token (Header.Payload.Signature)..."
          @input="handleInput"
        ></textarea>
      </div>

      <!-- 解码结果区域 -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <!-- Header -->
        <div class="card-p flex flex-col min-h-0">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-title text-red-600">Header</h2>
            <span class="text-xs text-gray-400">Algorithm & Token Type</span>
          </div>
          <div class="flex-1 relative min-h-0 border rounded bg-gray-50">
            <pre class="absolute inset-0 p-3 overflow-auto text-sm font-mono text-red-800">{{ headerJson || '{}' }}</pre>
          </div>
        </div>

        <!-- Payload -->
        <div class="card-p flex flex-col min-h-0">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-title text-purple-600">Payload</h2>
            <span class="text-xs text-gray-400">Data & Claims</span>
          </div>
          <div class="flex-1 relative min-h-0 border rounded bg-gray-50">
            <pre class="absolute inset-0 p-3 overflow-auto text-sm font-mono text-purple-800">{{ payloadJson || '{}' }}</pre>
          </div>
        </div>
      </div>

      <!-- 关键信息提取 -->
      <div class="card-p flex-shrink-0" v-if="payloadObj">
        <h2 class="text-title mb-3">关键信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-3 rounded border border-gray-200">
            <div class="text-xs text-gray-500 mb-1">过期时间 (exp)</div>
            <div class="font-mono text-sm" :class="isExpired ? 'text-red-600' : 'text-green-600'">
              {{ formatTime(payloadObj.exp) }}
              <span v-if="isExpired" class="text-xs ml-1">(已过期)</span>
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
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";

const tokenInput = ref("");
const headerJson = ref("");
const payloadJson = ref("");
const payloadObj = ref<any>(null);
const tokenError = ref("");

const isExpired = computed(() => {
  if (!payloadObj.value?.exp) return false;
  return payloadObj.value.exp * 1000 < Date.now();
});

// Base64Url 解码
function base64UrlDecode(str: string) {
  // 添加填充
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
  headerJson.value = "";
  payloadJson.value = "";
  payloadObj.value = null;

  if (!token) return;

  const parts = token.split(".");
  if (parts.length !== 3) {
    tokenError.value = "无效的 JWT 格式 (应包含 3 部分)";
    return;
  }

  try {
    // Decode Header
    const headerStr = base64UrlDecode(parts[0]!);
    const header = JSON.parse(headerStr);
    headerJson.value = JSON.stringify(header, null, 2);

    // Decode Payload
    const payloadStr = base64UrlDecode(parts[1]!);
    const payload = JSON.parse(payloadStr);
    payloadJson.value = JSON.stringify(payload, null, 2);
    payloadObj.value = payload;
  } catch (e) {
    tokenError.value = "解码失败: " + (e as Error).message;
  }
}

function formatTime(timestamp: number | undefined) {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleString();
}

function clearAll() {
  tokenInput.value = "";
  handleInput();
}
</script>

<style scoped>
/* 自定义滚动条样式 */
pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
pre::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
pre::-webkit-scrollbar-track {
  background: transparent;
}
</style>
