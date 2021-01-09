import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      session: window._session,
      isLoggedIn: window._isLoggedIn,
      darkmode: false
    },
    mutations: {
      setDarkMode(ctx, val) {
        let link = document.getElementById("darkmode");
        link.disabled = !val;
        ctx.darkmode = val;

        localStorage.setItem("darkmode", val);
        // if(val === true) {
        //   let head = document.getElementsByTagName("HEAD")[0];

        //   let link = document.createElement("link");
        //   link.rel = "stylesheet";
        //   link.type = "text/css";
        //   link.href = "/static/css/darkmode.css";
        //   link.id = "darkmode";

        //   head.appendChild(link);

        //   localStorage.setItem("darkmode", true);
        //   ctx.darkmode = true;
        // }else if(val === false) {
        //   let link = document.getElementById("darkmode");

        //   link.parentNode.removeChild(link);

        //   localStorage.setItem("darkmode", false);
        //   ctx.darkmode = false;
        // }
      }
    }
});

export default store;