<template>
  <ToolLayout
    title="天气查询"
    icon="🌤️"
    :content-padding="false"
    :content-scroll="false"
  >
    <!-- 左侧工具栏 -->
    <template #header-left>
      <span class="text-sm text-gray-600">
        💡 点击地图任意位置查询该区域的天气信息
      </span>
      <span v-if="currentCity" class="text-sm text-gray-600 ml-4">
        当前查询：<strong class="text-blue-600">{{ currentCity }}</strong>
      </span>
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton
        v-if="currentCity"
        icon="trash"
        text="清除天气"
        @click="clearWeather"
      />
    </template>

    <!-- 主内容区 -->
    <div class="h-full p-4">
      <div
        id="weather-map-container"
        class="rounded-2xl w-full h-full shadow-lg"
      ></div>
    </div>

    <!-- 天气预报面板 -->
    <div
      v-if="forecastData.length > 0"
      class="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 max-w-md z-50"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800">📅 未来4天天气预报</h3>
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="closeForecast"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="(day, index) in forecastData"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex-1">
            <div class="font-medium text-gray-800">{{ day.date }}</div>
            <div class="text-sm text-gray-600">{{ day.dayWeather }}</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-blue-600">
              {{ day.nightTemp }}~{{ day.dayTemp }}℃
            </div>
            <div class="text-xs text-gray-500">
              {{ day.dayWindDirection }} {{ day.dayWindPower }}级
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载提示 -->
    <div
      v-if="loading"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg shadow-xl z-50"
    >
      <div class="flex items-center gap-3">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
        ></div>
        <span class="text-gray-700">正在查询天气...</span>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import BaseMap from "../common/BaseMap";

// 地图实例
let baseMap: BaseMap | null = null;
let AMap: any = null;
let marker: any = null;
let infoWindow: any = null;

// 状态
const loading = ref(false);
const currentCity = ref("");
const forecastData = ref<any[]>([]);

// 初始化地图
const initMap = async () => {
  try {
    baseMap = new BaseMap({
      containerId: "weather-map-container",
      baseMapConfig: {
        zoom: 12,
        center: [116.486409, 39.921489], // 默认北京
      },
    });

    await baseMap.ready();
    AMap = baseMap.getAMap();

    // 监听地图点击事件
    baseMap.on("click", handleMapClick);
  } catch (error) {
    console.error("地图加载失败:", error);
  }
};

// 处理地图点击
const handleMapClick = async (e: any) => {
  const { lng, lat } = e.lnglat;
  loading.value = true;

  try {
    // 清除之前的标记和信息窗体
    if (marker) {
      baseMap?.remove(marker);
    }
    if (infoWindow) {
      infoWindow.close();
    }

    // 添加标记
    marker = new AMap.Marker({
      position: [lng, lat],
      map: baseMap?.getMap(),
    });

    // 逆地理编码获取城市信息
    const geocoder = new AMap.Geocoder();
    geocoder.getAddress([lng, lat], async (status: string, result: any) => {
      if (status === "complete" && result.info === "OK") {
        const addressComponent = result.regeocode.addressComponent;
        const city = addressComponent.city || addressComponent.province;
        const district = addressComponent.district;

        currentCity.value = district || city;

        // 查询天气
        await queryWeather(district || city, [lng, lat]);
      } else {
        console.error("逆地理编码失败");
        loading.value = false;
      }
    });
  } catch (error) {
    console.error("查询失败:", error);
    loading.value = false;
  }
};

// 查询天气
const queryWeather = async (city: string, position: number[]) => {
  const weather = new AMap.Weather();

  // 查询实时天气
  weather.getLive(city, (err: any, data: any) => {
    loading.value = false;

    if (err) {
      console.error("天气查询失败:", err);
      return;
    }

    // 构建信息窗体内容
    const content = `
      <div style="padding: 16px; min-width: 280px;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">
            🌤️ ${data.city} 实时天气
          </h3>
        </div>
        <div style="line-height: 2;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 36px; font-weight: bold; color: #3b82f6;">${data.temperature}℃</span>
            <span style="margin-left: 12px; font-size: 18px; color: #6b7280;">${data.weather}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px; font-size: 14px; color: #4b5563;">
            <div>🧭 风向：${data.windDirection}</div>
            <div>💨 风力：${data.windPower}级</div>
            <div>💧 湿度：${data.humidity}%</div>
            <div>📅 ${data.reportTime}</div>
          </div>
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
          点击其他位置查询天气
        </div>
      </div>
    `;

    // 创建信息窗体
    infoWindow = new AMap.InfoWindow({
      content,
      offset: new AMap.Pixel(0, -30),
    });

    infoWindow.open(baseMap?.getMap(), position);
  });

  // 查询天气预报
  weather.getForecast(city, (err: any, data: any) => {
    if (err) {
      console.error("天气预报查询失败:", err);
      return;
    }

    if (data.forecasts && data.forecasts.length > 0) {
      forecastData.value = data.forecasts;
    }
  });
};

// 清除天气信息
const clearWeather = () => {
  if (marker) {
    baseMap?.remove(marker);
    marker = null;
  }
  if (infoWindow) {
    infoWindow.close();
    infoWindow = null;
  }
  currentCity.value = "";
  forecastData.value = [];
};

// 关闭预报面板
const closeForecast = () => {
  forecastData.value = [];
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
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
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
