<template>
  <div class="page-nav-wrap">
    <div class="page-nav-menu">
      <div class="vertical-center" style="cursor: pointer" @click="$router.push('/')">
        <el-image
            class="vertical-center"
            src="logo-white.png"
            style="float:left; width: 50px; height: 50px"/>
        <span class="vertical-center" style="float:left; color: white">Clown游戏社区</span>
      </div>
      <div class="vertical-center" style="float: left">
        <span @click="goto('/')">主页</span>
        <span @click="goto('/board')">论坛</span>
        <span @click="goto('/review')">测评</span>
        <span @click="goto('/information')">资讯</span>
        <span @click="goto('/ranklist')">榜单</span>
        <span v-if="$store.state.user.permission === 1" @click="goto('/admin')">管理</span>
      </div>
      <div class="vertical-center" style="float: right;">
        <template v-if="!$store.state.user.id">
          <span @click="goto('/login')">
            <i class="el-icon-key"/> 登录</span>
          <span @click="goto('/register')">
            <i class="el-icon-user"/> 注册</span>
        </template>
        <template v-else>
          <div style="display: flex; align-items: center">
            <el-image :src="$store.state.user.avatar" class="user-avatar" @click="goto('/profile')">
              <template slot="error">
                <div class="default-user" @click="goto('/profile')">
                  <i class="el-icon-user vertical-center"/>
                </div>
              </template>
            </el-image>
            <span @click="goto('/profile')">{{ $store.state.user.nickname }}</span>
            <span @click="$store.commit('logout')"><i class="el-icon-key"/> 登出</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-nav",
  methods: {
    goto(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.page-nav-wrap {
  height: 60px;
}

.page-nav-menu {
  height: 100%;
  padding: 0 12.5%;
  background-color: #31393C;
}

.page-nav-menu span, .page-nav-menu p, .page-nav-menu i {
  color: #F8E5C3;
  cursor: pointer;
  font-size: 18px;
}

div span {
  margin: 0 15px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 20%;
  overflow: hidden;
  cursor: pointer;
}

/deep/ .default-user {
  width: 100%;
  height: 100%;
  background-color: #aaaaaa;
}
</style>
