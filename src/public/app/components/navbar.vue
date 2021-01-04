<template lang="pug">
    nav(class="navbar has-shadow", role="navigation")
        div(class="navbar-brand")
            router-link(class="navbar-item", to="/") Discord Bots

            a(class="navbar-burger", role="button", aria-expanded="false", data-target="navbarContent" id="openNavbar")
                span(aria-hidden="true")
                span(aria-hidden="true")
                span(aria-hidden="true")

        div(class="navbar-menu", id="navbarContent")
            div(class="navbar-end")
                template(v-if="session")
                    //- if session.permissions.moderator
                    //-     a(class="navbar-item", href=`/admin`) Admin

                    router-link(class="navbar-item", :to="'/add'") Add Bot
                    router-link(class="navbar-item", :to="'/profile/' + session.id") Add Bot
                    //- a(class="navbar-item", :href="'/profile/' + session.id") {{session._username}}

                template(v-if="!session")
                    a(class="navbar-item", href="/auth/login") Login
</template>

<script>
    import Vue from "vue";
    import {mapState} from "vuex";

    export default Vue.extend({
        name: "Navbar",
        computed: mapState(["session"])
    });
</script>