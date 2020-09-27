import { ServiceBroker } from "moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";

//import MathService from "./services/math.service";

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

    // Load all services from the services directory
    const r = require.context("./services/", true, /\.service.js$/);
    r.keys().forEach(fName => {
      const svc = r(fName).default;
      broker.createService(svc);
    });

    Vue.prototype.broker = broker;
    window.broker = broker;
  }
};
