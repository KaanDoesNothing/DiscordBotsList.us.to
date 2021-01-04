import Vue from "vue";
import Axios from "axios";
import vueRouter from "vue-router";
import App from "./App.vue";

Vue.use(vueRouter);

import Router from "./router";
import Store from "./store"

new Vue({ router: Router, store: Store, render: createElement => createElement(App), axios: Axios }).$mount("#app");