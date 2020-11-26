<template>
  <div
      class="fill-background"
      style="width: 100%; height: 100%;"
      :style="{'background-image': `url(${background_image}`}">
    <div class="center register-box">
      <div class="horizontal-center register-form-wrapper" style="width: 50%">
        <div class="add-avatar horizontal-center"
             style="margin-bottom: 50px">
          <i class="el-icon-plus vertical-center"
             style="color: white; font-size: 20px; font-weight: bolder"/>
        </div>
        <el-form>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="用户名"
                v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="密码"
                v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="重复输入密码"
                v-model="registerForm.repeat"></el-input>
          </el-form-item>
          <el-button style="width: 100%; border-radius: 20px" plain>确认注册</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register-page",
  data() {
    return {
      background_image: require("@/assets/register-background.png"),
      registerForm: {
        username: '',
        password: '',
        repeat: ''
      },
    }
  }
}
</script>

<style scoped>
.register-box {
  width: 500px;
  height: 600px;
  border: #bbbbbb;
  background-color: #eeeeee33;
  box-shadow: #00000033 5px 2px 10px 10px;
}

.register-form-wrapper {
  padding-top: 50px;
}

.register-form-wrapper *:not(i) {
  margin-bottom: 25px;
}

.add-avatar {
  width: 100px;
  height: 100px;
  background-color: #ffffff66;
  border: #aaaaaa 1px solid;
  border-radius: 50%;
  cursor: pointer;
}

/deep/ .el-input__inner {
  background-color: transparent;
  border: none;
  color: white;
  border-bottom: white 1px solid;
  font-size: 20px;
}

/deep/ .el-input__inner:focus {
  border-bottom: white 3px solid;
}

/deep/ input::placeholder {
  color: white;
}
</style>
