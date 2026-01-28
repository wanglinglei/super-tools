# MessageToast 消息提示组件

全局消息提示组件，用于显示操作反馈信息。

## 功能特性

- ✅ 支持多种消息类型（success、error、warning、info）
- ✅ 自动消失（默认 2 秒）
- ✅ 优雅的淡入淡出动画
- ✅ 固定顶部居中显示
- ✅ 支持自定义显示时长
- ✅ 自动清理定时器，防止内存泄漏

## 使用方式

### 1. 在组件中使用

```vue
<template>
  <div>
    <!-- 消息提示组件 -->
    <MessageToast 
      :visible="message.show" 
      :text="message.text" 
      :type="message.type" 
    />
    
    <!-- 你的内容 -->
    <button @click="showMessage('操作成功')">显示消息</button>
  </div>
</template>

<script setup lang="ts">
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';

// 使用 useMessage 组合式函数
const { message, showMessage } = useMessage();
</script>
```

### 2. 使用 useMessage 组合式函数

```typescript
import { useMessage } from '@/composables/useMessage';

const { message, showMessage } = useMessage();

// 显示成功消息
showMessage('操作成功', 'success');

// 显示错误消息
showMessage('操作失败', 'error');

// 显示警告消息
showMessage('请注意', 'warning');

// 显示信息消息
showMessage('这是一条提示', 'info');

// 自定义显示时长（3秒）
showMessage('这条消息会显示3秒', 'success', 3000);
```

## API

### MessageToast 组件 Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | boolean | - | 是否显示消息 |
| text | string | - | 消息文本内容 |
| type | 'success' \| 'error' \| 'warning' \| 'info' | 'success' | 消息类型 |

### useMessage 返回值

| 名称 | 类型 | 说明 |
|------|------|------|
| message | MessageState | 消息状态对象 |
| showMessage | Function | 显示消息的方法 |

### MessageState 接口

```typescript
interface MessageState {
  show: boolean;      // 是否显示
  text: string;       // 消息文本
  type: MessageType;  // 消息类型
}
```

### showMessage 方法签名

```typescript
showMessage(
  text: string,                              // 消息文本
  type?: 'success' | 'error' | 'warning' | 'info',  // 消息类型，默认 'success'
  duration?: number                          // 显示时长（毫秒），默认 2000
): void
```

## 消息类型样式

| 类型 | 颜色 | 使用场景 |
|------|------|----------|
| success | 绿色 | 操作成功、保存成功、提交成功等 |
| error | 红色 | 操作失败、错误提示、验证失败等 |
| warning | 黄色 | 警告信息、需要注意的提示等 |
| info | 蓝色 | 一般信息提示、说明等 |

## 完整示例

```vue
<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b">
      <button class="tool-btn" @click="handleSave">保存</button>
      <button class="tool-btn" @click="handleDelete">删除</button>
    </div>

    <!-- 消息提示 -->
    <MessageToast :visible="message.show" :text="message.text" :type="message.type" />

    <!-- 主内容 -->
    <div class="flex-1 p-4">
      <!-- 你的内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';

const { message, showMessage } = useMessage();

const handleSave = () => {
  try {
    // 保存逻辑
    showMessage('保存成功', 'success');
  } catch (error) {
    showMessage('保存失败', 'error');
  }
};

const handleDelete = () => {
  showMessage('确定要删除吗？', 'warning');
};
</script>
```

## 特性说明

### 自动清理

`useMessage` 组合式函数内部使用了 `onUnmounted` 钩子，会在组件卸载时自动清理定时器，无需手动处理。

```typescript
onUnmounted(() => {
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
});
```

### 防抖处理

当连续调用 `showMessage` 时，会自动清除之前的定时器，避免消息堆积。

```typescript
const showMessage = (text: string, type = 'success', duration = 2000) => {
  if (messageTimer) {
    clearTimeout(messageTimer);  // 清除之前的定时器
  }
  // ... 显示新消息
};
```

## 样式定制

组件使用 Tailwind CSS 样式，可以通过修改组件源码来定制样式：

```vue
<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
      :class="typeClass"
    >
      {{ text }}
    </div>
  </Transition>
</template>
```

### 修改位置

- 顶部距离：`top-20` 改为其他值
- 水平位置：`left-1/2 -translate-x-1/2` 实现居中

### 修改动画

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;  /* 修改动画时长和缓动函数 */
}
```

## 最佳实践

1. **统一使用 useMessage**：所有页面都通过 `useMessage` 使用消息提示，保持一致性
2. **合理的消息时长**：一般提示 2 秒，重要提示可以 3-4 秒
3. **明确的消息类型**：根据操作结果选择合适的类型
4. **简洁的消息文本**：文本应简短明了，一般不超过 20 字
5. **避免频繁提示**：不要对每个小操作都显示提示

## 注意事项

- 每个页面只需要添加一个 `<MessageToast>` 组件
- 不要在同一个组件中多次调用 `useMessage()`
- 消息提示会自动覆盖之前的提示，不会叠加显示
- 组件卸载时会自动清理定时器，无需担心内存泄漏

## 迁移指南

### 从旧代码迁移

**旧代码**：
```vue
<template>
  <Transition name="fade">
    <div
      v-if="message.show"
      class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
      :class="message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
    >
      {{ message.text }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error',
});

let messageTimer: ReturnType<typeof setTimeout> | null = null;

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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

**新代码**：
```vue
<template>
  <!-- 消息提示 -->
  <MessageToast :visible="message.show" :text="message.text" :type="message.type" />
</template>

<script setup lang="ts">
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';

const { message, showMessage } = useMessage();
</script>
```

迁移步骤：
1. 删除模板中的 `<Transition>` 和消息提示 DOM
2. 删除 `message` 响应式对象和 `showMessage` 函数定义
3. 删除 `messageTimer` 变量和相关清理代码
4. 删除样式中的 `.fade-*` 动画 CSS
5. 导入 `MessageToast` 组件和 `useMessage`
6. 在模板中添加 `<MessageToast>` 组件
7. 使用解构获取 `message` 和 `showMessage`
