import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/tools/",
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    UnoCSS(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/auto-import.d.ts",
    }),
  ],
  server: {
    headers: {
      // 允许子应用跨域
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    proxy: {
      "http://localhost:3000": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  // ========== 构建优化配置 ==========
  build: {
    // 输出目录
    outDir: "dist",
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否生成 source map
    sourcemap: false,
    // 启用/禁用 brotli 压缩大小报告
    reportCompressedSize: false,
    // chunk 大小警告的限制（单位 kB）
    chunkSizeWarningLimit: 1000,
  },

  // ========== 依赖预构建优化 ==========
  optimizeDeps: {
    // 预构建的依赖
    include: [
      "vue",
      "vue-router",
      "pinia",
      "ace-builds",
      "marked",
      "xlsx",
      "qrcode",
      "jsqr",
    ],
  },

  // ========== 预览配置 ==========
  preview: {
    port: 4173,
    strictPort: true,
  },
});
