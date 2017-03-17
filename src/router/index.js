import Vue from 'vue'
import moment from 'moment'
import Router from 'vue-router'
import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next(true)
  }
  let expiredAt = localStorage.getItem('expiredAt')
  let token = localStorage.get('token')
  if (expiredAt) {

  }
})

export default router
