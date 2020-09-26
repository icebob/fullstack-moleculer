<template>
  <div class="home">
    <img alt="Logo" src="https://moleculer.services/logo.png" height="150px" />
    <div class="hello">
      <h1>Moleculer in the browser!</h1>
      <p>
        Really, a full-featured Moleculer node is running in your browser. Press
        F12 and see the console messages. Cool, right?
      </p>

      <h3>Calling a local service</h3>
      <p>Call the <code>math.add</code> action on the frontend (in this browser).</p>
      <button @click="callMathAdd">Call "math.add" with 5 + 3</button>
      <p><b>Response:</b>
        <pre>{{ response1 }}</pre>
      </p>

      <h3>Calling a backend service</h3>
      <p>Call the <code>greeter.hello</code> action on the backend.</p>
      <button @click="callGreeterHello">Call "greeter.hello"</button>
      <p><b>Response:</b>
        <pre>{{ response2 }}</pre>
      </p>

      <h3>How is it work?</h3>
      <p>
        Thanks for the <code>moleculer-browser</code> package, Moleculer is able to run in browser, too. It can communicate with the backend-side Moleculer node via Websocket transporter.
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
      response2: null
    }
  },

  methods: {
    async callMathAdd() {
      this.response1 = await this.broker.call("math.add", { a: 5, b: 3 });
    },

    async callGreeterHello() {
      this.response2 = await this.broker.call("greeter.hello");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home {
  max-width: 600px;
  margin: auto;

}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
