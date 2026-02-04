import { createApp } from "vue";
import "virtual:uno.css";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { setupErrorHandler } from "./utils/errorHandler";

const app = createApp(App);

// 设置全局错误处理
setupErrorHandler(app);

// 注册插件
app.use(router);

// 挂载应用
app.mount("#app");
