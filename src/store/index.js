import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import api from "@/api"


Vue.use(Vuex)
//登录日志
const env = process.env.NODE_ENV,
  plugins = [];
if (env === 'development') {
  plugins.push(createLogger());
}

export default new Vuex.Store({
  state: {
    profile: null,
  },
  getters: {
  },
  mutations: {
    setProfile(state, info) {
      state.profile = info;
    },
  },
  actions: {
    async setProfileAsync({ commit }) {
      let info = null;
      try {
        let { resultCode, data } = await api.adminProfile()
        if (+resultCode === 200) {//已经登录
          info = data;
          commit('setProfile', info);
        }

      } catch (_) {
        console.log('错误：', _);
      }
      return info;
    },
  },
  plugins
})
