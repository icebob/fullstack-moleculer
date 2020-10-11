import IO from "socket.io-client";

import { Transporters } from "@geut/moleculer-browser";
const BaseTransporter = Transporters.Base;

class WebsocketServerTransporter extends BaseTransporter {
  constructor(opts) {
    super(opts);

    if (!this.opts) {
      this.opts = {
        port: 3300
      };
    }

    this.socket = null;
  }

  async connect() {
    const loc = window.location;
    const addr = `${loc.protocol.replace("http", "ws")}//${loc.hostname}:${
      this.opts.port
    }/`;
    this.logger.info(`Connecting to '${addr}'...`);
    this.socket = IO(addr);

    // Add a connect listener
    this.socket.on("connect", () => {
      this.logger.info("Websocket client connected.");
      this.onConnected();
    });

    this.socket.on("disconnect", () => {
      this.logger.info("Websocket client disconnected");
    });

    this.socket.on("reconnect", () => {
      this.logger.info("Websocket client reconnected.");
    });
  }

  async disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  arrayBufferToString(buffer) {
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if (/[\u0080-\uffff]/.test(str)) {
      throw new Error(
        "this string seems to contain (still encoded) multibytes"
      );
    }
    return str;
  }

  /**
   * Subscribe to a command
   *
   * @param {String} cmd
   * @param {String} nodeID
   *
   * @memberof FakeTransporter
   */
  async subscribe(cmd, nodeID) {
    const t = this.getTopicName(cmd, nodeID);

    if (!this.socket.hasListeners(t)) {
      this.socket.on(t, data => {
        const msg = this.arrayBufferToString(data);
        this.receive(cmd, msg);
      });
    }
  }

  /**
   * Send data buffer.
   *
   * @param {String} topic
   * @param {Buffer} data
   * @param {Object} meta
   *
   * @returns {Promise}
   */
  async send(topic, data) {
    this.socket.emit(topic, data);
  }
}

export default WebsocketServerTransporter;
