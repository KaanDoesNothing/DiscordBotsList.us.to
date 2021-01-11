<template lang="pug">
    div
        Navbar
        router-view
</template>

<script>
    import Vue from "vue";
    import Axios from "axios";

    let Navbar = () => import("./components/navbar.vue");

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

            this.$router.push({path: "/"});

            if(code) {
                console.log(code);
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
        }
    });
</script>

<style lang="scss">
    .text-center {
        text-align: center !important;
    }
</style>