<template lang="pug">
    div
        Navbar

        router-view(v-if="!isLoading")

        div(class="align-center" v-if="isLoading")
            div(class="lds-dual-ring")
</template>

<script>
    import {mapState} from "vuex";
    import Vue from "vue";
    import Axios from "axios";

    import Navbar from "./components/navbar.vue";

    export default Vue.extend({
        components: {
            Navbar
        },
        mounted() {
            let hasToFetch = true;

            let darkModeEnabled = localStorage.getItem("darkmode");

            if(darkModeEnabled === null) darkModeEnabled = false;

            const enabled = darkModeEnabled === "true" ? true : false;

            this.$store.commit("setDarkMode", enabled);

            let query = new URLSearchParams(window.location.search)
            let code = query.get("code");

            if(code) {
                this.$router.push({path: "/"});

                Axios.post("/auth/callback", {code}).then(res => {
                    if(res.data.msg) {
                        hasToFetch = false;
                        this.$store.dispatch("fetchSession");
                    }
                });
            }

            if(hasToFetch) {
                this.$store.dispatch("fetchSession");
            }

            let loader = document.querySelector("#loading-spinner");

            if(loader.style.display !== "none") {
                loader.style.display = "none";
            }
        },
        computed: mapState(["isLoading"])
    });
</script>

<style lang="scss">
    .text-center {
        text-align: center !important;
    }
</style>