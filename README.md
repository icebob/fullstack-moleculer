# Fullstack Moleculer
This is a Proof-of-Concept project where there is Moleculer in your browser and on the server.

## Why?
Why not? There are some use-case where it can be useful because
- you don't have to create REST API/GraphQL endpoint in the backend for every entities
- you don't have to create REST/GraphQL queries in the frontend for every entities
- you can use the built-in transporter to send events to the browser from backend


**It can be optimal for:**
- internal web apps with limited users,
- Electron-based apps using Moleculer to communicate between renderer process and main process
- or just playing with something new & interesting.

**It's <ins>not</ins> optimal for:**
- web apps with hundreds users (Moleculer nodes always have to update the Service registries)
- production applications (it's just a concept yet)

## How is it work?
Thanks for the [geut/moleculer-browser](https://github.com/geut/moleculer-browser) library, Moleculer is able to run in browser. You can use almost every features from Moleculer except some server-side specific modules like File logger, Redis cacher, NATS transporter...etc. 

I have created a Websocket server transporter and a Websocket client transporter. You should set the WebsocketServer transporter in the backend Moleculer node and set the WebsocketClient transporter in the browser Moleculer node using with the same port number.

It means you can connect to the backend Moleculer node from multiple browser nodes but you can't use multiple nodes on the backend.

## Configuration

### Server-side Moleculer configuration

```js
const WebsocketServerTransporter = require("./WebsocketServerTransporter");

module.exports = {
    nodeID: "backend",

    transporter: new WebsocketServerTransporter({
        port: 3300
    }),
};
```

### Browser-side Moleculer configuration

```js
import { ServiceBroker } from "moleculer-browser";
import WebsocketClientTransporter from "./WebsocketClientTransporter";

const broker = new ServiceBroker({
      nodeID: "frontend",
      transporter: new WebsocketClientTransporter({
          port: 3300
      }),
      /*
      metrics: {
        enabled: true,
        reporter: "Console"
      },*/
      /*
      tracing: {
        enabled: true,
        exporter: "Console"
      }
      */
    });
};

await this.broker.start();
```

#### Load service on browser-side node

```js
import GreeterService from "./services/greeter.service.js"
broker.createService(GreeterService);
```

#### Load all services with Webpack
```js
// Load all services from the services directory
const r = require.context("./services/", true, /\.service.js$/);
r.keys().forEach(fName => {
    const svc = r(fName).default;
    broker.createService(svc);
});
```



# License
fullstack-moleculer is available under the [MIT license](https://tldrlegal.com/license/mit-license).

# Contact

Copyright (C) 2020 Icebob

[![@icebob](https://img.shields.io/badge/github-icebob-green.svg)](https://github.com/icebob) [![@icebob](https://img.shields.io/badge/twitter-Icebobcsi-blue.svg)](https://twitter.com/Icebobcsi)