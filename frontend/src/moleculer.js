import { ServiceBroker } from "moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";

import MathService from "./services/math.service";

export default {
  install(Vue) {
    const broker = new ServiceBroker({
      nodeID: "frontend",
      transporter: new WebsocketClientTransporter(),
      logger: "Console",
      logLevel: "info",
      metrics: {
        enabled: false,
        reporter: "Console"
      },
      tracing: {
        enabled: true,
        exporter: "Console"
      }
    });

    broker.createService(MathService);

    Vue.prototype.broker = broker;
  }
};
/*
broker
  .start()
  // Call service
  .then(() => broker.call("math.add", { a: 5, b: 3 }))
  .then(res => console.log("Call local service: 5 + 3 =", res))
  .catch(err => console.error(`Error occured! ${err.message}`))
  .then(() => broker.call("products.list"))
  .then(res => console.log("Call backend service: posts.list", res))
  .catch(err => console.error(`Error occured! ${err.message}`));
*/
