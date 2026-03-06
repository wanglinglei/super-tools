<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span class="text-2xl mr-2">🔍</span>
        二维码解码
      </h2>

      <!-- 上传区域 -->
      <div
        v-if="!decodeImageUrl"
        class="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
        @click="selectDecodeImage"
      >
        <div class="text-6xl mb-4">📷</div>
        <div class="text-base text-gray-600 mb-2 font-medium">
          点击上传二维码图片
        </div>
        <div class="text-sm text-gray-400">支持 JPG、PNG、GIF、WebP 等格式</div>
      </div>

      <!-- 图片预览和解码结果 -->
      <div v-else class="space-y-4">
        <!-- 图片预览 -->
        <div class="text-center">
          <div class="inline-block relative">
            <img
              :src="decodeImageUrl"
              alt="待解码图片"
              class="max-h-64 rounded-lg shadow-md"
            />
          </div>
        </div>

        <!-- 解码结果 -->
        <div v-if="decoding" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"
          ></div>
          <div class="text-base text-gray-600 font-medium">正在解码...</div>
        </div>

        <div
          v-else-if="decodeResult"
          class="bg-green-50 rounded-lg p-5 border border-green-200"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 text-2xl">✓</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-green-600 mb-2 font-bold">解码成功</div>
              <div
                class="text-base text-gray-800 break-all bg-white rounded p-3 border border-green-200"
              >
                {{ decodeResult }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="decodeError"
          class="bg-red-50 rounded-lg p-5 border border-red-200"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 text-2xl">✗</div>
            <div class="flex-1">
              <div class="text-sm text-red-600 mb-2 font-bold">解码失败</div>
              <div class="text-sm text-gray-700">{{ decodeError }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="grid grid-cols-3 gap-3 pt-2">
          <button
            v-if="decodeResult"
            class="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            @click="copyText(decodeResult)"
          >
            复制结果
          </button>
          <button
            class="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            :class="{ 'col-span-2': !decodeResult }"
            @click="selectDecodeImage"
          >
            📷 更换图片
          </button>
          <button
            class="px-4 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            @click="clearDecode"
          >
            🗑️ 清空
          </button>
        </div>
      </div>

      <input
        ref="decodeInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleDecodeImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from "vue";
import jsQR from "jsqr";
import { copyToClipboard } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 解码相关
const decodeInputRef = ref<HTMLInputElement | null>(null);
const decodeImageUrl = ref("");
const decoding = ref(false);
const decodeResult = ref("");
const decodeError = ref("");

// 监听粘贴事件
const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        processFile(file);
        return; // 只处理第一张图片
      }
    }
  }
};

onMounted(() => {
  document.addEventListener("paste", handlePaste);
});

onUnmounted(() => {
  document.removeEventListener("paste", handlePaste);
});

// 选择要解码的图片
const selectDecodeImage = () => {
  decodeInputRef.value?.click();
};

// 处理解码图片上传
const handleDecodeImage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  processFile(file);
  
  // 清空 input，以便可以重复选择同一文件
  target.value = "";
};

// 统一处理文件
const processFile = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    showMessage("请选择图片文件", "error");
    return;
  }

  try {
    decoding.value = true;
    decodeResult.value = "";
    decodeError.value = "";

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      decodeImageUrl.value = imageData;
      await decodeQRCode(imageData);
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("处理图片失败:", error);
    decoding.value = false;
    decodeError.value = "图片处理失败";
    showMessage("图片处理失败", "error");
  }
};

// 解码二维码
const decodeQRCode = async (imageData: string) => {
  try {
    const img = new Image();
    img.src = imageData;

    await new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("无法创建 canvas context"));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height, {
            inversionAttempts: "dontInvert",
          });

          decoding.value = false;

          if (code) {
            decodeResult.value = code.data;
            showMessage("解码成功");
          } else {
            decodeError.value =
              "未识别到二维码，请确保图片清晰且包含完整二维码";
            showMessage("未识别到二维码", "error");
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("图片加载失败"));
      };
    });
  } catch (error) {
    console.error("解码失败:", error);
    decoding.value = false;
    decodeError.value = "解码失败，请重试";
    showMessage("解码失败", "error");
  }
};

// 复制文本
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板");
  } else {
    showMessage("复制失败", "error");
  }
};

// 清空解码
const clearDecode = () => {
  decodeImageUrl.value = "";
  decodeResult.value = "";
  decodeError.value = "";
  decoding.value = false;
  showMessage("已清空解码内容");
};

defineExpose({
  clearDecode,
});
</script>
