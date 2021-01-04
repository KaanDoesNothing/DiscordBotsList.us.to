<template lang="pug">
    div(class="container" id="mainBotView")
            div(class="card is-shadow" v-if="bot")
                div(class="card-image has-text-centered")
                    img(class="is-rounded" id="avatar" alt="Bot Avatar" :src="bot.user.avatarURL" width="256" height="256")

                div(class="card-content has-text-centered")
                    label(class="title") {{bot.user.username}}

                    br
                    
                    div(class="control")
                        br
                        span(class="tag") Owner
                        a(class="tag is-info") {{bot.owner.tag}}

                    div(class="control")
                        br
                        span(class="tag") Verified
                        a(class="tag is-success" v-if="bot.verified") Yes
                        a(class="tag is-danger" v-if="!bot.verified") No

                    div(class="control")
                        br
                        span(class="tag") Prefix
                        a(class="tag is-info") {{bot.prefix}}

                    div(v-if="stats")
                        div(class="control" v-if="stats.guilds")
                            br
                            span(class="tag") Guilds
                            a(class="tag is-info") {{stats.guilds}}
                        div(class="control" v-if="stats.channels")
                            br
                            span(class="tag") Channels
                            a(class="tag is-info") {{stats.channels}}
                        div(class="control" v-if="stats.users")
                            br
                            span(class="tag") users
                            a(class="tag is-info") {{stats.users}}

                    div(class="control")
                        br
                        div(class="buttons is-centered")
                            a(class="button is-dark" :href="bot.invite_link") Invite
                            a(class="button is-dark" :href="bot.website_link") Website
                            //- a(class="button is-dark" v-if="hasPermissions" :href="`/bot/${bot.bot_id}/edit`") Api Key
                            router-link(class="button is-dark" v-if="hasPermissions" :to="`/bot/${bot.bot_id}/edit`") Edit

                    br
                    
                    div(class="message has-text-centered")
                        div(class="message-header text-center") Description
                        div(class="message-body") {{bot.description}}
            
            br

            div(class="container")
                div(class="card is-shadow")
                    div(class="card-header")
                        label(class="card-header-title") Comments
                    div(class="card-content")

                        div(class="field")
                            div(class="notification is-danger" v-if="lastError") {{lastError}}
                        
                        div(class="field has-addons" v-if="isLoggedIn")
                            div(class="control is-expanded")
                                input(class="input" type="text" placeholder="Message content here." v-model="comment_content")
                            div(class="control")
                                a(class="button is-info" @click="postComment") Comment

                        div(class="media" v-for="comment in comments")
                            div(class="media-left")
                                label(class="image is-64x64")
                                    img(class="is-rounded" :src="comment.author.displayAvatarURL")
                            div(class="media-content")
                                div(class="content")
                                    router-link(:to="`/profile/${comment.author_id}`")
                                        strong {{comment.author.username}} 
                                    label {{comment.readableCommentDate}}
                                    br
                                    label {{comment.content}}
                                    br
</template>

<script>
    import {mapState} from "vuex";
    import Axios from "axios";

    export default {
        data() {
            return {
                bot: undefined,
                comments: [],
                comment_content: "",
                lastError: "",
                stats: {},
                bot_id: ""
            }
        },
        mounted() {
            this.bot_id = this.$route.params.id;

            this.fetchBot();
            this.fetchComments();
            this.fetchStats();
        },
        methods: {
            fetchBot() {
                Axios.get(`/api/bot/${this.bot_id}`).then(res => {
                    this.bot = res.data.bot;
                });
            },
            fetchComments() {
                Axios.get(`/api/bot/comments/${this.bot_id}`).then(res => {
                    this.comments = res.data.comments;
                });
            },
            fetchStats() {
                Axios.get(`/api/bot/stats/${this.bot_id}`).then(res => {
                    this.stats = res.data.stats;
                });
            },
            postComment() {
                Axios.post(`/api/bot/comments/${this.bot_id}`, {content: this.comment_content}).then(res => {
                    if(res.data.msg) {
                        this.fetchComments();
                        this.comment_content = "";
                        this.lastError = "";
                    }else {
                        this.lastError = res.data.error;
                    }
                });
            }
        },
        computed: {
            hasPermissions() {
                // console.log(this.session && this.bot ? this.session._id === this.bot_id : false)
                return this.session && this.bot ? this.session._id === this.bot.owner_id : false;
            },
            ...mapState(["session", "isLoggedIn"])
        }
    }
</script>

<style lang="scss">
    #mainBotView {
        padding: 5%;
    }

    #avatar {
        margin: 1%;
    }

    @media (min-width: 768px) {
        #mainBotView {
            width: 800px;
            margin-top: 1%;
            padding: 0%;
        }
    }

    .message {
        min-height: 250px;
    }

    .message-header {
        text-align: center !important;
    }

    .editInput {
        text-align: center !important;
        width: 40%;
    }
</style>