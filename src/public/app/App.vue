<template lang="pug">
    div
        Navbar
        router-view
</template>

<script>
    import Vue from "vue";
    let Navbar = () => import("./components/navbar.vue");

    export default Vue.extend({
        components: {
            Navbar
        },
        mounted() {
            let darkModeEnabled = localStorage.getItem("darkmode");

            if(darkModeEnabled === null) darkModeEnabled = false;

            const enabled = darkModeEnabled === "true" ? true : false;

            this.$store.commit("setDarkMode", enabled);
        }
    });
</script>

<style lang="scss">
    .text-center {
        text-align: center !important;
    }
</style>