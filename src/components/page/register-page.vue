<template>
  <div
      class="fill-background"
      :style="wrapStyle">
    <div class="center register-box">
      <div class="horizontal-center register-form-wrapper" style="width: 50%">
        <div class="add-avatar horizontal-center"
             @click="handleChooseAvatar"
             v-loading="uploading"
             :element-loading-text="uploadProgress"
             element-loading-background="transparent">
          <i class="el-icon-plus vertical-center"
             v-if="!uploading && registerForm.avatar === ''"
             style="color: white; font-size: 20px; font-weight: bolder"/>
          <el-image v-if="!uploading && registerForm.avatar !== ''" :src="registerForm.avatar"
                    style="width: 100%; height: 100%"/>
          <input id="file" type="file" @change="handleAvatarChange" accept="image/*" hidden @click.stop/>
        </div>
        <el-form>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="用户名"
                v-model="registerForm.username"/>
          </el-form-item>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="密码"
                v-model="registerForm.password" show-password/>
          </el-form-item>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="重复输入密码"
                v-model="registerForm.repeat" show-password/>
          </el-form-item>
          <el-form-item>
            <el-input
                auto-complete="new-password"
                placeholder="昵称"
                v-model="registerForm.nickname"/>
          </el-form-item>
          <el-form-item>
            <el-input
                ref="telephoneInput"
                auto-complete="new-password"
                placeholder="手机号码"
                v-model="registerForm.telephone"
                @input="limitTelephone"
                @paste.native.prevent
                maxlength="11"/>
          </el-form-item>
          <el-button style="width: 100%; border-radius: 20px; margin-top: 20px" plain @click="uploadRegister">确认注册
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register-page",
  computed: {
    wrapStyle() {
      return {
        backgroundImage: `url(${require('@/assets/register-background.png')}`,
        minHeight: '900px',
        height: this.$store.state.mainBoxHeight
      }
    }
  },
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        repeat: '',
        nickname: '',
        telephone: '',
        avatar: ''
      },
      uploading: false,
      uploadProgress: ''
    }
  },
  methods: {
    handleChooseAvatar() {
      document.getElementById('file').click()
    },
    handleAvatarChange() {
      let files = document.getElementById('file').files
      if (files.length === 0) return
      let file = files[0]
      if (!file.type.startsWith('image')) {
        this.$message.error('此文件不是图片')
        return
      }
      if (file.size > 1024 * 1024) {
        this.$message.error('头像文件不能超过 1M')
        return
      }
      let form = new FormData()
      form.append('file', file)
      let request = new XMLHttpRequest()
      request.open('POST', this.$store.state.fileHost + '/upload')
      request.timeout = 10000
      request.ontimeout = () => {
        request.abort()
        this.uploading = false
        this.$message.error('文件传输失败')
      }
      this.uploading = true
      this.uploadProgress = '0%'
      request.upload.onprogress = (e) => {
        this.uploadProgress = Math.floor(100.0 * e.loaded / e.total) + '%'
      }
      request.onload = (e) => {
        this.uploading = false
        if (e.target.status === 200) {
          let resp = JSON.parse(e.target.response)
          this.registerForm.avatar = this.$store.state.fileHost + resp.url
        } else {
          this.$message.error('文件传输失败')
        }
      }
      request.send(form)
    },
    limitTelephone() {
      let input = this.$refs.telephoneInput.$el.firstElementChild
      let position = input.selectionStart
      let reg = /[^0-9]/g
      if (this.registerForm.telephone.match(reg) !== null) {
        this.registerForm.telephone = this.registerForm.telephone.replace(reg, '')
        input.value = this.registerForm.telephone
        input.selectionStart = position - 1
        input.selectionEnd = position - 1
      }
    },
    uploadRegister() {
      if (this.registerForm.username === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.registerForm.nickname === '') {
        this.$message.error('昵称不能为空')
        return
      }
      if (this.registerForm.password === '') {
        this.$message.error('密码不能为空')
        return
      }
      if (this.registerForm.repeat !== this.registerForm.password) {
        this.$message.error('两次输入密码不一致')
        return
      }
      if (this.registerForm.telephone === '') {
        this.$message.error('手机号码不能为空')
        return
      }
      if (this.registerForm.telephone.length !== 11) {
        this.$message.error('手机号长度不正确')
        return
      }
      this.$http.post(this.$store.state.api + '/user/register', {
        username: this.registerForm.username,
        password: this.registerForm.password,
        nickname: this.registerForm.nickname,
        avatar: this.registerForm.avatar,
        phonenumber: this.registerForm.telephone
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success(resp.data.message)
          this.$router.push('/login')
        }else{
          this.$message.error(resp.data.message)
        }
      })
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

.add-avatar {
  width: 100px;
  height: 100px;
  background-color: #ffffff66;
  border: #aaaaaa 1px solid;
  border-radius: 20%;
  margin-bottom: 30px;
  cursor: pointer;
  overflow: hidden;
}

/deep/ .add-avatar .el-loading-mask {
  border-radius: 20%;
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
