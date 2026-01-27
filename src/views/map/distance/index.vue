<template>
  <div class="w-full h-screen">
    <!-- 顶部控制面板 -->
    <div class="bg-white px-5 py-4 shadow-md z-100">
      <div class="flex gap-10 flex-wrap">
        <div class="flex items-center gap-3">
          <span class="font-600 text-gray-700 min-w-10">起点</span>
          <div class="flex gap-2">
            <input
              v-model="startPoint.lng"
              type="number"
              step="0.000001"
              placeholder="经度"
              class="coord-input"
              @change="onInputChange"
            />
            <input
              v-model="startPoint.lat"
              type="number"
              step="0.000001"
              placeholder="纬度"
              class="coord-input"
              @change="onInputChange"
            />
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer text-sm transition-all hover:bg-red-500 hover:border-red-500 hover:text-white"
            @click="clearPoint('start')"
          >
            清除
          </button>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-600 text-gray-700 min-w-10">终点</span>
          <div class="flex gap-2">
            <input
              v-model="endPoint.lng"
              type="number"
              step="0.000001"
              placeholder="经度"
              class="coord-input"
              @change="onInputChange"
            />
            <input
              v-model="endPoint.lat"
              type="number"
              step="0.000001"
              placeholder="纬度"
              class="coord-input"
              @change="onInputChange"
            />
          </div>
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer text-sm transition-all hover:bg-red-500 hover:border-red-500 hover:text-white"
            @click="clearPoint('end')"
          >
            清除
          </button>
        </div>
      </div>
      <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
        <span class="text-gray-400 text-13px">提示：点击地图选择坐标，第一次点击设置起点，第二次点击设置终点</span>
        <span v-if="distance" class="text-15px text-gray-700">
          距离：<strong class="text-blue-600 text-lg">{{ formatDistance(distance) }}</strong>
        </span>
      </div>
    </div>

    <!-- 地图容器 -->
     <div class="w-full p-x-6 mt-6 rounded-2xl">
      <div id="map-container" ref="mapContainer" class="rounded-2xl w-full min-h-[400px]"></div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseMap from '../common/BaseMap';

// 坐标点类型
interface Point {
  lng: number | null;
  lat: number | null;
}

// 起点和终点
const startPoint = ref<Point>({ lng: null, lat: null });
const endPoint = ref<Point>({ lng: null, lat: null });
const distance = ref<number>(0);
const clickCount = ref(0);

// 地图实例
let baseMap: BaseMap | null = null;
let AMap: any = null;
let startMarker: any = null;
let endMarker: any = null;
let polyline: any = null;

// 初始化地图
const initMap = async () => {
  try {
    baseMap = new BaseMap({
      containerId: 'map-container',
    });

    // 等待地图初始化完成
    await baseMap.ready();

    // 获取 AMap 构造器
    AMap = baseMap.getAMap();

    // 点击地图事件
    baseMap.on('click', handleMapClick);
  } catch (error) {
    console.error('地图加载失败:', error);
  }
};

// 处理地图点击
const handleMapClick = (e: any) => {
  const { lng, lat } = e.lnglat;

  if (clickCount.value === 0) {
    // 第一次点击，设置起点
    startPoint.value = { lng: Number(lng.toFixed(6)), lat: Number(lat.toFixed(6)) };
    clickCount.value = 1;
  } else {
    // 第二次点击，设置终点
    endPoint.value = { lng: Number(lng.toFixed(6)), lat: Number(lat.toFixed(6)) };
    clickCount.value = 0; // 重置，下次点击重新设置起点
  }

  updateMarkers();
  calculateDistance();
};

// 更新标记点
const updateMarkers = () => {
  if (!baseMap) return;

  const map = baseMap.getMap();

  // 清除旧标记
  if (startMarker) {
    baseMap.remove(startMarker);
    startMarker = null;
  }
  if (endMarker) {
    baseMap.remove(endMarker);
    endMarker = null;
  }
  if (polyline) {
    baseMap.remove(polyline);
    polyline = null;
  }

  // 添加起点标记
  if (startPoint.value.lng && startPoint.value.lat) {
    startMarker = new AMap.Marker({
      position: [startPoint.value.lng, startPoint.value.lat],
      title: '起点',
      label: {
        content: '起点',
        direction: 'top',
      },
    });
    startMarker.setMap(map);
  }

  // 添加终点标记
  if (endPoint.value.lng && endPoint.value.lat) {
    endMarker = new AMap.Marker({
      position: [endPoint.value.lng, endPoint.value.lat],
      title: '终点',
      label: {
        content: '终点',
        direction: 'top',
      },
    });
    endMarker.setMap(map);
  }

  // 如果起点终点都存在，画连线
  if (
    startPoint.value.lng &&
    startPoint.value.lat &&
    endPoint.value.lng &&
    endPoint.value.lat
  ) {
    polyline = new AMap.Polyline({
      path: [
        [startPoint.value.lng, startPoint.value.lat],
        [endPoint.value.lng, endPoint.value.lat],
      ],
      strokeColor: '#3366FF',
      strokeWeight: 3,
      strokeOpacity: 0.8,
      strokeStyle: 'dashed',
    });
    polyline.setMap(map);

    // 自动调整视野
    baseMap.setFitView([startMarker, endMarker], false, [50, 50, 50, 50]);
  }
};

// 计算距离
const calculateDistance = () => {
  if (
    startPoint.value.lng &&
    startPoint.value.lat &&
    endPoint.value.lng &&
    endPoint.value.lat
  ) {
    const p1 = new AMap.LngLat(startPoint.value.lng, startPoint.value.lat);
    const p2 = new AMap.LngLat(endPoint.value.lng, endPoint.value.lat);
    distance.value = p1.distance(p2);
  } else {
    distance.value = 0;
  }
};

// 格式化距离显示
const formatDistance = (dist: number): string => {
  if (dist >= 1000) {
    return (dist / 1000).toFixed(2) + ' 公里';
  }
  return dist.toFixed(2) + ' 米';
};

// 输入框变化时更新地图
const onInputChange = () => {
  updateMarkers();
  calculateDistance();
};

// 清除坐标点
const clearPoint = (type: 'start' | 'end') => {
  if (type === 'start') {
    startPoint.value = { lng: null, lat: null };
    clickCount.value = 0;
  } else {
    endPoint.value = { lng: null, lat: null };
  }
  updateMarkers();
  calculateDistance();
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (baseMap) {
    baseMap.destroy();
    baseMap = null;
  }
});
</script>

<style scoped>
.coord-input {
  @apply w-35 px-3 py-2 border border-gray-300 rounded-md text-sm transition-all;
  @apply placeholder-gray-400;
  @apply focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20;
}
</style>
