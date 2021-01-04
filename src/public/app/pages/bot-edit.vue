<template lang="pug">
    div(class="card", style="margin: 10%;", id="editBotForm")
        div(class="card-content" v-if="data")
            div(class="notification is-danger" v-if="lastError") {{lastError}}
            div(class="notification is-success" v-if="lastMessage") {{lastMessage}}

            div(class="field")
                label(class="label") Api Key
                input(class="input", type="text",  v-model="apiKey" readonly)
            
            div(class="field")
                label(class="label") Prefix
                input(class="input", type="text",  v-model="data.prefix")
            div(class="field")
                label(class="label") Short Description
                input(class="input", type="text", v-model="data.short_description")
            div(class="field")
                label(class="label") Description
                input(class="input", type="text", v-model="data.description")
                div(class="field")
            label(class="label") Invite link
                input(class="input", type="text", v-model="data.invite_link")
            label(class="label") Website link
                input(class="input", type="text", v-model="data.website_link")
            div(class="field")
                div(class="control")
                    button(class="button is-link" @click="post") Submit
</template>

<script>
    import Axios from "axios";

    export default {
        data() {
                return {
                    data: undefined,
                    lastError: "",
                    lastMessage: "",
                    apiKey: "",
                    bot_id: undefined
                }
            },
            mounted() {
                this.bot_id = this.$route.params.id;
                this.fetch();
            },
            methods: {
                fetch() {
                    Axios.get(`/api/bot/edit/${this.bot_id}`).then(res => {
                        this.data = res.data;
                    });

                    Axios.get(`/api/bot/apikey/${this.bot_id}`).then(res => {
                        this.apiKey = res.data.api_key;
                    });
                },
                post() {
                    Axios.post(`/api/bot/edit/${this.bot_id}`, this.data).then(res => {
                        this.lastError = "";
                        this.lastMessage = "";

                        if(res.data.error) this.lastError = res.data.error;
                        if(res.data.msg) this.lastMessage = res.data.msg;
                        
                        console.log(res.data);

                        this.fetch();
                    });
                }
            }
    }
</script>