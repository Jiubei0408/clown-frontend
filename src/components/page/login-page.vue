<template>
  <div
      class="fill-background"
      :style="wrapStyle">
    <div class="login-box">
      <el-form
          ref="loginForm"
          style="text-align: right"
          label-width="90px"
          :model="loginForm"
          :rules="rules"
          status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-button
            type="primary"
            style="width: 40%; font-size: 16px; font-weight: bold"
            @click="submitLogin">登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-page",
  computed: {
    wrapStyle() {
      return {
        backgroundImage: `url(${require('@/assets/login-background.png')}`,
        height: this.$store.state.mainBoxHeight,
        minHeight: '900px'
      }
    }
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) this.$store.commit('login', this.loginForm)
        else return false
      })
    }
  }
}
</script>

<style scoped>
.login-box {
  position: absolute;
  width: 400px;
  height: 200px;
  right: 15%;
  top: 50%;
  transform: translate(0, -50%);
  padding: 22px 22px 0;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 10px 10px rgba(0, 0, 0, 0.2);
}

/deep/ .login-box .el-input__inner {
  border-radius: 15px;
  border: none;
  background-color: rgba(122, 122, 122, 0.5);
  color: white;
  font-size: 18px;
}

/deep/ .login-box .el-input__inner:focus {
  background-color: rgba(122, 122, 122, 0.7);
}

/deep/ .login-box .el-form-item__label {
  color: white;
  font-size: 18px;
}
</style>
