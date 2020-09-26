import "regenerator-runtime/runtime";

import { ServiceBroker } from "moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";

const broker = (window.broker = new ServiceBroker({
  nodeID: "frontend",
  transporter: new WebsocketClientTransporter(),
  logger: {
    type: "Console",
    options: {
      colors: false
    }
  },
  logLevel: "info",
  metrics: {
    enabled: false,
    reporter: "Console"
  },
  tracing: {
    enabled: true,
    exporter: "Console"
  }
}));

broker.createService({
  name: "math",
  actions: {
    add(ctx) {
      return Number(ctx.params.a) + Number(ctx.params.b);
    }
  }
});

broker
  .start()
  // Call service
  .then(() => broker.call("math.add", { a: 5, b: 3 }))
  .then(res => console.log("Call local service: 5 + 3 =", res))
  .catch(err => console.error(`Error occured! ${err.message}`))
  .then(() => broker.call("products.list"))
  .then(res => console.log("Call backend service: posts.list", res))
  .catch(err => console.error(`Error occured! ${err.message}`));

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
