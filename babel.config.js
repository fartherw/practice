//生产环境下去除consloe的配置
const env = process.env.NODE_ENV
const plugins = [];
if (env === 'production') {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
