import Vue from "vue";
import Axios from "axios";
import vueRouter from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";

library.add(faThumbsUp);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(vueRouter);

import Router from "./router";
import Store from "./store"

new Vue({ router: Router, store: Store, render: createElement => createElement(App), axios: Axios }).$mount("#app");