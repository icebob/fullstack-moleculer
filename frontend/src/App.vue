<template>
  <div id="app" v-if="ready">
    <nav class="flex items-center justify-between bg-primary p-3 shadow-md">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight"
          >Moleculer Full-stack Example</span
        >
      </div>
      <div class="flex justify-end">
        <div class="text-sm flex-grow">
          <router-link
            class="block mt-4 inline-block mt-0 text-teal-100 hover:text-white mr-4 text-lg"
            active-class="text-white border-b-2"
            to="/"
            exact
            >Home</router-link
          >
          <router-link
            class="block mt-4 inline-block mt-0 text-teal-100 hover:text-white mr-4 text-lg"
            active-class="text-white border-b-2"
            to="/products"
            exact
            >Products</router-link
          >
        </div>
      </div>
    </nav>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false
    };
  },

  async mounted() {
    await this.broker.start();
    this.ready = true;
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap");

html,
body {
  background-color: #eee;
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
