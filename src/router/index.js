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
  let token = localStorage.getItem('token')
  if (!!token && !!expiredAt && moment().valueOf() < +expiredAt) {
    // 没有过期
    return next(true)
  }else {
    // 过期了
    localStorage.removeItem('expiredAt')
    localStorage.removeItem('token')
    return next('/')
  }
  return next(true)
})

export default router
