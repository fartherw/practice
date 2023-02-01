<template>
  <div id="app">

    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
}
</script>
<style lang="less">
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

.el-input__inner {
  border-radius: 0 !important;
}
</style>
