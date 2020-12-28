<template>
  <el-container :style="wrapStyle">
    <el-dialog title="修改密码" :visible.sync="form.visible" append-to-body>
      <el-form label-position="left" v-model="form" label-width="120px">
        <el-form-item label="手机号">
          <el-input v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password" auto-complete="new-password" show-password/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initForm">取 消</el-button>
        <el-button type="primary" @click="modifyPassword">确 定</el-button>
      </div>
    </el-dialog>
    <el-scrollbar style="width: 30%" wrap-style="background-color: #d6c8ac">
      <div class="wrap-followed">
        <p style="font-size: 5vh; line-height: 10vh">关注游戏</p>
        <div class="followed-game" v-for="game of followedGames" :key="game.game_id">
          <el-image class="game-logo" :src="game.game_src"/>
          <div style="text-align: center">
            <p style="font-size: 20px; font-weight: bold">{{ game.game_name }}</p>
            <p class="horizontal-center followed-game-link" :underline="false"
               @click="$router.push('/board/'+game.game_id)">进入论坛
            </p>
            <p class="horizontal-center followed-game-link" :underline="false"
               @click="$router.push('/game/'+game.game_id)">进入简介
            </p>
          </div>
        </div>
        <el-pagination :current-page.sync="followedGamesPageID"
                       :page-count="followedGamesMaxPageID"
                       @current-change="getFollowedGame"/>
      </div>
    </el-scrollbar>
    <el-col style="border-left: 10px solid #726551">
      <el-row style="height: 40%; border-bottom: 10px solid #726551">
        <el-col style="width: 86%; height: 100%; background-color: #f5f2eb; padding: 20px">
          <div class="profile-wrap">
            <div style="width: 70%; text-align: left; font-size: 30px">
              <p>用户名: {{ information.username }}</p>
              <p>昵称: {{ information.nickname }}</p>
              <p>创建时间: {{ information.create_time }}</p>
              <p>个性签名<i class="el-icon-s-tools" style="cursor: pointer; margin-left: 5px"
                        @click="modifySignature"/>: {{ information.signature }}</p>
            </div>
            <div class="avatar"
                 v-loading="uploading"
                 :element-loading-text="uploadProgress"
                 element-loading-background="transparent"
                 @click="modifyAvatar">
              <el-image :src="information.avatar"/>
              <input id="file" type="file" @change="handleAvatarChange" accept="image/*" hidden @click.stop/>
            </div>
          </div>
        </el-col>
        <el-col style="width: 14%; height: 100%; color: white; user-select: none">
          <div style="height: 33.33%; background-color: #8589a6">
            <div class="vertical-center">
              <i class="el-icon-user-solid" style="font-size: 40px"/>
              <p style="font-size: 30px; margin-top: 10px">个人信息</p>
            </div>
          </div>
          <div style="height: 33.33%; background-color: #63677a; cursor: pointer" @click="form.visible = true">
            <div class="vertical-center">
              <i class="el-icon-lock" style="font-size: 40px"/>
              <p style="font-size: 30px; margin-top: 10px">修改密码</p>
            </div>
          </div>
          <div style="height: 33.33%; background-color: #5e616d; cursor: pointer" @click="$message.error('施工中')">
            <div class="vertical-center">
              <i class="el-icon-phone" style="font-size: 40px"/>
              <p style="font-size: 30px; margin-top: 10px">联系客服</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="height: 60%; background-color: #f5f2eb; padding: 20px">
        <p style="text-align: left; font-size: 3vh; line-height: 6vh">我的帖子</p>
        <div style="height: 80%">
          <div class="my-post" v-for="post in myPosts" :key="post.post_id"
               @click="$router.push('/posts/' + post.post_id)">
            <el-image :src="post.src" class="post-image"/>
            <div style="width: 100%; margin-left: 20px">
              <div style="display: flex; justify-content: space-between">
                <span class="post-title">主题: {{ post.title }}</span>
                <span style="width: 30%; text-align: left">所属板块: {{ post.module }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 30px">
                <span>回复: {{ post.comment_count }}</span>
                <span style="width: 30%; text-align: left;">发帖日期: {{ post.post_datetime }}</span>
              </div>
            </div>
          </div>
        </div>
        <el-pagination style="height: 10%"
                       :current-page.sync="myPostsPageID"
                       :page-count="myPostsMaxPageID"
                       @current-change="getMyPost"/>
      </el-row>
    </el-col>
  </el-container>
</template>

<script>
export default {
  name: "profile-page",
  computed: {
    wrapStyle() {
      return {
        minHeight: '1200px',
        // minWidth: '1200px',
        height: this.$store.state.mainBoxHeight
      }
    }
  },
  data() {
    return {
      uploading: false,
      uploadProgress: '0%',
      followedGames: [],
      followedGamesPageID: 1,
      followedGamesMaxPageID: 1,
      myPosts: [],
      myPostsPageID: 1,
      myPostsMaxPageID: 1,
      information: {},
      form: {
        phone: '',
        password: '',
        visible: false
      }
    }
  },
  methods: {
    getMyInformation() {
      this.$http.post(this.$store.state.api + '/user/myInformation', {
        user_id: this.$store.state.user.id
      }).then(resp => {
        this.information = resp.data.data
      })
    },
    getFollowedGame() {
      this.$http.post(this.$store.state.api + '/user/star', {
        user_id: this.$store.state.user.id,
        page_id: this.followedGamesPageID
      }).then(resp => {
        this.followedGames = resp.data.data.game
        this.followedGamesMaxPageID = resp.data.data.page_cnt
      })
    },
    getMyPost() {
      this.$http.post(this.$store.state.api + '/user/myPost', {
        user_id: this.$store.state.user.id,
        page_id: this.myPostsPageID
      }).then(resp => {
        if (resp.data.code === 200) {
          this.myPosts = resp.data.data.post
          this.myPostsMaxPageID = resp.data.data.page_cnt
        } else {
          this.myPosts = []
          this.$message.error(resp.data.message)
        }
      })
    },
    modifySignature() {
      this.$prompt('修改个性签名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.information.signature
      }).then(({value}) => {
        this.$http.post(this.$store.state.api + '/user/modifySignature', {
          user_id: this.$store.state.user.id,
          signature: value
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success(resp.data.message)
            this.information.signature = value
          } else this.$message.error(resp.data.message)
        })
      })
    },
    initForm() {
      this.form = {
        phone: '',
        password: '',
        visible: false
      }
    },
    modifyPassword() {
      if (this.form.password === '') {
        this.$message.error('新密码不能为空')
        return
      }
      this.$http.post(this.$store.state.api + '/user/changePassword', {
        username: this.$store.state.user.username,
        phonenumber: this.form.phone,
        changed_password: this.form.password
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success(resp.data.message)
          this.form.visible = false
        } else this.$message.error(resp.data.message)
      })
    },
    modifyAvatar() {
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
          let url = JSON.parse(e.target.response).url
          this.$http.post(this.$store.state.api + '/user/modifyAvatar', {
            user_id: this.$store.state.user.id,
            avatar: this.$store.state.fileHost + url
          }).then(resp => {
            if (resp.data.code === 200) {
              this.information.avatar = this.$store.state.fileHost + url
              this.$store.state.user.avatar = this.$store.state.fileHost + url
              localStorage.setItem('user', JSON.stringify(this.$store.state.user))
              this.$message.success('修改成功')
            } else this.$message.error(resp.data.message)
          })

        } else {
          this.$message.error('文件传输失败')
        }
      }
      request.send(form)
    },
  },
  created() {
    if (!this.$store.state.user.id) {
      this.$message.error('请先登录')
      this.$router.push('/login')
      return
    }
    this.getMyInformation()
    this.getFollowedGame()
    this.getMyPost()
  }
}
</script>

<style scoped>
.wrap-followed {
  min-height: fit-content;
  height: 100%;
  text-align: center;
}

.followed-game {
  height: fit-content;
  margin: 20px;
  border: 1px solid gray;
  background-color: #fff0cd;
  padding: 20px;
  text-align: left;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 2px
}

.followed-game-link {
  display: block;
  width: fit-content;
  margin-top: 15px;
  font-size: 18px;
  cursor: pointer;
}

.followed-game-link:hover{
  color: #409EFF;
}

.game-logo {
  width: 100%;
  height: 50%;
}

.my-post {
  display: flex;
  height: calc(33.33% - 65px);
  margin: 10px;
  border: 1px solid gray;
  background-color: #fff0cd;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 2px;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.post-image {
  width: 5em;
  height: 5em;
}

.post-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.profile-wrap {
  display: flex;
  background-color: white;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 20px;
}

.profile-wrap p {
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  width: 100%;
  -webkit-line-clamp: 5;
  overflow: hidden;
  margin-top: 15px;
}

.avatar {
  position: relative;
  width: 30%;
  height: 18vw;
  text-align: center;
  cursor: pointer;
}

.avatar .el-image {
  width: 100%;
  height: 100%;
}

/deep/ .avatar:hover .el-image {
  filter: brightness(.4);
}

.avatar:hover:before {
  content: "\e6d9";
  font-family: element-icons !important;
  font-size: 40px;
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
