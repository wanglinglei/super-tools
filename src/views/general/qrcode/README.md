# 二维码生成与解码工具

功能强大的在线二维码工具，支持生成和解码二维码，自定义颜色、大小和中心图标。

## 功能特性

### 1. 内容输入（生成）
- ✅ 支持任意文本内容
- ✅ 支持网址链接
- ✅ 实时预览
- ✅ 自动生成（输入后自动更新）

### 2. 基础配置

#### 二维码大小
- 范围：128px - 512px
- 步进：16px
- 实时滑块调节
- 适应不同使用场景

#### 容错级别
- **低 (L)**: 7% 容错率 - 最快扫描
- **中 (M)**: 15% 容错率 - 推荐使用
- **较高 (Q)**: 25% 容错率 - 较强抗损
- **高 (H)**: 30% 容错率 - 最强抗损

> 容错级别越高，二维码越复杂，但抗污损能力越强

### 3. 颜色配置

#### 自定义颜色
- 前景色（二维码图案颜色）
- 背景色（二维码底色）
- 支持颜色选择器
- 支持十六进制输入

#### 快捷预设（8种）
- 🖤 经典黑白
- 💙 蓝色主题
- 💚 绿色主题
- 💜 紫色主题
- ❤️ 红色主题
- 🧡 橙色主题
- 💗 粉色主题
- 🌙 深色模式

### 4. 中心图标

#### 支持功能
- ✅ 上传自定义图标
- ✅ 调节图标大小（10% - 30%）
- ✅ 自动白色背景
- ✅ 一键移除图标

#### 使用建议
- 使用正方形图标效果最佳
- 建议容错级别设为 Q 或 H
- 图标不宜过大（推荐 20%）
- 图标应简洁清晰

### 5. 二维码解码

#### 支持功能
- ✅ 上传二维码图片
- ✅ 自动识别解码
- ✅ 支持多种图片格式（JPG、PNG、GIF等）
- ✅ 实时解码反馈
- ✅ 一键复制解码结果

#### 解码特点
- 使用 jsQR 库，识别准确率高
- 支持旋转、模糊的二维码
- 自动尝试多种解码策略
- 清晰的成功/失败提示

## 使用说明

### 页面布局

页面分为三个区域：

1. **顶部工具栏**
   - 左侧：工具标题 "📱 二维码工具"
   - 右侧：操作按钮（生成、下载、清空）
   - 按钮根据当前 Tab 动态显示

2. **Tab 切换栏**
   - 📱 生成二维码
   - 🔍 解码二维码
   - 点击即可切换模式

3. **内容区域**
   - 根据选中的 Tab 显示不同内容
   - 生成模式：左右分栏布局
   - 解码模式：居中布局

### 二维码生成

### 基础使用
1. 在"输入内容"区域输入要生成的内容
2. 二维码会自动生成并显示在右侧
3. 点击"下载二维码"保存图片

### 自定义样式
1. 拖动"大小"滑块调整二维码尺寸
2. 点击颜色选择器或输入十六进制值设置颜色
3. 或直接点击颜色预设快速应用主题

### 添加中心图标
1. 点击"选择图标"按钮
2. 从本地选择图片文件
3. 拖动"图标大小比例"滑块调整大小
4. 二维码会自动重新生成

### 导出使用
- **下载图片**: 点击"下载二维码"按钮，保存为 PNG 格式
- **复制图片**: 点击"复制图片"按钮，直接粘贴到其他应用

### 二维码解码

1. **上传图片**
   - 点击解码区域的上传按钮
   - 选择包含二维码的图片
   - 支持 JPG、PNG、GIF 等格式

2. **查看结果**
   - 上传后自动开始解码
   - 显示解码状态（解码中/成功/失败）
   - 成功后显示解码内容

3. **操作结果**
   - 点击"复制"按钮复制解码内容
   - 点击"更换图片"上传新图片
   - 点击"清空"清除当前结果

### 解码注意事项

- **图片质量**：清晰的图片识别率更高
- **二维码完整性**：确保二维码完整无遮挡
- **图片大小**：建议不超过 5MB
- **格式支持**：JPG、PNG、GIF、WebP 等常见格式

## 技术实现

### 组件架构

页面使用以下公共组件：

1. **TabBar 组件** (`@/components/TabBar/TabBar.vue`)
   - 通用的 Tab 切换组件，用于生成/解码模式切换
   - 支持图标和自定义样式
   - 双向绑定 (v-model)

2. **MessageToast 组件** (`@/components/Message/MessageToast.vue`)
   - 统一的消息提示组件
   - 支持成功/错误/警告/信息四种类型

3. **SvgIcon 组件** (`@/components/svgIcon/SvgIcon.vue`)
   - 统一的 SVG 图标管理
   - 支持自定义大小和颜色

使用示例：

```typescript
// Tab 切换
import TabBar from '@/components/TabBar/TabBar.vue';
import type { Tab } from '@/components/TabBar/TabBar.vue';

const tabs: Tab[] = [
  { label: '生成二维码', value: 'generate', icon: '📱' },
  { label: '解码二维码', value: 'decode', icon: '🔍' },
];

const activeTab = ref('generate');
```

### 二维码生成技术
```typescript
// 使用 qrcode 库生成二维码
import QRCode from 'qrcode';

// 生成二维码
await QRCode.toCanvas(canvas, text, {
  width: size,
  margin: 2,
  errorCorrectionLevel: level,
  color: {
    dark: foregroundColor,
    light: backgroundColor,
  },
});
```

### 中心图标实现
```typescript
// 在 Canvas 上绘制图标
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = iconDataUrl;

// 绘制白色背景
ctx.fillStyle = '#ffffff';
ctx.fillRect(x - 4, y - 4, iconSize + 8, iconSize + 8);

// 绘制图标
ctx.drawImage(img, x, y, iconSize, iconSize);
```

### 自动生成机制
```typescript
// 防抖处理，避免频繁生成
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
```

### 解码技术
```typescript
// 使用 jsQR 库解码二维码
import jsQR from 'jsqr';

// 解码流程
const decodeQRCode = async (imageData: string) => {
  // 1. 加载图片
  const img = new Image();
  img.src = imageData;
  
  // 2. 绘制到 canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  // 3. 获取图片数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // 4. 使用 jsQR 解码
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });
  
  // 5. 返回结果
  if (code) {
    return code.data; // 解码成功
  } else {
    throw new Error('未识别到二维码');
  }
};
```

## UI 设计

### 布局结构

```
┌─────────────────────────────────────────┐
│  📱 二维码工具    [生成] [下载] [清空]   │  ← 顶部工具栏
├─────────────────────────────────────────┤
│  📱 生成二维码 | 🔍 解码二维码           │  ← Tab 切换栏
├─────────────────────────────────────────┤
│                                         │
│          内容区域（根据 Tab 变化）       │  ← 内容区
│                                         │
└─────────────────────────────────────────┘
```

**生成模式布局**:
- 左侧：配置面板（输入、配置、颜色、图标）
- 右侧：预览面板（二维码显示、快捷操作）

**解码模式布局**:
- 居中显示：上传区域、图片预览、解码结果

### 视觉特点
- **卡片式设计** - 清晰的功能分区
- **实时预览** - 所见即所得
- **响应式布局** - 自适应各种屏幕
- **渐变背景** - 预览区美观展示

### 交互特点
- 输入即生成（防抖）
- 滑块实时调节
- 颜色预设一键切换
- 拖拽式操作体验

## 使用场景

### 生成场景
1. **网站推广** - 生成网址二维码
2. **社交媒体** - 分享联系方式
3. **产品包装** - 添加产品信息
4. **活动海报** - 快速扫码参与
5. **名片设计** - 个人信息二维码
6. **支付收款** - 收款码生成
7. **文档分享** - 文档链接二维码

### 解码场景
1. **信息提取** - 从图片中提取二维码内容
2. **数据验证** - 验证二维码内容是否正确
3. **批量处理** - 批量识别二维码图片
4. **存档管理** - 从旧图片中恢复二维码信息
5. **内容分析** - 分析二维码包含的数据

## 支持的内容类型

### 文本类型
- 纯文本
- 网址 (http/https)
- 邮箱地址
- 电话号码
- WiFi 配置
- 联系人信息（vCard）
- 地理位置

### 最佳实践
- 网址建议使用短链接
- 文本内容不宜过长
- 中文内容建议 URL 编码
- 测试二维码可扫描性

## 浏览器兼容性

### 必需功能
- Canvas API（所有现代浏览器）
- File API（图片上传）
- Clipboard API（复制功能）

### 推荐浏览器
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 注意事项

1. **容错级别与图标**
   - 添加中心图标时建议使用 Q 或 H 级别
   - 图标会遮挡部分二维码，需要更高容错率

2. **颜色对比度**
   - 前景色和背景色对比度要足够
   - 避免使用相近颜色
   - 建议前景深色，背景浅色

3. **扫描测试**
   - 生成后建议实际扫描测试
   - 确保在不同光线下可读
   - 测试不同扫码应用

4. **文件大小**
   - PNG 格式支持透明背景
   - 尺寸越大文件越大
   - 推荐 256-300px 适中

## 快捷键

暂无快捷键支持，后续版本可添加：
- Ctrl/Cmd + S: 下载
- Ctrl/Cmd + C: 复制
- Ctrl/Cmd + D: 清空

## 未来优化

- [x] 支持二维码解码功能 ✅
- [ ] 支持批量生成
- [ ] 支持批量解码
- [ ] 添加更多颜色预设
- [ ] 支持渐变色
- [ ] 添加边框样式
- [ ] 支持 SVG 格式导出
- [ ] 添加二维码美化效果（圆角、点阵样式）
- [ ] 支持扫码历史记录
- [ ] 添加常用模板（WiFi、名片等）
- [ ] 支持从摄像头实时扫码

## 相关资源

- [QRCode.js 文档](https://github.com/soldair/node-qrcode) - 生成库
- [jsQR 文档](https://github.com/cozmo/jsQR) - 解码库
- [二维码标准](https://www.iso.org/standard/62021.html)
- [容错级别说明](https://en.wikipedia.org/wiki/QR_code#Error_correction)
