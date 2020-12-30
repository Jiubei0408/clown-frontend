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
            path: '/board',
            name: 'board-main-page',
            component: () => import('@/components/page/board-main-page'),
            meta: {
                title: '论坛主页'
            }
        }, {
            path: '/review',
            name: 'review-main-page',
            component: () => import('@/components/page/review-main-page'),
            meta: {
                title: '测评主页'
            }
        }, {
            path: '/new-review',
            name: 'new-review-page',
            component: () => import('@/components/page/new-review-page'),
            meta: {
                title: '发表评测'
            }
        }, {
            path: '/information',
            name: 'information-main-page',
            component: () => import('@/components/page/information-main-page'),
            meta: {
                title: '资讯主页'
            }
        }, {
            path: '/game/:id',
            name: 'game-page',
            component: () => import('@/components/page/game-page'),
            meta: {
                title: '游戏'
            }
        }, {
            path: '/board/:id',
            name: 'board-page',
            component: () => import('@/components/page/board-page'),
            meta: {
                title: '论坛'
            }
        }, {
            path: '/new-post/:id',
            name: 'new-post-page',
            component: () => import('@/components/page/new-post-page'),
            meta: {
                title: '发表帖子'
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
    ]
})
