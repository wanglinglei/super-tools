<template>
  <div class="space-y-3">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- 图片上传/预览区 -->
      <div class="card-p">
        <h2 class="text-title mb-3">🖼️ 图片</h2>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
          :class="{ 'border-blue-400 bg-blue-50': isDragging }"
          @click="selectImage"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <template v-if="imagePreview">
            <img
              :src="imagePreview"
              alt="预览图片"
              class="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
            />
            <div class="mt-3 text-hint">
              {{ imageInfo }}
            </div>
          </template>
          <template v-else>
            <div class="text-4xl mb-2">📁</div>
            <div class="text-sm text-gray-600 mb-1">点击或拖拽图片到此处</div>
            <div class="text-hint">支持 PNG、JPEG、GIF、WebP、SVG 格式</div>
          </template>
        </div>
        <input
          ref="imageInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageSelect"
        />
      </div>

      <!-- Base64 输出区 -->
      <div class="card-p">
        <div class="flex-between mb-3">
          <h2 class="text-title">📄 Base64 编码</h2>
          <div class="flex gap-2">
            <button v-if="outputText" class="btn-sm" @click="copyOutput">
              复制
            </button>
            <button v-if="outputText" class="btn-sm" @click="copyDataUri">
              复制 Data URI
            </button>
          </div>
        </div>
        <textarea
          v-model="outputText"
          placeholder="图片的 Base64 编码将显示在这里..."
          class="textarea-base font-mono text-xs bg-gray-50"
          rows="14"
          @input="handleBase64Input"
        ></textarea>
      </div>
    </div>

    <!-- 图片格式说明 -->
    <div class="card-p">
      <h2 class="text-title mb-3">📖 支持的图片格式</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          v-for="info in IMAGE_FORMAT_INFO"
          :key="info.format"
          class="bg-gray-50 rounded-lg p-3 text-center"
        >
          <div class="text-sm font-bold text-blue-600 mb-1">
            {{ info.format }}
          </div>
          <div class="text-xs text-gray-600">{{ info.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from "vue";
import { copyToClipboard } from "@/utils";
import { IMAGE_FORMAT_INFO, SUPPORTED_IMAGE_FORMATS } from "../constants";
import type { MessageType } from "@/composables/useMessage";

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 图片模式状态
const imageInputRef = ref<HTMLInputElement>();
const imagePreview = ref("");
const imageMimeType = ref("");
const imageSize = ref(0);
const isDragging = ref(false);
const outputText = ref("");

// 图片信息
const imageInfo = computed(() => {
  if (!imagePreview.value) return "";
  const sizeKB = (imageSize.value / 1024).toFixed(2);
  return `${imageMimeType.value} | ${sizeKB} KB | Base64: ${outputText.value.length} 字符`;
});

/**
 * 解码 Base64 为图片
 */
const decodeBase64ToImage = (base64: string) => {
  let dataUri = base64.trim();
  let mimeType = "";

  // 如果不是完整的 Data URI，尝试添加前缀
  if (!dataUri.startsWith("data:")) {
    try {
      // 尝试检测图片类型
      const header = atob(dataUri.slice(0, 30));
      
      if (header.startsWith("\x89PNG")) {
        mimeType = "image/png";
      } else if (header.startsWith("\xFF\xD8")) {
        mimeType = "image/jpeg";
      } else if (header.startsWith("GIF")) {
        mimeType = "image/gif";
      } else if (header.startsWith("RIFF") && header.indexOf("WEBP") > 0) {
        mimeType = "image/webp";
      } else if (header.trim().startsWith("<svg") || header.includes("<svg")) {
        mimeType = "image/svg+xml";
      } else {
        // 未识别到已知图片头，视为非图片数据
        throw new Error("未识别到有效的图片文件头");
      }

      dataUri = `data:${mimeType};base64,${base64}`;
    } catch (e) {
      throw e;
    }
  } else {
    // 从 Data URI 提取 MIME 类型
    const match = dataUri.match(/^data:([^;]+);base64,/);
    if (match?.[1]) {
      mimeType = match[1];
      if (!mimeType.startsWith("image/")) {
        throw new Error("非图片类型的 Data URI");
      }
    } else {
      throw new Error("无效的 Data URI 格式");
    }
  }

  imageMimeType.value = mimeType;
  imagePreview.value = dataUri;

  // 计算大小
  const base64Data = dataUri.split(",")[1] || base64;
  imageSize.value = Math.floor((base64Data.length * 3) / 4);
};

/**
 * 选择图片
 */
const selectImage = () => {
  imageInputRef.value?.click();
};

/**
 * 处理图片选择
 */
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    processImage(file);
  }
};

/**
 * 处理拖拽
 */
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) {
    processImage(file);
  } else {
    showMessage("请拖入图片文件", "error");
  }
};

/**
 * 处理图片文件
 */
const processImage = (file: File) => {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    showMessage("不支持的图片格式", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUri = e.target?.result as string;
    imagePreview.value = dataUri;
    imageMimeType.value = file.type;
    imageSize.value = file.size;

    // 提取纯 Base64（不含 Data URI 前缀）
    const base64 = dataUri.split(",")[1] || "";
    outputText.value = base64;

    showMessage("图片已转换为 Base64", "success");
  };
  reader.onerror = () => {
    showMessage("读取图片失败", "error");
  };
  reader.readAsDataURL(file);
};

/**
 * 处理 Base64 输入（图片模式）
 */
const handleBase64Input = () => {
  const val = outputText.value.trim();
  if (!val) {
    imagePreview.value = "";
    imageMimeType.value = "";
    imageSize.value = 0;
    return;
  }
  
  // 尝试自动预览
  try {
    decodeBase64ToImage(val);
  } catch (e) {
    // 忽略无效 Base64 导致的预览错误，等待用户输入完整
    imagePreview.value = "";
    imageMimeType.value = "";
    imageSize.value = 0;
  }
};

/**
 * 处理编码（图片模式下主要是提示）
 */
const handleEncode = () => {
  if (imagePreview.value) {
    // 已经有图片了，再次触发处理（其实没必要，但为了响应按钮点击）
    showMessage("图片已编码", "success");
  } else {
    selectImage(); // 触发文件选择
  }
};

/**
 * 处理解码
 */
const handleDecode = () => {
  if (!outputText.value.trim()) {
    showMessage("请输入 Base64 编码", "error");
    return;
  }
  try {
    decodeBase64ToImage(outputText.value);
    showMessage("解码成功", "success");
  } catch (error) {
    // 如果不是图片，尝试作为普通文本解码并提示
    try {
      const text = decodeURIComponent(escape(atob(outputText.value)));
      if (text) {
        showMessage("这不是图片数据，请切换到文本模式查看", "info");
        return;
      }
    } catch (e) {
      // 忽略文本解码错误
    }
    showMessage("解码失败: 无效的图片 Base64", "error");
  }
};

/**
 * 复制输出结果
 */
const copyOutput = async () => {
  if (!outputText.value) {
    showMessage("没有可复制的结果", "error");
    return;
  }
  await copyText(outputText.value);
};

/**
 * 复制 Data URI
 */
const copyDataUri = async () => {
  if (!outputText.value || !imageMimeType.value) {
    showMessage("没有可复制的内容", "error");
    return;
  }
  const dataUri = `data:${imageMimeType.value};base64,${outputText.value}`;
  await copyText(dataUri);
};

/**
 * 复制文本
 */
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板", "success");
  } else {
    showMessage("复制失败", "error");
  }
};

/**
 * 清空所有
 */
const clearAll = () => {
  outputText.value = "";
  imagePreview.value = "";
  imageMimeType.value = "";
  imageSize.value = 0;
  if (imageInputRef.value) {
    imageInputRef.value.value = "";
  }
  showMessage("已清空", "success");
};

defineExpose({
  selectImage,
  handleEncode,
  handleDecode,
  copyOutput,
  clearAll,
});
</script>
