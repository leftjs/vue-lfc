// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css'
import ElementUI from 'element-ui'
import MintUI from 'mint-ui'
import 'element-ui/lib/theme-default/index.css'
import 'mint-ui/lib/style.css'
import 'font-awesome/css/font-awesome.min.css'
import 'vue2-animate/dist/vue2-animate.css'

Vue.use(ElementUI)
Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
