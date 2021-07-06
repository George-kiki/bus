// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import AntDesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'  // ant-design样式
import store from './store'
import tabs from './config/tabs';
import 'babel-polyfill' // 解决不支持Promise的浏览器
import './css/base.css' // 基础样式
import './css/normalize.css'  // 重置样式
import './less/style.less'  // 功能样式

import api from './config/api'
import face from './config/interface'

Vue.config.productionTip = false;
Vue.use(AntDesign);

Vue.prototype.$tabs = tabs;
Vue.prototype.$api = api;
Vue.prototype.$face = face;

// 二级菜单
Vue.component('sMenu', resolve => require(["./components/common/menu"],resolve));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});