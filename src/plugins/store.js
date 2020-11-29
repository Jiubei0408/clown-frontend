import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = 'https://xx.com'

let state = {
    page: null,
    api
}

let mutations = {
    savePage(state, page) {
        state.page = page
    },
    login(state, data) {
        state.page.$http.post(api + '/login', {
            username: data.username,
            password: data.password
        })
            .then(data => {
                state.page.$message.success('登录请求成功')
                console.log(data)
            })
            .catch(error => {
                state.page.$message.error('登录请求失败')
                console.log(error)
            })
    }
}

export default new Vuex.Store({
    state,
    mutations
})
