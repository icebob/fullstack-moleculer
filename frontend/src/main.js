import Vue from "vue";

import "./bus";

// Load Moleculer-browser
import Moleculer from "./moleculer";
Vue.use(Moleculer);

// Create Vue app
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
