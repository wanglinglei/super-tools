import { reactive, onUnmounted } from 'vue';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface MessageState {
  show: boolean;
  text: string;
  type: MessageType;
}

export function useMessage() {
  const message = reactive<MessageState>({
    show: false,
    text: '',
    type: 'success',
  });

  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  const showMessage = (text: string, type: MessageType = 'success', duration: number = 2000) => {
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    message.text = text;
    message.type = type;
    message.show = true;
    messageTimer = setTimeout(() => {
      message.show = false;
    }, duration);
  };

  // 清理定时器
  onUnmounted(() => {
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
  });

  return {
    message,
    showMessage,
  };
}
