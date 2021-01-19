import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      session: undefined,
      isLoggedIn: false,
      darkmode: false,
      isLoading: false
    },
    mutations: {
      setSession(ctx, data) {
        ctx.session = data;
        ctx.isLoggedIn = true;
      },
      setDarkMode(ctx, val) {
        let link = document.getElementById("darkmode");
        link.disabled = !val;
        ctx.darkmode = val;

        localStorage.setItem("darkmode", val);
      },
      setLoading(ctx, val) {
        this.isLoading = val;
      }
    },
    actions: {
      fetchSession(ctx) {
        Axios.get("/auth/session").then(res => {
          if(res.data.session) {
            ctx.commit("setSession", res.data.session);
          }
        });
      }
    }
});

export default store;