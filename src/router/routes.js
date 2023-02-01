/* 一级路由 */
import Home from "@/views/Home.vue";
import homeRoutes from "./homeRoutes";

const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        component: Home,
        meta: {
            title: "首页"
        },
        children: homeRoutes
    },
    {
        path: "/login",
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: "登录页"
        }
    },
    {
        path: "*",
        component: () => import('@/views/ErrorPage.vue'),
        meta: {
            title: "错误页"
        }
    },
]

export default routes;