import Vue from "vue";

const globalBus = new Vue();
Vue.prototype.$bus = globalBus;

export default globalBus;
