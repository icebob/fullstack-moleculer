import Vue from "vue";

import "./bus";

import Moleculer from "./moleculer";
Vue.use(Moleculer);

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
