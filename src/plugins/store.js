import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = 'http://swordandknight.cn:8800'
const fileHost = 'http://121.40.130.181:5001'

let state = {
    page: null,
    api,
    fileHost,
    mainBoxHeight: 0,
    user: {}
}

let mutations = {
    savePage(state, page) {
        state.page = page
    },
    saveMainBoxHeight(state, height) {
        state.mainBoxHeight = height
    },
    login(state, data) {
        state.page.$http.post(api + '/user/login', {
            username: data.username,
            password: data.password
        })
            .then(data => {
                data = data.data
                if (data.code === 200) {
                    state.user = {
                        id: data.data.uid,
                        avatar: data.data.avatar,
                        nickname: data.data.nickname,
                        permission: data.data.permission
                    }
                    localStorage.setItem('user', JSON.stringify(state.user))
                    state.page.$message.success(data.message)
                    state.page.$router.push('/')
                } else {
                    state.page.$message.error(data.message)
                }
            })
            .catch(error => {
                state.page.$message.error('登录请求失败')
                console.log(error)
            })
    },
    logout(state) {
        state.user = {}
        state.page.$message.success('登出成功')
        localStorage.removeItem('user')
    },
    updateUser(state) {
        if (localStorage.getItem('user')) {
            state.user = JSON.parse(localStorage.getItem('user'))
        }
    }
}

export default new Vuex.Store({
    state,
    mutations
})
