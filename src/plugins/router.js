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
                title: '首页'
            }
        }, {
            path: '/login',
            name: 'login-page',
            component: () => import('@/components/page/login-page'),
            meta: {
                title: '登录'
            }
        }, {
            path: '/register',
            name: 'register-page',
            component: () => import('@/components/page/register-page'),
            meta: {
                title: '注册'
            }
        }, {
            path: '/profile',
            name: 'profile-page',
            component: () => import('@/components/page/profile-page'),
            meta: {
                title: '用户信息'
            }
        }, {
            path: '/posts/:id',
            name: 'post-page',
            component: () => import('@/components/page/post-page'),
            meta: {
                title: '帖子'
            }
        }, {
            path: '/review/:id',
            name: 'review-page',
            component: () => import('@/components/page/review-page'),
            meta: {
                title: '评测'
            }
        }, {
            path: '/information/:id',
            name: 'information-page',
            component: () => import('@/components/page/information-page'),
            meta: {
                title: '资讯'
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
