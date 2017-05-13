// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'

Vue.config.productionTip = false

require('./assets/css/app.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,	// 将路由实例注册在vue的选项对象中
  template: '<App/>',
  components: { App }	// 根组件
})
