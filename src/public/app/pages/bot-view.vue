<template lang="pug">
    div(class="container" id="mainBotView")
            div(class="card is-shadow" v-if="bot")
                div(class="card-image has-text-centered")
                    img(class="is-rounded" id="avatar" alt="Bot Avatar" :src="bot.user.avatarURL" width="256" height="256")

                div(class="card-content has-text-centered")
                    label(class="title") {{bot.user.username}}
                        |  ({{likeCount}} likes)  
                        template(v-if="isLoggedIn")
                            a(@click="like")
                                font-awesome-icon(icon="thumbs-up" id="likeButton" :class="{'liked': hasLiked}")
                            //- a(@click="unlike" v-if="didLike")
                                //- font-awesome-icon(icon="thumbs-down")

                    br

                    div(class="field is-grouped")
                        div(class="control")
                            br
                            span(class="tag tag-first") Owner
                            a(class="tag tag-second is-info") {{bot.owner.tag}}

                        //- div(class="control")
                        //-     br
                        //-     span(class="tag") Verified
                        //-     a(class="tag is-success" v-if="bot.verified") Yes
                        //-     a(class="tag is-danger" v-if="!bot.verified") No

                        div(class="control")
                            br
                            span(class="tag tag-first") Prefix
                            a(class="tag is-info tag-second") {{bot.prefix}}

                    div(v-if="stats" class="field is-grouped")
                        div(class="control" v-if="stats.guilds")
                            br
                            span(class="tag tag-first") Guilds
                            a(class="tag tag-second is-info") {{stats.guilds}}
                        div(class="control" v-if="stats.channels")
                            br
                            span(class="tag tag-first") Channels
                            a(class="tag tag-second is-info") {{stats.channels}}
                        div(class="control" v-if="stats.users")
                            br
                            span(class="tag tag-first") users
                            a(class="tag tag-second is-info") {{stats.users}}

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
                        div(class="message-body" id="description" v-html="bot._description")
            
            br

            div(class="container" v-if="comments")
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
    import alert from "../alert.js";

    export default {
        data() {
            return {
                bot: undefined,
                comments: undefined,
                comment_content: "",
                lastError: "",
                stats: {},
                bot_id: "",
                likeCount: 0,
                likes: []
            }
        },
        mounted() {
            this.bot_id = this.$route.params.id;

            this.fetchBot();
            this.fetchComments();
            this.fetchStats();
            this.fetchLikes();

            this.$store.commit("setLoading", false);
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
            fetchLikes() {
                Axios.get(`/api/bot/likes/${this.bot_id}`).then(res => {
                    this.likeCount = res.data.likes.length;
                    this.likes = res.data.likes;
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
            },
            like() {
                if(this.hasLiked) {
                    Axios.delete(`/api/bot/likes/${this.bot_id}`).then((res) => {
                        this.fetchLikes();
                    });
                }else {
                    Axios.post(`/api/bot/likes/${this.bot_id}`).then((res) => {
                        this.fetchLikes();
                    });
                }
            }
        },
        computed: {
            hasPermissions() {
                return this.session && this.bot ? this.session._id === this.bot.owner_id : false;
            },
            hasLiked() {
                return this.likes.filter(like => like.author_id === this.session._id)[0];
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
        margin: 5%;
        margin-bottom: 1%;
        border-radius: 50%;
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

    .message-body {
        color: #000000 !important;
    }

    .editInput {
        text-align: center !important;
        width: 40%;
    }

    #likeButton {
        color: #4a4a4a;
    }

    .liked {
        color: #3298dc !important;
    }

    .tag-first {
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }

    .tag-second {
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }

    .is-grouped {
        justify-content: center !important;
    }

    #description {
        p, strong {
            color: #000000 !important;
        }
    }
</style>