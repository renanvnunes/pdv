import { createApp } from "vue";
import App from "./App.vue";

import Toast, { PluginOptions, POSITION } from "vue-toastification";

import "./assets/style.css";
import "./assets/bootstrap.css";
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
    position: POSITION.TOP_CENTER
    // You can set your default options here
};


createApp(App).use(Toast, options).mount("#app");
