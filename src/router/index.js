import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "./routes"
import store from "@/store"
import { Loading, Message } from "element-ui"

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})


//全局前置守卫：登录态校验
let loadingIns;
router.beforeEach(async (to, _, next) => {
  let path = to.path,
    profile = store.state.profile;
  if (path !== '/login' && !profile) {
    loadingIns = Loading.service({
      text: "努力加载中，请稍后......",
      background: "rgba(0,0,0,.7)"
    })
    profile = await store.dispatch('setProfileAsync');
    if (!profile) {
      Message.warning('您未登录，请登录！')
      next(`/login?to=${path}`);
      return;
    }
  }
  next();
});



//全局后置守卫  :修改标题
router.afterEach(to => {
  if (loadingIns) loadingIns.close();
  let { title = "" } = to.meta;
  document.title = `新蜂CMS内容管理系统${title ? ` - ${title}` : ``}`;
});

export default router
