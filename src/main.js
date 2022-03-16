import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import 'vue2-animate/dist/vue2-animate.min.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' //lang i18n

import 'el-bigdata-table'

import '@/styles/index.scss' //global css

import App from './App'
import router from './router'
import store from './store'
import i18n from './lang'

import '@/icons' //icon
import '@/permission' //permission control

import VueParticles from 'vue-particles' //background
import directives from './directives'

Vue.use(directives)

Vue.use(VueParticles)

Vue.use(ElementUI, { locale, size: 'medium',
 i18n: (key, value) => i18n.t(key, value)})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
