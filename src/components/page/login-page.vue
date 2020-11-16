<template>
  <div
      style="width: 100%; height: 100%; background-repeat: no-repeat; background-size: 100% 100%"
      :style="{'background-image': `url(${background_image}`}">
    <div class="login-box">
      <el-form
          style="text-align: right"
          label-width="70px"
          :model="loginForm"
          :rules="rules"
          status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-button type="primary" style="width: 40%" @click="submitLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-page",
  data() {
    return {
      background_image: require('@/assets/login-background.png'),
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
      console.log(this.loginForm)
    }
  }
}
</script>

<style scoped>
.login-box {
  position: relative;
  left: 60%;
  top: 20%;
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 10px 10px rgba(0, 0, 0, 0.2);
}

/deep/ .login-box .el-input__inner {
  border-radius: 15px;
}

/deep/ .login-box .el-form-item__label {
  color: white;
}
</style>