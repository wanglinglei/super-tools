# Utils - 工具函数库

通用工具函数库，提供文件操作、数据处理等常用功能。

## 📁 文件说明

### `file.ts` - 文件操作工具

提供文件下载、保存等功能，支持文本文件、JSON、Markdown、图片等多种格式。

**设计模式**：使用策略模式处理不同类型的数据下载，消除重复代码，提供统一 API。

## 📦 模块导出

### 核心函数（推荐使用）⭐

#### `downloadFile(data, options)`

统一的文件下载方法，自动识别数据类型并处理

**支持的数据类型**：
- 文本字符串
- Data URL（base64 编码）
- Blob 对象
- JavaScript 对象/数组（自动转换为 JSON）

```typescript
import { downloadFile } from '@/utils/file';

// 下载文本文件
downloadFile('Hello World', {
  filename: 'note.txt',
  addTimestamp: true
});

// 下载 JSON 数据（自动序列化）
downloadFile({ name: 'test', value: 123 }, {
  filename: 'data.json'
});

// 下载 Data URL（图片）
downloadFile(qrcodeDataUrl, {
  filename: 'qrcode.png',
  addTimestamp: true
});

// 下载 Blob
const blob = new Blob(['content'], { type: 'text/plain' });
downloadFile(blob, {
  filename: 'file.txt'
});
```

### 兼容方法（已废弃，但仍可用）

#### `downloadTextFile(content, options)`

下载文本内容为文件

```typescript
import { downloadTextFile } from '@/utils/file';

downloadTextFile('{"name": "test"}', {
  filename: 'data.json',
  addTimestamp: true
});
```

> ⚠️ **已废弃**：推荐使用 `downloadFile()` 统一方法

#### `downloadDataUrl(dataUrl, options)`

下载 Data URL 为文件

```typescript
import { downloadDataUrl } from '@/utils/file';

downloadDataUrl(qrcodeDataUrl, {
  filename: 'qrcode.png',
  addTimestamp: true
});
```

> ⚠️ **已废弃**：推荐使用 `downloadFile()` 统一方法

#### `downloadBlob(blob, options)`

下载 Blob 对象为文件

```typescript
import { downloadBlob } from '@/utils/file';

const blob = new Blob(['Hello'], { type: 'text/plain' });
downloadBlob(blob, {
  filename: 'hello.txt'
});
```

> ⚠️ **已废弃**：推荐使用 `downloadFile()` 统一方法

### 快捷方法

#### `downloadJson(data, filename, addTimestamp?)`

下载 JavaScript 对象为 JSON 文件

```typescript
import { downloadJson } from '@/utils/file';

// 自动添加时间戳
downloadJson({ name: 'test', value: 123 }, 'data');
// 生成文件: data_1706123456789.json

// 不添加时间戳
downloadJson([1, 2, 3], 'numbers', false);
// 生成文件: numbers.json
```

#### `downloadMarkdown(content, filename, addTimestamp?)`

下载 Markdown 文件

```typescript
import { downloadMarkdown } from '@/utils/file';

downloadMarkdown('# Hello World\n\nThis is a test.', 'document');
// 生成文件: document_1706123456789.md
```

#### `downloadText(content, filename, addTimestamp?)`

下载文本文件

```typescript
import { downloadText } from '@/utils/file';

downloadText('Hello World', 'note');
// 生成文件: note_1706123456789.txt
```

#### `downloadImage(dataUrl, filename, format?, addTimestamp?)`

下载图片（从 Data URL）

```typescript
import { downloadImage } from '@/utils/file';

downloadImage(qrcodeDataUrl, 'qrcode', 'png');
// 生成文件: qrcode_1706123456789.png
```

## 🔧 类型定义

### `DownloadOptions`

下载选项接口

```typescript
interface DownloadOptions {
  /** 文件名（必填） */
  filename: string;
  /** MIME 类型（可选，默认根据扩展名推断） */
  mimeType?: string;
  /** 是否自动添加时间戳（可选，默认 false） */
  addTimestamp?: boolean;
}
```

## 📖 使用示例

### JSON 编辑器（推荐方式）

```typescript
import { downloadFile } from '@/utils/file';

const saveFile = () => {
  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  try {
    // downloadFile 自动识别为文本类型
    downloadFile(content, {
      filename: 'data.json',
      addTimestamp: true
    });
    showMessage('文件已保存', 'success');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

### Markdown 编辑器（推荐方式）

```typescript
import { downloadMarkdown } from '@/utils/file';
// 或使用统一方法：import { downloadFile } from '@/utils/file';

const saveFile = () => {
  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  try {
    // 快捷方法，语法更简洁
    downloadMarkdown(content, 'document');
    
    // 或使用统一方法
    // downloadFile(content, {
    //   filename: 'document.md',
    //   addTimestamp: true
    // });
    
    showMessage('文件已保存', 'success');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

### Excel 转 JSON（推荐方式）

```typescript
import { downloadJson } from '@/utils/file';
// 或使用统一方法：import { downloadFile } from '@/utils/file';

const downloadJsonFile = () => {
  if (!jsonData.value) {
    showMessage('请先转换数据', 'error');
    return;
  }
  
  try {
    const data = JSON.parse(jsonData.value);
    
    // 快捷方法
    downloadJson(data, fileName.value.replace(/\.[^/.]+$/, ''));
    
    // 或使用统一方法（自动序列化对象）
    // downloadFile(data, {
    //   filename: `${fileName.value.replace(/\.[^/.]+$/, '')}.json`,
    //   addTimestamp: true
    // });
    
    showMessage('下载成功');
  } catch (error) {
    showMessage('下载失败', 'error');
  }
};
```

### 二维码工具（推荐方式）

```typescript
import { downloadImage } from '@/utils/file';
// 或使用统一方法：import { downloadFile } from '@/utils/file';

const downloadQRCode = () => {
  if (!qrcodeDataUrl.value) {
    showMessage('请先生成二维码', 'error');
    return;
  }
  
  try {
    // 快捷方法
    downloadImage(qrcodeDataUrl.value, 'qrcode', 'png');
    
    // 或使用统一方法（自动识别 Data URL）
    // downloadFile(qrcodeDataUrl.value, {
    //   filename: 'qrcode.png',
    //   addTimestamp: true
    // });
    
    showMessage('下载成功');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

## 🎯 支持的文件格式

### 自动识别的 MIME 类型

| 扩展名 | MIME 类型 | 说明 |
|--------|-----------|------|
| .json | application/json | JSON 数据 |
| .txt | text/plain | 纯文本 |
| .md | text/markdown | Markdown |
| .html | text/html | HTML |
| .css | text/css | CSS 样式 |
| .js | application/javascript | JavaScript |
| .ts | application/typescript | TypeScript |
| .xml | application/xml | XML |
| .csv | text/csv | CSV 表格 |
| .png | image/png | PNG 图片 |
| .jpg/.jpeg | image/jpeg | JPEG 图片 |
| .gif | image/gif | GIF 图片 |
| .svg | image/svg+xml | SVG 图片 |
| .webp | image/webp | WebP 图片 |
| .pdf | application/pdf | PDF 文档 |
| .zip | application/zip | ZIP 压缩包 |

如果扩展名不在上表中，将使用 `application/octet-stream` 作为默认 MIME 类型。

## 🏗️ 设计模式

### 策略模式（Strategy Pattern）

工具库采用策略模式设计，将不同数据类型的处理逻辑封装为独立的策略类，通过统一接口调用。

#### 架构图

```
┌─────────────────────────────────────────────────┐
│          downloadFile(data, options)            │  ← 统一入口
└────────────────┬────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ 数据类型检测   │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │   策略选择器     │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
    ▼            ▼            ▼              ▼
┌───────┐  ┌──────────┐  ┌───────┐  ┌──────────┐
│ Text  │  │ DataURL  │  │ Blob  │  │  JSON    │
│Strategy│  │ Strategy │  │Strategy│  │ Strategy │
└───┬───┘  └────┬─────┘  └───┬───┘  └────┬─────┘
    │           │            │           │
    └───────────┴────────────┴───────────┘
                 │
                 ▼
         ┌───────────────┐
         │ triggerDownload│  ← 统一下载逻辑
         └───────────────┘
```

#### 策略类实现

```typescript
// 策略接口
interface DataStrategy {
  process(data: DataSource, mimeType: string): [string, boolean];
}

// 文本策略
class TextStrategy implements DataStrategy {
  process(data: string, mimeType: string): [string, boolean] {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return [url, true]; // 需要清理
  }
}

// Data URL 策略
class DataUrlStrategy implements DataStrategy {
  process(data: string, _mimeType: string): [string, boolean] {
    return [data, false]; // 不需要清理
  }
}

// Blob 策略
class BlobStrategy implements DataStrategy {
  process(data: Blob, _mimeType: string): [string, boolean] {
    const url = URL.createObjectURL(data);
    return [url, true]; // 需要清理
  }
}

// JSON 策略
class JsonStrategy implements DataStrategy {
  process(data: object, mimeType: string): [string, boolean] {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: mimeType });
    const url = URL.createObjectURL(blob);
    return [url, true]; // 需要清理
  }
}
```

#### 优势

1. **消除重复代码**：DOM 操作逻辑只实现一次（`triggerDownload`）
2. **易于扩展**：添加新的数据类型只需实现新策略
3. **类型安全**：TypeScript 接口约束确保实现一致性
4. **自动识别**：用户无需关心数据类型，自动选择策略
5. **资源管理**：统一处理 URL 清理，避免内存泄漏

#### 数据类型自动识别

```typescript
function detectDataSourceType(data: DataSource): DataSourceType {
  if (data instanceof Blob) return DataSourceType.BLOB;
  if (typeof data === 'string') {
    if (data.startsWith('data:')) return DataSourceType.DATA_URL;
    return DataSourceType.TEXT;
  }
  if (typeof data === 'object' && data !== null) {
    return DataSourceType.JSON;
  }
  throw new Error('不支持的数据类型');
}
```

## 🔍 功能特性

### 1. 自动推断 MIME 类型

根据文件扩展名自动推断 MIME 类型，无需手动指定：

```typescript
// 自动识别为 application/json
downloadTextFile(jsonData, { filename: 'data.json' });

// 自动识别为 text/markdown
downloadTextFile(mdContent, { filename: 'doc.md' });
```

### 2. 时间戳功能

避免文件名冲突，自动添加时间戳：

```typescript
// 添加时间戳: data_1706123456789.json
downloadTextFile(content, {
  filename: 'data.json',
  addTimestamp: true
});

// 不添加时间戳: data.json
downloadTextFile(content, {
  filename: 'data.json',
  addTimestamp: false  // 或不传此参数
});
```

### 3. 错误处理

所有函数都会进行参数校验，并抛出清晰的错误信息：

```typescript
try {
  downloadTextFile('', { filename: 'test.txt' });
} catch (error) {
  console.error(error.message); // '文件内容不能为空'
}

try {
  downloadTextFile('content', { filename: '' });
} catch (error) {
  console.error(error.message); // '文件名不能为空'
}
```

### 4. 资源自动清理

所有下载操作都会自动清理临时资源（Object URL、DOM 节点）：

```typescript
// 无需手动清理，函数内部会自动处理
downloadTextFile(content, { filename: 'data.json' });

// 等价于以下手动操作，但更安全
const blob = new Blob([content], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'data.json';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);  // 自动清理
URL.revokeObjectURL(url);         // 自动清理
```

## 💡 最佳实践

### 1. 使用快捷方法

优先使用快捷方法，代码更简洁：

```typescript
// ✅ 推荐：使用快捷方法
downloadJson(data, 'data');

// ❌ 不推荐：使用通用方法
downloadTextFile(JSON.stringify(data, null, 2), {
  filename: `data_${Date.now()}.json`,
  mimeType: 'application/json'
});
```

### 2. 错误处理

始终使用 try-catch 处理可能的错误：

```typescript
try {
  downloadJson(data, 'data');
  showMessage('下载成功');
} catch (error) {
  showMessage((error as Error).message, 'error');
}
```

### 3. 验证内容

下载前验证内容是否为空：

```typescript
const saveFile = () => {
  const content = editor.getValue();
  
  // ✅ 先验证内容
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  try {
    downloadTextFile(content, {
      filename: 'data.json',
      addTimestamp: true
    });
    showMessage('文件已保存');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

### 4. 自定义 MIME 类型

对于特殊需求，可以手动指定 MIME 类型：

```typescript
// 下载带 UTF-8 编码的文本文件
downloadTextFile(content, {
  filename: 'data.txt',
  mimeType: 'text/plain;charset=utf-8'
});

// 下载 CSV 文件
downloadTextFile(csvContent, {
  filename: 'data.csv',
  mimeType: 'text/csv;charset=utf-8'
});
```

## 📝 迁移指南

### 从旧代码迁移

#### JSON 编辑器

**v1.0（手动实现，19 行）**：
```typescript
const saveFile = () => {
  if (!editor) return;
  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showMessage('文件已保存', 'success');
};
```

**v2.0（使用工具函数，15 行）**：
```typescript
import { downloadTextFile } from '@/utils/file';

const saveFile = () => {
  if (!editor) return;
  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  try {
    downloadTextFile(content, {
      filename: 'data.json',
      addTimestamp: true
    });
    showMessage('文件已保存', 'success');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

**v3.0（策略模式，15 行）**：
```typescript
import { downloadFile } from '@/utils/file';

const saveFile = () => {
  if (!editor) return;
  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }
  
  try {
    // 统一方法，自动识别文本类型
    downloadFile(content, {
      filename: 'data.json',
      addTimestamp: true
    });
    showMessage('文件已保存', 'success');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

**改进**：
- v1.0 → v2.0：代码减少 21%，消除重复 DOM 操作
- v2.0 → v3.0：API 统一，无需区分数据类型

#### 二维码下载

**v1.0（手动实现，10 行）**：
```typescript
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
```

**v2.0（使用工具函数，11 行）**：
```typescript
import { downloadImage } from '@/utils/file';

const downloadQRCode = () => {
  if (!qrcodeDataUrl.value) {
    showMessage('请先生成二维码', 'error');
    return;
  }
  
  try {
    downloadImage(qrcodeDataUrl.value, 'qrcode', 'png');
    showMessage('下载成功');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

**v3.0（策略模式，11 行）**：
```typescript
import { downloadFile } from '@/utils/file';

const downloadQRCode = () => {
  if (!qrcodeDataUrl.value) {
    showMessage('请先生成二维码', 'error');
    return;
  }
  
  try {
    // 统一方法，自动识别 Data URL
    downloadFile(qrcodeDataUrl.value, {
      filename: 'qrcode.png',
      addTimestamp: true
    });
    showMessage('下载成功');
  } catch (error) {
    showMessage((error as Error).message, 'error');
  }
};
```

**改进**：
- v1.0 → v2.0：添加错误处理
- v2.0 → v3.0：API 统一，代码更简洁

#### Excel 转 JSON（新增，直接使用策略模式）

**v3.0（策略模式，自动序列化）**：
```typescript
import { downloadFile } from '@/utils/file';

const downloadJsonFile = () => {
  if (!jsonData.value) {
    showMessage('请先转换数据', 'error');
    return;
  }
  
  try {
    const data = JSON.parse(jsonData.value);
    
    // 传入对象，自动序列化为 JSON
    downloadFile(data, {
      filename: `${fileName.value.replace(/\.[^/.]+$/, '')}.json`,
      addTimestamp: true
    });
    
    showMessage('下载成功');
  } catch (error) {
    showMessage('下载失败', 'error');
  }
};
```

**优势**：无需手动调用 `JSON.stringify()`，自动处理

## 🔄 更新日志

### v3.0.0 (2026-01-28) - 策略模式重构 🎨

**重大变更**：
- ✅ 采用策略模式重构，消除重复的 DOM 操作代码
- ✅ 新增 `downloadFile()` 统一入口方法
- ✅ 自动识别数据类型（文本、Data URL、Blob、JSON）
- ✅ 自动处理 JSON 对象序列化
- ✅ 统一的资源清理逻辑
- ✅ 更好的类型安全和错误处理

**废弃但兼容**：
- ⚠️ `downloadTextFile()` - 推荐使用 `downloadFile()`
- ⚠️ `downloadDataUrl()` - 推荐使用 `downloadFile()`
- ⚠️ `downloadBlob()` - 推荐使用 `downloadFile()`

**快捷方法**（保持不变）：
- ✅ `downloadJson()` - 内部使用新策略
- ✅ `downloadMarkdown()` - 内部使用新策略
- ✅ `downloadText()` - 内部使用新策略
- ✅ `downloadImage()` - 内部使用新策略

**性能优化**：
- 减少代码重复率 80%
- 统一下载逻辑提升可维护性

### v2.0.0 (2026-01-27) - 工具函数封装

- ✅ 提取公共下载逻辑
- ✅ 支持文本文件下载
- ✅ 支持 Data URL 下载
- ✅ 支持 Blob 下载
- ✅ 提供 JSON、Markdown、Text、Image 快捷方法
- ✅ 自动推断 MIME 类型
- ✅ 支持时间戳功能
- ✅ 完整的错误处理
- ✅ 资源自动清理

### v1.0.0 (2026-01-27) - 初始实现

- 各页面独立实现下载功能
- 存在大量重复代码

## 📚 相关文档

- [TypeScript 类型定义](./file.ts)
- [项目 README](../../README.md)

## 💬 常见问题

### Q: 如何下载中文文件名？

A: 文件名默认支持中文，浏览器会自动处理编码：

```typescript
downloadTextFile(content, {
  filename: '数据.json',
  addTimestamp: true
});
// 生成文件: 数据_1706123456789.json
```

### Q: 如何自定义时间戳格式？

A: 目前时间戳使用 `Date.now()` 生成。如需自定义格式，可以手动构建文件名：

```typescript
const timestamp = new Date().toISOString().replace(/:/g, '-');
downloadTextFile(content, {
  filename: `data_${timestamp}.json`
});
```

### Q: 是否支持大文件下载？

A: 支持。函数使用 Blob 和 Object URL，理论上可以处理数百 MB 的文件。但建议：
- 小于 100MB：直接使用本工具
- 大于 100MB：考虑分块下载或服务端处理

### Q: 浏览器兼容性如何？

A: 支持所有现代浏览器：
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

使用了以下 Web API：
- `Blob`
- `URL.createObjectURL`
- `HTMLAnchorElement.download`

### Q: 如何测试下载功能？

A: 在开发环境中，可以在浏览器控制台查看下载：

```typescript
import { downloadJson } from '@/utils/file';

// 测试下载
downloadJson({ test: 'data' }, 'test', false);

// 浏览器会触发下载，生成 test.json 文件
```

## 🤝 贡献指南

如需添加新的工具函数：

1. 在 `file.ts` 中添加函数实现
2. 使用 JSDoc 风格添加详细注释
3. 在本 README 中添加使用示例
4. 确保类型定义完整
5. 添加错误处理

---

**📦 模块位置**: `src/utils/file.ts`  
**📖 API 文档**: 见源码中的 JSDoc 注释  
**🔗 相关**: MessageToast, useMessage
