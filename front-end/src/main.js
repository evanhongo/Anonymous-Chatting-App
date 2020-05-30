import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import socketio from "./socketio";
import "./css/mystyle.scss";

createApp(App)
  .use(store)
  .use(socketio)
  .mount("#app");
