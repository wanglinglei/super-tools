import transformerDirectives from "@unocss/transformer-directives";
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    fontFamily: {
      BebasNeue: ["BebasNeue", "sans-serif"],
      BiaoTiHei: ["YouSheBiaoTiHei", "sans-serif"],
      AlibabaPuHuiTi: ["AlibabaPuHuiTi", "sans-serif"],
    },
  },
  shortcuts: [
    {
      // ===== 布局相关 =====
      "flex-center": "flex justify-center items-center",
      "flex-col-center": "flex justify-center items-center flex-col",
      "flex-between": "flex justify-between items-center",
      "flex-start": "flex justify-start items-center",

      // ===== 卡片容器 =====
      card: "bg-white rounded-lg shadow-sm border border-gray-200",
      "card-p": "bg-white rounded-lg shadow-sm p-4 border border-gray-200",

      // ===== 输入框 =====
      "input-base":
        "w-full px-3 py-2 bg-white text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "input-mono":
        "w-full px-3 py-2 bg-white text-sm text-gray-800 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "textarea-base":
        "w-full px-3 py-2 bg-white text-sm text-gray-800 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",

      // ===== 按钮 =====
      btn: "flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
      "btn-primary":
        "flex items-center px-3 py-2 bg-blue-500 border border-blue-500 rounded-md text-sm text-white font-medium cursor-pointer transition-all hover:bg-blue-600 active:bg-blue-700",
      "btn-danger":
        "flex items-center px-3 py-2 bg-red-500 border border-red-500 rounded-md text-sm text-white font-medium cursor-pointer transition-all hover:bg-red-600 active:bg-red-700",
      "btn-icon":
        "flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md text-gray-600 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 active:bg-gray-100",
      "btn-sm":
        "px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer transition-colors",

      // ===== 文字样式 =====
      "text-title": "text-base font-bold text-gray-800",
      "text-subtitle": "text-sm font-bold text-gray-800",
      "text-label": "text-xs font-medium text-gray-700",
      "text-hint": "text-xs text-gray-500",

      // ===== 主题色 =====
      "theme-purple": "text-[#9333ea]",
      "theme-green": "text-[#00C800]",
      "theme-pale-green": "text-[#61D6D1]",
      "theme-blue": "text-[#1296DB]",
      "theme-orange": "text-[#F1A55B]",
      "theme-red": "text-[#FF0000]",
      "theme-gray": "text-[#E0F0FF]/80",

      // ===== 状态提示卡片 =====
      "status-success":
        "bg-green-50 rounded-lg p-4 border border-green-200 text-green-800",
      "status-error":
        "bg-red-50 rounded-lg p-4 border border-red-200 text-red-800",
      "status-warning":
        "bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-yellow-800",
      "status-info":
        "bg-blue-50 rounded-lg p-4 border border-blue-200 text-blue-800",

      // ===== 渐变背景卡片 =====
      "gradient-blue": "bg-gradient-to-br from-blue-50 to-blue-100",
      "gradient-purple": "bg-gradient-to-br from-purple-50 to-purple-100",
      "gradient-green": "bg-gradient-to-br from-green-50 to-green-100",
    },
  ],
  safelist: [
    "bg-blue-100",
    "text-blue-700",
    "bg-emerald-100",
    "text-emerald-700",
    "bg-pink-100",
    "text-pink-700",
    "bg-indigo-100",
    "text-indigo-700",
    "bg-cyan-100",
    "text-cyan-700",
    "bg-violet-100",
    "text-violet-700",
    "bg-sky-100",
    "text-sky-700",
    "bg-teal-100",
    "text-teal-700",
    "bg-purple-100",
    "text-purple-700",
    "bg-green-100",
    "text-green-700",
  ],
});
