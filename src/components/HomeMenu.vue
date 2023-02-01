<template>
  <div class="home-menu">
    <el-scrollbar class="assideScroll">
      <el-menu router :default-active="$route.name" text-color="#fff" active-text-color="#409eff"
        background-color="#222832">

        <el-submenu index="submenu1">
          <template #title>
            <i class="el-icon-odometer"></i>
            <span>Dashboard</span>
          </template>
          <el-menu-item v-for="item in routes.primary1" :key="item.name" :index="item.name">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="submenu">
          <template #title>
            <i class="el-icon-s-home"></i>
            <span>首页配置</span>
          </template>
          <el-menu-item v-for="item in routes.secondary" :key="item.name" :index="item.name">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="">
          <template #title>
            <i class="el-icon-menu"></i>
            <span>模块管理</span>
          </template>
          <el-menu-item v-for="item in routes.primary" :key="item.name" :index="item.name">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="submenu2">
          <template #title>
            <i class="el-icon-s-tools"></i>
            <span>系统管理</span>
          </template>
          <el-menu-item v-for="item in routes.primary2" :key="item.name" :index="item.name">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>

        </el-submenu>

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "home-menu",
  computed: {
    routes() {
      let routes = this.$router.getRoutes(),
        primary = [],
        primary1 = [],
        primary2 = [],
        secondary = [];
      routes = routes.filter(item => {
        return item.parent && !item.redirect;
      });
      routes.forEach(item => {
        if (item.meta.submenu) {
          secondary.push(item);
          return;
        }
        if (item.meta.submenu1) {
          primary1.push(item);
          return;
        }
        if (item.meta.submenu2) {
          primary2.push(item);
          return;
        }
        if (item.meta.submenu3) {
          primary.push(item);
          return;
        }

      });

      return {
        primary,
        secondary,
        primary1,
        primary2
      }
    }
  },
};
</script>

<style lang="less" scoped>
.home-menu {
  height: 100%;

  .el-menu {
    border-right: none;
  }

  /deep/.el-scrollbar__bar.is-vertical>div {
    width: 0;
  }

  /deep/.assideScroll {
    height: 96%;
  }
}
</style>