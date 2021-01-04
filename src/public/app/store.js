import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    session: window._session,
    isLoggedIn: window._isLoggedIn
  },
  mutations: {
    // increment (state) {
    //   state.count++
    // }
  }
});

export default store;