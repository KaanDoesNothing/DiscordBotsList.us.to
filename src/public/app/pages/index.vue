<template lang="pug">
    div(class="botColumns")
        div(class="columns is-multiline is-mobile is-centered" v-if="bots.length > 0")
            div(class="card", style="margin: 1%;" v-for="bot in bots")
                div(class="card-image")
                    img(:src="bot.user.avatarURL" alt="Bot Avatar" width="256", height="256")

                div(class="card-content")
                    div(class="media-content")
                        p(class="title is-4") {{bot.user.username}}
                    
                    div(class="content") 
                        label {{bot.short_description}}
                    
                    footer(class="card-footer")
                        router-link(class="card-footer-item" v-bind:to="'/bot/' + bot.bot_id") View
                        a(class="card-footer-item" :href="bot.invite_url") Invite

</template>

<script>
    import Axios from "axios";

    export default {
        data() {
            return {
                bots: []
            }
        },
        mounted() {
            this.fetchBots();
        },
        methods: {
            fetchBots() {
                Axios.get("/api/bots/all/json").then(res => {
                    this.bots = res.data.bots;
                })
            }
        }
    }
</script>

<style lang="scss">
    .botColumns {
        margin: 10%;
    }

    .botColumns .field {
        width: 20%;
        margin-top: 1%;
        margin-bottom: 1%;
        margin-left: 40%;
        margin-right: 40%;
    }
</style>