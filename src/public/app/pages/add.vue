<template lang="pug">
    div(class="card", style="margin: 10%;", id="addBotForm")
        div(class="card-content")
            div(class="field")
                label(class="label") Bot ID
                input(class="input", type="text",  v-model="data.bot_id")
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

    import alert from "../alert";

    export default {
        data() {
            return {
                data: {
                    bot_id: "",
                    short_description: "",
                    description: "",
                    invite_link: ""
                },
                lastError: "",
                lastMessage: ""
            }
        },
        methods: {
            post() {
                Axios.post("/api/bot/add", this.data).then(res => {
                    if(res.data.msg) {
                        alert(res.data.msg);
                    }else {
                        alert(res.data.error, "error");
                    }
                });
            }
        }
    }
</script>