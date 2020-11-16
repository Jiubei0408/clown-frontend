import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [
        {path: '/index', redirect: '/'},
        {
            path: '/',
            name: 'index-page',
            component: () => import('@/components/page/index-page'),
            meta: {
                title: '主页'
            }
        }, {
            path: '/login',
            name: 'login-page',
            component: () => import('@/components/page/login-page'),
            meta: {
                title: '登录'
            }
        }, {path: '*', redirect: '/404'}, {
            path: '/404',
            name: 'error404-page',
            component: () => import('@/components/page/error-page'),
            meta: {
                title: '错误'
            }
        }
    ],
})
