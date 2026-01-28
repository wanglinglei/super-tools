<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button class="tool-btn" @click="generateQRCode">
          <SvgIcon name="format" size="16px" class-name="mr-1.5" />
          生成二维码
        </button>
        <button class="tool-btn" @click="downloadQRCode" :disabled="!qrcodeDataUrl">
          <SvgIcon name="download" size="16px" class-name="mr-1.5" />
          下载二维码
        </button>
      </div>

      <!-- 右侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-icon"
          title="清空所有"
          @click="clearAll"
        >
          <SvgIcon name="trash" size="20px" />
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <Transition name="fade">
      <div
        v-if="message.show"
        class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        :class="message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        {{ message.text }}
      </div>
    </Transition>

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto p-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- 左侧：配置区 -->
          <div class="space-y-2.5">
            <!-- 输入内容 -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <h2 class="text-sm font-bold text-gray-800 mb-2">📝 输入内容</h2>
              <textarea
                v-model="inputText"
                placeholder="请输入要生成二维码的内容（网址、文本等）"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                @input="autoGenerate"
              ></textarea>
            </div>

            <!-- 基础配置 -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <h2 class="text-sm font-bold text-gray-800 mb-2">⚙️ 基础配置</h2>
              <div class="space-y-2.5">
                <!-- 二维码大小 -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">
                    大小: <span class="text-blue-600">{{ qrSize }}px</span>
                  </label>
                  <input
                    v-model.number="qrSize"
                    type="range"
                    min="128"
                    max="512"
                    step="16"
                    class="w-full"
                    @input="autoGenerate"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-0.5">
                    <span>128</span>
                    <span>512</span>
                  </div>
                </div>

                <!-- 容错级别 -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">容错级别</label>
                  <select
                    v-model="errorCorrectionLevel"
                    class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="autoGenerate"
                  >
                    <option value="L">低 (7%)</option>
                    <option value="M">中 (15%)</option>
                    <option value="Q">较高 (25%)</option>
                    <option value="H">高 (30%)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 颜色配置 -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <h2 class="text-sm font-bold text-gray-800 mb-2">🎨 颜色配置</h2>
              <div class="grid grid-cols-2 gap-2">
                <!-- 前景色 -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">前景色</label>
                  <div class="flex gap-1.5">
                    <input
                      v-model="foregroundColor"
                      type="color"
                      class="w-10 h-8 rounded cursor-pointer border border-gray-300"
                      @input="autoGenerate"
                    />
                    <input
                      v-model="foregroundColor"
                      type="text"
                      class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      @input="autoGenerate"
                    />
                  </div>
                </div>

                <!-- 背景色 -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">背景色</label>
                  <div class="flex gap-1.5">
                    <input
                      v-model="backgroundColor"
                      type="color"
                      class="w-10 h-8 rounded cursor-pointer border border-gray-300"
                      @input="autoGenerate"
                    />
                    <input
                      v-model="backgroundColor"
                      type="text"
                      class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      @input="autoGenerate"
                    />
                  </div>
                </div>
              </div>

              <!-- 颜色预设 -->
              <div class="mt-2">
                <label class="block text-xs font-medium text-gray-700 mb-1.5">快捷预设</label>
                <div class="grid grid-cols-8 gap-1.5">
                  <button
                    v-for="preset in colorPresets"
                    :key="preset.name"
                    class="aspect-square rounded border-2 hover:border-blue-500 transition-colors"
                    :style="{ background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)` }"
                    :title="preset.name"
                    @click="applyColorPreset(preset)"
                  ></button>
                </div>
              </div>
            </div>

            <!-- 自定义图标 -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <h2 class="text-sm font-bold text-gray-800 mb-2">🖼️ 中心图标</h2>
              <div class="space-y-2">
                <div class="flex gap-2">
                  <button
                    class="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    @click="selectIcon"
                  >
                    选择图标
                  </button>
                  <button
                    v-if="centerIcon"
                    class="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    @click="removeCenterIcon"
                  >
                    移除
                  </button>
                </div>

                <!-- 图标预览 -->
                <div v-if="centerIcon" class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <img :src="centerIcon" class="w-10 h-10 rounded object-cover" alt="中心图标" />
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-600 mb-1">大小: {{ Math.round(iconSizeRatio * 100) }}%</div>
                    <input
                      v-model.number="iconSizeRatio"
                      type="range"
                      min="0.1"
                      max="0.3"
                      step="0.05"
                      class="w-full"
                      @input="autoGenerate"
                    />
                  </div>
                </div>

                <input
                  ref="iconInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleIconUpload"
                />
              </div>
            </div>
          </div>

          <!-- 右侧：预览区 -->
          <div>
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 sticky top-4">
              <h2 class="text-sm font-bold text-gray-800 mb-2">👁️ 二维码预览</h2>
              
              <!-- 二维码显示区 -->
              <div class="flex items-center justify-center bg-gray-50 rounded-lg p-4" style="min-height: 360px;">
                <div v-if="qrcodeDataUrl" class="relative">
                  <img :src="qrcodeDataUrl" alt="二维码" class="rounded-lg shadow-md" />
                  <div v-if="centerIcon" class="absolute inset-0 flex items-center justify-center">
                    <img
                      :src="centerIcon"
                      :style="{ width: iconDisplaySize + 'px', height: iconDisplaySize + 'px' }"
                      class="rounded bg-white p-1"
                      alt="中心图标"
                    />
                  </div>
                </div>
                <div v-else class="text-center text-gray-400">
                  <div class="text-4xl mb-2">📱</div>
                  <div class="text-sm">输入内容后自动生成二维码</div>
                </div>
              </div>

              <!-- 快捷操作 -->
              <div v-if="qrcodeDataUrl" class="mt-3 grid grid-cols-2 gap-2">
                <button
                  class="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  @click="copyQRCodeImage"
                >
                  复制图片
                </button>
                <button
                  class="px-3 py-1.5 text-xs bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  @click="downloadQRCode"
                >
                  下载图片
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import QRCode from 'qrcode';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';

// 输入内容
const inputText = ref('https://example.com');

// 二维码配置
const qrSize = ref(300);
const errorCorrectionLevel = ref<'L' | 'M' | 'Q' | 'H'>('M');
const foregroundColor = ref('#000000');
const backgroundColor = ref('#ffffff');

// 中心图标
const centerIcon = ref('');
const iconSizeRatio = ref(0.2);
const iconInputRef = ref<HTMLInputElement | null>(null);

// 二维码数据
const qrcodeDataUrl = ref('');

// 计算图标显示大小
const iconDisplaySize = computed(() => Math.round(qrSize.value * iconSizeRatio.value));

// 消息提示
const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error',
});

let messageTimer: ReturnType<typeof setTimeout> | null = null;

// 颜色预设
const colorPresets = [
  { name: '经典黑白', fg: '#000000', bg: '#ffffff' },
  { name: '蓝色', fg: '#1e40af', bg: '#eff6ff' },
  { name: '绿色', fg: '#15803d', bg: '#f0fdf4' },
  { name: '紫色', fg: '#7c3aed', bg: '#faf5ff' },
  { name: '红色', fg: '#dc2626', bg: '#fef2f2' },
  { name: '橙色', fg: '#ea580c', bg: '#fff7ed' },
  { name: '粉色', fg: '#db2777', bg: '#fdf2f8' },
  { name: '深色模式', fg: '#ffffff', bg: '#1f2937' },
];

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
  message.text = text;
  message.type = type;
  message.show = true;
  messageTimer = setTimeout(() => {
    message.show = false;
  }, 2000);
};

// 生成二维码
const generateQRCode = async () => {
  if (!inputText.value.trim()) {
    showMessage('请输入要生成二维码的内容', 'error');
    return;
  }

  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, inputText.value, {
      width: qrSize.value,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel.value,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value,
      },
    });

    // 如果有中心图标，在 canvas 上绘制
    if (centerIcon.value) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = centerIcon.value;
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            const iconSize = iconDisplaySize.value;
            const x = (canvas.width - iconSize) / 2;
            const y = (canvas.height - iconSize) / 2;
            
            // 绘制白色背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 4, y - 4, iconSize + 8, iconSize + 8);
            
            // 绘制图标
            ctx.drawImage(img, x, y, iconSize, iconSize);
            resolve(true);
          };
          img.onerror = reject;
        });
      }
    }

    qrcodeDataUrl.value = canvas.toDataURL('image/png');
    showMessage('二维码生成成功');
  } catch (error) {
    console.error('生成二维码失败:', error);
    showMessage('生成二维码失败', 'error');
  }
};

// 自动生成（防抖）
let autoGenerateTimer: ReturnType<typeof setTimeout> | null = null;
const autoGenerate = () => {
  if (autoGenerateTimer) {
    clearTimeout(autoGenerateTimer);
  }
  autoGenerateTimer = setTimeout(() => {
    if (inputText.value.trim()) {
      generateQRCode();
    }
  }, 300);
};

// 下载二维码
const downloadQRCode = () => {
  if (!qrcodeDataUrl.value) {
    showMessage('请先生成二维码', 'error');
    return;
  }

  const link = document.createElement('a');
  link.download = `qrcode_${Date.now()}.png`;
  link.href = qrcodeDataUrl.value;
  link.click();
  showMessage('下载成功');
};

// 复制二维码图片
const copyQRCodeImage = async () => {
  if (!qrcodeDataUrl.value) {
    showMessage('请先生成二维码', 'error');
    return;
  }

  try {
    const response = await fetch(qrcodeDataUrl.value);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    showMessage('已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    showMessage('复制失败，请使用下载功能', 'error');
  }
};

// 应用颜色预设
const applyColorPreset = (preset: any) => {
  foregroundColor.value = preset.fg;
  backgroundColor.value = preset.bg;
  autoGenerate();
  showMessage(`已应用：${preset.name}`);
};

// 选择图标
const selectIcon = () => {
  iconInputRef.value?.click();
};

// 处理图标上传
const handleIconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    showMessage('请选择图片文件', 'error');
    return;
  }

  // 读取图片
  const reader = new FileReader();
  reader.onload = (e) => {
    centerIcon.value = e.target?.result as string;
    autoGenerate();
    showMessage('图标已添加');
  };
  reader.readAsDataURL(file);
};

// 移除中心图标
const removeCenterIcon = () => {
  centerIcon.value = '';
  autoGenerate();
  showMessage('图标已移除');
};

// 清空所有
const clearAll = () => {
  inputText.value = '';
  qrcodeDataUrl.value = '';
  centerIcon.value = '';
  qrSize.value = 300;
  errorCorrectionLevel.value = 'M';
  foregroundColor.value = '#000000';
  backgroundColor.value = '#ffffff';
  iconSizeRatio.value = 0.2;
  showMessage('已清空所有内容');
};

onMounted(() => {
  // 初始生成二维码
  if (inputText.value) {
    generateQRCode();
  }
});
</script>

<style scoped>
.tool-btn {
  @apply flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium;
  @apply hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

.tool-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.tool-btn-icon {
  @apply flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md text-gray-600;
  @apply hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

.tool-btn-icon:hover {
  color: #1f2937;
}

/* 消息动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滑块样式 */
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
}
</style>
