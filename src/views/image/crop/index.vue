<template>
  <ToolLayout title="图片裁剪" icon="✂️" :content-scroll="false">
    <template #header-right>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <ToolButton
        icon="upload"
        text="上传图片"
        @click="triggerUpload"
      />
      <ToolButton
        v-if="imageUrl"
        icon="download"
        text="下载结果"
        @click="handleDownload"
      />
      <ToolButton
        v-if="imageUrl"
        icon="trash"
        text="清除"
        @click="clearImage"
      />
    </template>

    <div class="h-full flex flex-col gap-4 p-4">
      <!-- 操作工具栏 -->
      <div v-if="imageUrl" class="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
        <div class="flex gap-2 border-r border-gray-200 pr-2 mr-2">
          <ToolButton icon="zoom-in" text="放大" @click="zoom(0.1)" size="sm" />
          <ToolButton icon="zoom-out" text="缩小" @click="zoom(-0.1)" size="sm" />
        </div>
        
        <div class="flex gap-2 border-r border-gray-200 pr-2 mr-2">
          <ToolButton icon="rotate-ccw" text="左旋" @click="rotate(-90)" size="sm" />
          <ToolButton icon="rotate-cw" text="右旋" @click="rotate(90)" size="sm" />
        </div>

        <div class="flex gap-2 border-r border-gray-200 pr-2 mr-2">
          <ToolButton icon="arrows-h" text="水平翻转" @click="scaleX" size="sm" />
          <ToolButton icon="arrows-v" text="垂直翻转" @click="scaleY" size="sm" />
        </div>

        <div class="flex gap-2">
          <ToolButton icon="refresh" text="重置" @click="reset" size="sm" />
          <ToolButton icon="crop" text="裁剪预览" @click="crop" size="sm" type="primary" />
        </div>
      </div>

      <div class="flex-1 flex gap-4 min-h-0">
        <!-- 编辑区域 -->
        <div class="flex-1 bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-200">
          <div v-if="!imageUrl" class="text-gray-400 flex flex-col items-center gap-2">
            <div class="text-4xl">🖼️</div>
            <div>请上传图片开始裁剪</div>
          </div>
          <img
            v-if="imageUrl"
            ref="imageRef"
            :src="imageUrl"
            alt="Source Image"
            class="max-w-full max-h-full block"
          />
        </div>

        <!-- 预览区域 -->
        <div v-if="imageUrl" class="w-64 flex flex-col gap-4">
          <div class="text-sm font-medium text-gray-700">实时预览</div>
          <div class="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 preview-box"></div>
          
          <div v-if="croppedResult" class="flex flex-col gap-2">
             <div class="text-sm font-medium text-gray-700">裁剪结果</div>
             <img :src="croppedResult" class="w-full border border-gray-200 rounded-lg bg-white" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue';
import ToolLayout from '@/layouts/ToolLayout.vue';
import ToolButton from '@/components/ToolButton/ToolButton.vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const fileInput = ref<HTMLInputElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const imageUrl = ref<string>('');
const croppedResult = ref<string>('');
let cropper: Cropper | null = null;

// 缩放状态
let scaleXVal = 1;
let scaleYVal = 1;

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      // 如果已有 cropper 实例，先销毁
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
      imageUrl.value = e.target.result as string;
      croppedResult.value = '';
      
      // 等待 DOM 更新后初始化 Cropper
      nextTick(() => {
        initCropper();
      });
    }
  };
  reader.readAsDataURL(file);
  // 清空 input，允许重复上传同一文件
  (e.target as HTMLInputElement).value = '';
};

const initCropper = () => {
  if (!imageRef.value) return;
  
  cropper = new Cropper(imageRef.value, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: NaN, // 自由比例
    autoCropArea: 0.8,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    preview: '.preview-box', // 绑定预览容器
  });
};

const zoom = (ratio: number) => {
  cropper?.zoom(ratio);
};

const rotate = (degree: number) => {
  cropper?.rotate(degree);
};

const scaleX = () => {
  scaleXVal = scaleXVal === 1 ? -1 : 1;
  cropper?.scaleX(scaleXVal);
};

const scaleY = () => {
  scaleYVal = scaleYVal === 1 ? -1 : 1;
  cropper?.scaleY(scaleYVal);
};

const reset = () => {
  cropper?.reset();
  scaleXVal = 1;
  scaleYVal = 1;
};

const crop = () => {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas();
  if (canvas) {
    croppedResult.value = canvas.toDataURL('image/png');
  }
};

const handleDownload = () => {
  if (!cropper) return;
  // 如果没有生成预览，先生成
  if (!croppedResult.value) {
    crop();
  }
  
  const link = document.createElement('a');
  link.download = `cropped-image-${Date.now()}.png`;
  link.href = croppedResult.value;
  link.click();
};

const clearImage = () => {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
  imageUrl.value = '';
  croppedResult.value = '';
  scaleXVal = 1;
  scaleYVal = 1;
};

onUnmounted(() => {
  if (cropper) {
    cropper.destroy();
  }
});
</script>

<style scoped>
/* 覆盖 cropperjs 默认样式以适配 */
:deep(.cropper-view-box),
:deep(.cropper-face) {
  border-radius: 0;
}
</style>
