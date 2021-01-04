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
        }
    });
</script>