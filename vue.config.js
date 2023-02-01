const { defineConfig } = require('@vue/cli-service')
const env = process.env.NODE_ENV

module.exports = defineConfig({
  publicPath: './',
  lintOnSave: env === 'development',//优化
  transpileDependencies: false,//优化
  productionSourceMap: false,//优化
  devServer: {              //跨域
    host: '127.0.0.1',
    proxy: {
      "/api": {
        target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
        changeOrigin: true,
        ws: true,
        pathRewrite: { "^/api": '' },
      },
    },
  },
})
