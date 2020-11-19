<template>
  <div class="page-nav-wrap">
    <div class="page-nav-menu">
      <div class="vertical-center" style="cursor: pointer" @click="$router.push('/')">
        <el-image
            src="logo-white.png"
            style="float:left; width: 50px; height: 50px"/>
        <span style="float:left; color: white">Clown游戏社区</span>
      </div>
      <div class="vertical-center" style="float: left">
        <span class="link" @click="goto('/')">主页</span>
        <span class="link" @click="goto('/bbs')">论坛</span>
        <span class="link" @click="goto('/eval')">测评</span>
        <span class="link" @click="goto('/info')">资讯</span>
        <span class="link" @click="goto('/rank')">榜单</span>
      </div>
      <div class="vertical-center" style="float: right">
        <span class="link" @click="goto('/login')">
          <i class="el-icon-key"/> 登录
        </span>
        <span class="link" @click="goto('/register')">
          <i class="el-icon-user"/> 注册
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-nav",
  computed: {
    defaultActive() {
      return this.$route.path
    }
  },
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

.link {
  color: #F8E5C3;
  cursor: pointer;
  font-size: 18px;
}

div span {
  margin: 0 15px;
}
</style>
