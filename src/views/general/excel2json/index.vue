<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button class="tool-btn" @click="selectFile">
          <SvgIcon name="upload" size="16px" class-name="mr-1.5" />
          上传 Excel
        </button>
        <button class="tool-btn" @click="convertToJson" :disabled="!excelData.length">
          <SvgIcon name="format" size="16px" class-name="mr-1.5" />
          转换为 JSON
        </button>
      </div>

      <!-- 右侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-icon"
          title="复制 JSON"
          @click="copyJson"
          :disabled="!jsonOutput"
        >
          <SvgIcon name="copy" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="下载 JSON"
          @click="downloadJson"
          :disabled="!jsonOutput"
        >
          <SvgIcon name="download" size="20px" />
        </button>
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
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- 左侧：Excel 数据预览 -->
          <div class="space-y-3">
            <!-- 文件信息 -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <h2 class="text-sm font-bold text-gray-800 mb-2">📊 Excel 数据</h2>
              
              <div v-if="!excelData.length" class="text-center py-8 text-gray-400">
                <div class="text-4xl mb-2">📁</div>
                <div class="text-sm">请上传 Excel 文件</div>
                <button
                  class="mt-3 px-4 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  @click="selectFile"
                >
                  选择文件
                </button>
              </div>

              <div v-else>
                <!-- 文件信息 -->
                <div class="flex items-center justify-between p-2 bg-blue-50 rounded-lg mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">📄</span>
                    <div>
                      <div class="text-sm font-medium text-gray-800">{{ fileName }}</div>
                      <div class="text-xs text-gray-500">{{ excelData.length }} 行数据</div>
                    </div>
                  </div>
                  <button
                    class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                    @click="selectFile"
                  >
                    更换
                  </button>
                </div>

                <!-- 字段选择 -->
                <div class="mb-3">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-xs font-medium text-gray-700">选择要转换的字段</label>
                    <div class="flex gap-1">
                      <button
                        class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        @click="selectAllFields"
                      >
                        全选
                      </button>
                      <button
                        class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        @click="deselectAllFields"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                    <label
                      v-for="field in availableFields"
                      :key="field"
                      class="flex items-center gap-2 px-2 py-1.5 bg-white rounded border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        :value="field"
                        v-model="selectedFields"
                        class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        @change="convertToJson"
                      />
                      <span class="text-xs text-gray-700 flex-1 truncate" :title="field">{{ field }}</span>
                    </label>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    已选择 {{ selectedFields.length }} / {{ availableFields.length }} 个字段
                  </div>
                </div>

                <!-- 数据预览 -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">数据预览（前 5 行，显示所有字段）</label>
                  <div class="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                    <table class="w-full text-xs">
                      <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th class="px-2 py-1.5 text-left font-medium text-gray-600">#</th>
                          <th
                            v-for="field in availableFields"
                            :key="field"
                            class="px-2 py-1.5 text-left font-medium text-gray-600 whitespace-nowrap"
                            :class="{ 'bg-blue-50': selectedFields.includes(field) }"
                          >
                            {{ field }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(row, index) in previewData"
                          :key="index"
                          class="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td class="px-2 py-1.5 text-gray-500">{{ index + 1 }}</td>
                          <td
                            v-for="field in availableFields"
                            :key="field"
                            class="px-2 py-1.5 text-gray-700"
                            :class="{ 'bg-blue-50': selectedFields.includes(field) }"
                          >
                            {{ (row as any)[field] }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    提示：蓝色背景为选中的字段，JSON 输出只包含选中字段的数据
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：JSON 输出 -->
          <div class="space-y-3">
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-sm font-bold text-gray-800">📝 JSON 输出</h2>
                <div v-if="jsonOutput" class="flex gap-1">
                  <button
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    @click="formatJson = !formatJson; convertToJson()"
                  >
                    {{ formatJson ? '压缩' : '格式化' }}
                  </button>
                </div>
              </div>

              <div v-if="!jsonOutput" class="text-center py-12 text-gray-400">
                <div class="text-4xl mb-2">{ }</div>
                <div class="text-sm">上传 Excel 并点击"转换为 JSON"</div>
              </div>

              <div v-else class="space-y-3">
                <!-- JSON 预览 -->
                <div class="relative">
                  <pre
                    class="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto"
                    style="max-height: 500px;"
                  ><code>{{ jsonOutput }}</code></pre>
                  <button
                    class="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                    @click="copyJson"
                  >
                    复制
                  </button>
                </div>

                <!-- 统计信息 -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-blue-50 rounded-lg p-2 text-center">
                    <div class="text-xs text-gray-600">数据行数</div>
                    <div class="text-lg font-bold text-blue-600">{{ convertedCount }}</div>
                  </div>
                  <div class="bg-green-50 rounded-lg p-2 text-center">
                    <div class="text-xs text-gray-600">字段数</div>
                    <div class="text-lg font-bold text-green-600">{{ selectedFields.length }}</div>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-2 text-center">
                    <div class="text-xs text-gray-600">文件大小</div>
                    <div class="text-lg font-bold text-purple-600">{{ formatBytes(jsonOutput.length) }}</div>
                  </div>
                </div>

                <!-- 快捷操作 -->
                <div class="grid grid-cols-2 gap-2">
                  <button
                    class="px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    @click="copyJson"
                  >
                    复制 JSON
                  </button>
                  <button
                    class="px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    @click="downloadJson"
                  >
                    下载 JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件上传 input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".xlsx,.xls,.csv"
      class="hidden"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import * as XLSX from 'xlsx';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';

// 文件相关
const fileInputRef = ref<HTMLInputElement | null>(null);
const fileName = ref('');
const excelData = ref<any[]>([]);
const availableFields = ref<string[]>([]);
const selectedFields = ref<string[]>([]);

// JSON 输出
const jsonOutput = ref('');
const formatJson = ref(true);
const convertedCount = ref(0);

// 消息提示
const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error',
});

let messageTimer: ReturnType<typeof setTimeout> | null = null;

// 预览数据（前5行）
const previewData = computed(() => excelData.value.slice(0, 5));

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

// 选择文件
const selectFile = () => {
  fileInputRef.value?.click();
};

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    fileName.value = file.name;
    
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    // 读取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      showMessage('Excel 文件没有工作表', 'error');
      return;
    }
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) {
      showMessage('无法读取工作表', 'error');
      return;
    }
    
    // 转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (!jsonData.length) {
      showMessage('Excel 文件为空', 'error');
      return;
    }
    
    excelData.value = jsonData;
    
    // 获取所有字段
    const fields = Object.keys(jsonData[0] as object);
    availableFields.value = fields;
    selectedFields.value = [...fields]; // 默认全选
    
    showMessage(`成功读取 ${jsonData.length} 行数据`);
    
    // 自动转换
    convertToJson();
    
    // 清空 input
    if (target) {
      target.value = '';
    }
  } catch (error) {
    console.error('读取文件失败:', error);
    showMessage('读取文件失败', 'error');
  }
};

// 全选字段
const selectAllFields = () => {
  selectedFields.value = [...availableFields.value];
  if (excelData.value.length) {
    convertToJson();
  }
};

// 取消全选
const deselectAllFields = () => {
  selectedFields.value = [];
  // 不清空 JSON 输出，保持上一次的结果
};

// 转换为 JSON
const convertToJson = () => {
  if (!excelData.value.length) {
    showMessage('请先上传 Excel 文件', 'error');
    return;
  }
  
  if (!selectedFields.value.length) {
    showMessage('请至少选择一个字段', 'error');
    return;
  }
  
  try {
    // 过滤选中的字段
    const filteredData = excelData.value.map(row => {
      const newRow: any = {};
      selectedFields.value.forEach(field => {
        newRow[field] = row[field];
      });
      return newRow;
    });
    
    convertedCount.value = filteredData.length;
    
    if (formatJson.value) {
      jsonOutput.value = JSON.stringify(filteredData, null, 2);
    } else {
      jsonOutput.value = JSON.stringify(filteredData);
    }
    
    showMessage('转换成功');
  } catch (error) {
    console.error('转换失败:', error);
    showMessage('转换失败', 'error');
  }
};

// 复制 JSON
const copyJson = async () => {
  if (!jsonOutput.value) {
    showMessage('请先转换数据', 'error');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    showMessage('已复制到剪贴板');
  } catch {
    showMessage('复制失败', 'error');
  }
};

// 下载 JSON
const downloadJson = () => {
  if (!jsonOutput.value) {
    showMessage('请先转换数据', 'error');
    return;
  }
  
  const blob = new Blob([jsonOutput.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName.value.replace(/\.[^/.]+$/, '')}_${Date.now()}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
  showMessage('下载成功');
};

// 格式化字节
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 清空所有
const clearAll = () => {
  fileName.value = '';
  excelData.value = [];
  availableFields.value = [];
  selectedFields.value = [];
  jsonOutput.value = '';
  convertedCount.value = 0;
  showMessage('已清空所有内容');
};
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

.tool-btn-icon:disabled {
  @apply opacity-50 cursor-not-allowed;
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

/* 表格样式 */
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
