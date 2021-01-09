import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    session: window._session,
    isLoggedIn: window._isLoggedIn
  }
});

export default store;