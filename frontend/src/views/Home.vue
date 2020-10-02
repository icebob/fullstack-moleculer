<template>
  <div class="home">
    <img alt="Logo" class="w-40 m-auto" src="https://moleculer.services/logo.png" />
    <div class="max-w-screen-sm m-auto">
      <h1 class="text-3xl font-semibold">Moleculer in the browser!</h1>
      <p>
        Really, a full-featured Moleculer node is running in your browser. Press
        F12 and see the console messages. Cool, right? Try to write into console
      </p>
      <code>await broker.call("math.add", { a: 10, b: 15 })</code>

      <h3 class="mt-6 text-xl font-semibold">Calling a local service</h3>
      <p>Call the <code>math.add</code> action on the frontend (in this browser).</p>
      <button class="my-3" @click="callMathAdd">Call "math.add" with 5 + 3</button>
      <p v-if="response1 || error1">
        <b>Response:</b>
        <pre v-if="response1" class="text-green-600">{{ response1 }}</pre>
        <pre v-if="error1" class="text-red-600">{{ error1 }}</pre>
      </p>

      <h3 class="text-xl font-semibold">Calling a backend service</h3>
      <p>Call the <code>greeter.hello</code> action on the backend.</p>
      <button class="my-3" @click="callGreeterHello">Call "greeter.hello"</button>
      <p v-if="response2 || error2">
        <b>Response:</b>
        <pre v-if="response2" class="text-green-600">{{ response2 }}</pre>
        <pre v-if="error2" class="text-red-600">{{ error2 }}</pre>
      </p>

      <h3 class="text-xl font-semibold">Receiving event from backend</h3>
      <p>Listening the <code>greeter.counter.changed</code> event which generates on the backend <code>greeter</code> service.</p>
      <p>
        <b>Response:</b>
        <br/>
        <code class="text-green-600">{{ response3 }}</code>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      response1: null,
      response2: null,
      response3: null,
      error1: null,
      error2: null,
    }
  },

  /**
   * Subscribe to Moleculer events
   */
  events: {
    "greeter.counter.changed"(ctx) {
      this.response3 = ctx.params;
    }
  },

  methods: {
    async callMathAdd() {
      try {
        this.response1 = await this.broker.call("math.add", { a: 5, b: 3 });
      } catch(err) {
        this.error1 = err;
      }
    },

    async callGreeterHello() {
      this.response2 = await this.broker.call("greeter.hello");
    }
  }
};
</script>
