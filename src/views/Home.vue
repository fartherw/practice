<template>
  <div class="home-box">
    <div class="menu">
      <div class="logo">CMS系统</div>
      <home-menu />
    </div>

    <div class="content">
      <div class="top">
        <div class="nav">
          <i class="el-icon-back" v-if="$route.meta.categoryLevel ? true : false"
            @click="handleChange($route.meta.categoryLevel)"></i>
          <i class="el-icon-back" v-if="$route.meta.orderInfo ? true : false" @click="handleInfo"></i>
          {{ $route.meta.title }}
        </div>
        <div class="info">
          <i class="el-icon-user-solid"></i>
          {{ profile && profile.nickName }}
          <i class="el-icon-caret-bottom"></i>
          <div class="detail">
            <p>账号：{{ profile && profile.loginUserName }}</p>
            <p>昵称：{{ profile && profile.nickName }}</p>
            <el-button type="primary" size="mini" @click="signout">退出</el-button>
          </div>
        </div>
      </div>
      <div class="middle">
        <router-view />
      </div>
      <div class="footer">
        <div class="footer-left">Copyright © 2019-2021 {{ profile && profile.nickName }}. All rights reserved.</div>
        <a href="https://github.com/newbee-ltd/vue3-admin" target="_blank">vue3-admin Version 3.0.0</a>
      </div>
    </div>
  </div>
</template>

<script>
import HomeMenu from "@/components/HomeMenu.vue";
import { mapState, mapMutations } from "vuex"
import _ from "@/assets/utils"

export default {
  name: "xf-home",
  components: { HomeMenu },
  computed: {
    ...mapState(['profile'])
  },
  methods: {
    ...mapMutations(['setProfile']),
    signout() {
      _.storage.remove('tk');
      this.$message.success('您已安全退出！');
      this.setProfile(null);
      this.$router.push("/login");
    },
    handleChange(num) {
      if (num === 2) {
        this.$router.replace('/home/classification');
        return;
      }
      this.$router.back();
    },
    handleInfo() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.home-box {
  position: relative;
  height: 100%;
  overflow: hidden;



  .menu {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 200px;
    height: 100%;
    background: #222832;

  }

  .content {
    margin-left: 200px;
    box-sizing: border-box;
    height: 100%;
  }
}

.menu {
  .logo {
    box-sizing: border-box;
    padding-left: 80px;
    height: 50px;
    line-height: 49px;
    background: url("../assets/images/mlogo.png") no-repeat 15px;
    background-size: 50px 50px;
    border-bottom: 1px solid #f1eeee0d;
    font-size: 20px;
    color: #fff;
  }
}

.content {
  position: relative;
  padding-top: 50px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e9e9e9;

    .nav {
      font-size: 20px;

      .el-icon-back {
        border: 1px solid #e9e9e9;
        padding: 4px;
        border-radius: 50px;
        margin-right: 5px;
      }
    }

    .info {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 40px;
      font-size: 16px;

      i {
        cursor: pointer;
        font-size: 18px;
        margin-right: 6px;
      }

      .detail {
        display: none;
        position: absolute;
        top: 40px;
        right: 0;
        z-index: 99999;
        box-sizing: border-box;
        padding: 12px;
        width: 300px;
        height: 100px;
        background: url("../assets/images/account-banner-bg.png") no-repeat;
        background-size: cover;
        font-size: 14px;

        p {
          line-height: 37px;
          color: #fff;
        }

        .el-button {
          position: absolute;
          right: 12px;
          top: 16px;
        }
      }

      &:hover .detail {
        display: block;
      }
    }
  }

  .middle {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 50px;
    background-color: #fff;
    z-index: 999;
    border-top: 1px solid #e9e9e9;

    .footer-left {
      font-size: 16px;
    }

    a {
      font-size: 16px;
      color: #409EFF;
    }
  }
}
</style>