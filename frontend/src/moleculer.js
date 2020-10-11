import { ServiceBroker } from "@geut/moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";
import uid from "uid";

/**
 * Create ServiceBroker instance.
 */
function createBroker() {
  const broker = new ServiceBroker({
    nodeID: "frontend-" + uid(8),
    transporter: new WebsocketClientTransporter(),
    metrics: {
      enabled: false,
      reporter: "Console",
    },
    tracing: {
      enabled: true,
      exporter: "Console",
    },
  });

  return broker;
}

/**
 * Load all services from the "services" folder.
 * @param {ServiceBroker} broker
 */
function loadAllServices(broker) {
  const r = require.context("./services/", true, /\.service.js$/);
  r.keys().forEach((fName) => {
    const svc = r(fName).default;
    broker.createService(svc);
  });
}

/**
 * Create an event linker service which listens the Moleculer events
 * and calls the handlers in Vue components.
 *
 * @param {ServiceBroker} broker
 */
function createEventLinkerService(broker) {
  const eventListeners = {};
  let service;

  const addListeners = async function () {
    let changed = false;
    if (this.$options.events) {
      const conf = this.$options.events;
      Object.keys(conf).forEach((key) => {
        let func = conf[key].bind(this);
        if (!eventListeners[key]) eventListeners[key] = [];

        broker.logger.debug(`Add event listener for '${key}'`);
        eventListeners[key].push(func);
        conf[key].__binded = func;
        changed = true;
      });
    }
    if (changed) await reloadService();
  };

  const removeListeners = async function () {
    let changed = false;
    if (this.$options.events) {
      const conf = this.$options.events;
      Object.keys(conf).forEach((key) => {
        if (eventListeners[key]) {
          broker.logger.debug(`Remove event listener for '${key}'`);
          eventListeners[key] = eventListeners[key].filter(
            (fn) => fn != conf[key].__binded
          );
          changed = true;
        }
      });
    }
    if (changed) await reloadService();
  };

  const reloadService = async () => {
    const svc = broker.getLocalService("$event-linker");
    if (svc) {
      await broker.destroyService(svc);
    }

    const schema = {
      name: "$event-linker",
      events: {},
    };

    Object.entries(eventListeners).forEach(([key, fnList]) => {
      schema.events[key] = {
        context: true,
        handler(ctx) {
          fnList.forEach((fn) => fn.call(null, ctx));
        },
      };
    });

    service = broker.createService(schema);
  };

  return {
    addListeners,
    removeListeners,
    reloadService,
    service,
  };
}

export default {
  install(Vue) {
    // Create broker
    const broker = createBroker();

    Vue.prototype.broker = broker;
    window.broker = broker;

    window.addEventListener("unload", () => broker.stop());

    // Load all services from the services directory
    loadAllServices(broker);

    // --- EVENT LINKER SERVICE ---
    const linker = createEventLinkerService(broker);

    Vue.mixin({
      created: linker.addListeners,
      beforeDestroy: linker.removeListeners,
    });
  },
};
