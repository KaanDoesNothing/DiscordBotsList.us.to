<template lang="pug">
    nav(class="navbar has-shadow", role="navigation")
        div(class="navbar-brand")
            router-link(class="navbar-item", to="/") Discord Bots

            a(class="navbar-burger", @click="isNavbarOpen = !isNavbarOpen")
                span(aria-hidden="true")
                span(aria-hidden="true")
                span(aria-hidden="true")

        div(class="navbar-menu", :class="{'is-active': isNavbarOpen}" id="navbarContent")
            div(class="navbar-end")
                a(class="navbar-item", @click="switchTheme") {{darkmode ? "Light" : "Dark"}}
                
                template(v-if="isLoggedIn")
                    //- if session.permissions.moderator
                    //-     a(class="navbar-item", href=`/admin`) Admin

                    router-link(class="navbar-item", :to="'/add'") Add Bot
                    router-link(class="navbar-item", :to="'/profile/' + session.id") {{session._username}}

                template(v-if="!isLoggedIn")
                    a(class="navbar-item", href="/auth/login") Login
</template>

<script>
    import Vue from "vue";
    import Axios from "axios";
    import {mapState} from "vuex";

    export default Vue.extend({
        name: "Navbar",
        data() {
            return {
                isNavbarOpen: false
            }
        },
        methods: {
            switchTheme() {
                let darkmode = this.$store.state.darkmode;

                this.$store.commit("setDarkMode", !darkmode);
            }
        },
        computed: mapState(["session", "isLoggedIn", "darkmode"])
    });
</script>