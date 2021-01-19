import VueRouter from "vue-router";

import indexPage from "./pages/index.vue";
import botViewPage from "./pages/bot-view.vue";
import botEditPage from "./pages/bot-edit.vue";
import addPage from "./pages/add.vue";
import dashboardPage from "./pages/dashboard.vue";
import notFoundPage from "./pages/404.vue";

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: () => indexPage
        },
        {
            path: "/bot/:id",
            component: () => botViewPage
        },
        {
            path: "/bot/:id/edit",
            component: () => botEditPage
        },
        {
            path: "/add",
            component: () => addPage
        },
        {
            path: "/dashboard",
            component: () => dashboardPage
        },
        {
            path: "*",
            component: () => notFoundPage
        }
    ]
})

export default router;