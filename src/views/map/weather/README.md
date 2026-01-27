# 天气查询工具

基于高德地图的天气查询工具，点击地图任意位置查询该区域的实时天气和未来4天预报。

## 功能特性

### 实时天气
- ✅ 当前温度
- ✅ 天气状况（晴/多云/雨等）
- ✅ 风向和风力
- ✅ 空气湿度
- ✅ 发布时间

### 天气预报
- ✅ 未来4天天气预报
- ✅ 白天/夜间温度
- ✅ 天气情况
- ✅ 风向和风力

## 使用说明

### 查询天气
1. 打开天气查询页面
2. 点击地图上的任意位置
3. 系统自动识别该位置所属城市/区域
4. 在地图上显示实时天气信息窗体
5. 右下角显示未来4天天气预报面板

### 切换位置
- 点击地图其他位置可以查询不同区域的天气
- 之前的标记会自动清除
- 信息窗体会更新为新位置的天气

### 清除天气
- 点击顶部"清除天气"按钮
- 移除地图标记和信息窗体
- 关闭天气预报面板

## 技术实现

### 地图组件
使用封装的 `BaseMap.ts`：
```typescript
import BaseMap from '../common/BaseMap';

const baseMap = new BaseMap({
  containerId: 'weather-map-container',
  baseMapConfig: {
    zoom: 12,
    center: [116.486409, 39.921489],
  },
});
```

### 高德地图插件

#### Geocoder（逆地理编码）
将经纬度转换为地址信息：
```typescript
const geocoder = new AMap.Geocoder();
geocoder.getAddress([lng, lat], (status, result) => {
  const city = result.regeocode.addressComponent.city;
  const district = result.regeocode.addressComponent.district;
});
```

#### Weather（天气查询）
查询实时天气和预报：
```typescript
const weather = new AMap.Weather();

// 实时天气
weather.getLive(city, (err, data) => {
  // data.temperature, data.weather, data.windDirection...
});

// 天气预报
weather.getForecast(city, (err, data) => {
  // data.forecasts[] 包含未来4天的天气
});
```

### 信息窗体
使用 `AMap.InfoWindow` 显示天气信息：
```typescript
const infoWindow = new AMap.InfoWindow({
  content: '天气信息 HTML',
  offset: new AMap.Pixel(0, -30),
});
infoWindow.open(map, position);
```

## UI 设计

### 顶部提示栏
- 使用说明
- 当前查询城市显示
- 清除天气按钮

### 地图主体
- 全屏地图展示
- 圆角阴影设计
- 点击交互

### 信息窗体
- 大号温度显示
- 天气图标和描述
- 网格布局展示详细信息
- 清新的蓝白配色

### 天气预报面板
- 固定在右下角
- 悬浮卡片设计
- 列表展示4天预报
- 可关闭

### 加载状态
- 居中显示
- 旋转加载动画
- 半透明背景

## 样式特点

1. **响应式设计** - 适配不同屏幕尺寸
2. **现代化 UI** - 圆角、阴影、渐变
3. **友好交互** - 悬停效果、过渡动画
4. **清晰层级** - z-index 管理
5. **自定义滚动条** - 美化预报面板滚动

## 数据来源

- **地图服务**: 高德地图 API 2.0
- **天气数据**: 高德地图天气服务
- **更新频率**: 实时数据
- **覆盖范围**: 全国城市和区县

## 注意事项

1. 需要配置高德地图 API Key
2. 天气服务依赖网络连接
3. 部分偏远地区可能无天气数据
4. 信息窗体内容为 HTML 格式
5. BaseMap 已加载 Weather 和 Geocoder 插件

## 未来优化

- [ ] 添加天气图标展示
- [ ] 支持搜索城市查询
- [ ] 添加空气质量指数
- [ ] 支持多日期选择
- [ ] 添加天气预警信息
- [ ] 支持分享天气信息
- [ ] 添加历史天气查询
