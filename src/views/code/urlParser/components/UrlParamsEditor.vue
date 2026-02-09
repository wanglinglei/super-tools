<template>
  <div class="space-y-3">
    <!-- URL 输入区 -->
    <div class="card-p">
      <div class="flex-between mb-3">
        <h2 class="text-title">🔗 URL 链接</h2>
        <div class="flex gap-2">
          <button class="btn-sm" @click="formatUrl">格式化</button>
          <button class="btn-sm" @click="copyUrl">复制</button>
        </div>
      </div>
      <textarea
        v-model="urlInput"
        placeholder="请输入完整的 URL 链接..."
        class="textarea-base font-mono"
        rows="3"
        @input="handleUrlInput"
      ></textarea>
    </div>

    <!-- 参数编辑区 -->
    <div class="card-p">
      <div class="flex-between mb-3">
        <h2 class="text-title">📝 参数编辑</h2>
        <button
          class="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          @click="addParam"
        >
          + 添加参数
        </button>
      </div>

      <div v-if="params.length > 0" class="space-y-2">
        <div
          v-for="(param, index) in params"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            v-model="param.key"
            type="text"
            placeholder="Key"
            class="flex-1 input-base text-sm font-mono"
            @input="updateUrlFromParams"
          />
          <span class="text-gray-400">=</span>
          <input
            v-model="param.value"
            type="text"
            placeholder="Value"
            class="flex-1 input-base text-sm font-mono"
            @input="updateUrlFromParams"
          />
          <button
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="删除参数"
            @click="removeParam(index)"
          >
            <SvgIcon name="trash" size="16px" />
          </button>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-400 text-sm">
        暂无 URL 参数，请在上方输入 URL 或点击添加参数
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { copyToClipboard } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

interface UrlParam {
  key: string;
  value: string;
}

const urlInput = ref("");
const params = ref<UrlParam[]>([]);

// 处理 URL 输入
const handleUrlInput = () => {
  if (!urlInput.value.trim()) {
    params.value = [];
    return;
  }

  try {
    const urlStr = urlInput.value.trim();
    // 提取 query string 部分
    const queryStartIndex = urlStr.indexOf("?");
    if (queryStartIndex === -1) {
      params.value = [];
      return;
    }

    const queryString = urlStr.slice(queryStartIndex + 1).split("#")[0]; // 去掉 hash
    const searchParams = new URLSearchParams(queryString);

    const newParams: UrlParam[] = [];
    searchParams.forEach((value, key) => {
      newParams.push({ key, value });
    });

    params.value = newParams;
  } catch (e) {
    // 忽略解析错误
  }
};

// 从参数更新 URL
const updateUrlFromParams = () => {
  try {
    let urlStr = urlInput.value.trim();
    const queryStartIndex = urlStr.indexOf("?");
    const hashIndex = urlStr.indexOf("#");

    let baseUrl = "";
    let hash = "";

    if (queryStartIndex !== -1) {
      baseUrl = urlStr.slice(0, queryStartIndex);
    } else if (hashIndex !== -1) {
      baseUrl = urlStr.slice(0, hashIndex);
    } else {
      baseUrl = urlStr;
    }

    if (hashIndex !== -1) {
      hash = urlStr.slice(hashIndex);
    }

    // 构建新的 query string
    const searchParams = new URLSearchParams();
    params.value.forEach((p) => {
      if (p.key) {
        searchParams.append(p.key, p.value);
      }
    });

    const newQueryString = searchParams.toString();

    if (newQueryString) {
      urlInput.value = `${baseUrl}?${newQueryString}${hash}`;
    } else {
      urlInput.value = `${baseUrl}${hash}`;
    }
  } catch (e) {
    console.error(e);
  }
};

// 添加参数
const addParam = () => {
  params.value.push({ key: "", value: "" });
  updateUrlFromParams();
};

// 删除参数
const removeParam = (index: number) => {
  params.value.splice(index, 1);
  updateUrlFromParams();
};

// 格式化 URL (解码参数以便阅读)
const formatUrl = () => {
  try {
    if (!urlInput.value) return;
    // 简单的格式化：解码
    urlInput.value = decodeURI(urlInput.value);
    handleUrlInput(); // 重新解析参数
    showMessage("已格式化");
  } catch (e) {
    showMessage("格式化失败", "error");
  }
};

// 复制 URL
const copyUrl = async () => {
  if (!urlInput.value) return;
  const success = await copyToClipboard(urlInput.value);
  if (success) {
    showMessage("已复制 URL");
  } else {
    showMessage("复制失败", "error");
  }
};

// 清空
const clearAll = () => {
  urlInput.value = "";
  params.value = [];
  showMessage("已清空");
};

defineExpose({
  clearAll,
});
</script>
