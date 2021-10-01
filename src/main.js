import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

// import "bootstrap/dist/css/bootstrap.css";
import "./theme/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import VeeValidate from "vee-validate";

Vue.use(VeeValidate, {
  events: "input|blur",
  aria: true,
  classes: true,
  inject: true,
  fieldsBagName: "veeFields"
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
