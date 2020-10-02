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

    // EVENT LINKING
    const eventListeners = {};

    const addListeners = async function() {
      let changed = false;
      if (this.$options.events) {
        const conf = this.$options.events;
        Object.keys(conf).forEach((key) => {
          let func = conf[key].bind(this);
          if (!eventListeners[key])
            eventListeners[key] = [];

          console.log(`Add event listener for '${key}'`);
          eventListeners[key].push(conf[key].bind(this));
          conf[key].__binded = func;
          changed = true;
        });
      }
      if (changed) await reloadService();
    }

    const removeListeners = async function() {
      let changed = false;
      if (this.$options.events) {
        const conf = this.$options.events;
        Object.keys(conf).forEach((key) => {
          if (eventListeners[key]) {
            console.log(`Remove event listener for '${key}'`);
            eventListeners[key] = eventListeners[key].filter(fn => fn != conf[key].__binded);
            changed = true;
          }
        });
      }
      if (changed) await reloadService();
    }

    const reloadService = async () => {
      const svc = broker.getLocalService("$event-linker");
      if (svc) {
        await broker.destroyService(svc);
      }

      const schema = {
        name: "$event-linker",
        events: {}
      };

      Object.keys(eventListeners).forEach(key => {
        schema.events[key] = {
          context: true,
          handler(ctx) {
            eventListeners[key].forEach(fn => {
              fn.call(null, ctx);
            });
          }
        }

      })

      broker.createService(schema);
    }

    Vue.mixin({
			created: addListeners,
			beforeDestroy: removeListeners
		});
  }
};
