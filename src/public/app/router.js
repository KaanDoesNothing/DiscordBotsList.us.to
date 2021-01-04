import VueRouter from "vue-router";

// import indexPage from "./pages/index";

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: () => import("./pages/index.vue")
        },
        {
            path: "/bot/:id",
            component: () => import("./pages/bot-view.vue")
        },
        {
            path: "/bot/:id/edit",
            component: () => import("./pages/bot-edit.vue")
        },
        {
            path: "/add",
            component: () => import("./pages/add.vue")
        }
    ]
})

export default router;