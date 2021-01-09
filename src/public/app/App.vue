<template lang="pug">
    div
        Navbar
        router-view
</template>

<script>
    import Vue from "vue";
    import Navbar from "./components/navbar.vue";

    export default Vue.extend({
        components: {
            Navbar
        },
        mounted() {
            let darkModeEnabled = localStorage.getItem("darkmode");

            if(darkModeEnabled === null) darkModeEnabled = false;

            let enabled = darkModeEnabled === "true" ? true : false;

            console.log(enabled);

            this.$store.commit("setDarkMode", enabled);
        }
    });
</script>

<style lang="scss">
    .text-center {
        text-align: center !important;
    }
</style>