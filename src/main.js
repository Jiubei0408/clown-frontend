import Vue from 'vue'
import App from '@/App.vue'
import '@/plugins/element'
import router from '@/plugins/router'
import axios from 'axios'
import store from "@/plugins/store";

Vue.config.productionTip = false
axios.defaults.withCredentials = false
Vue.prototype.$http = axios

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        store.commit('savePage', this)
        store.commit('updateUser')
    }
}).$mount('#app')

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
