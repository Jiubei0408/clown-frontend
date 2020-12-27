<template>
  <el-container :style="wrapStyle">
    <el-col class="wrap-followed" style="width: 30%">
      <p style="font-size: 5vh; line-height: 10vh">关注游戏</p>
      <div style="height: 80%">
        <div class="followed-game" v-for="i in 5" :key="i">
          waiting backend
        </div>
      </div>
      <el-pagination style="height: 10%"
                     :current-page.sync="followedGamesPageID"
                     :page-count="followedGamesMaxPageID"
                     @current-change="getFollowedGame"/>
    </el-col>
    <el-col>
      <el-row style="height: 50%; border-bottom: 10px solid #726551">
        <el-col style="width: 86%; height: 100%; background-color: #f5f2eb; padding: 20px">
          <div class="profile-wrap">
            <div style="width: 70%; text-align: left; font-size: 30px">
              <p>用户名: {{ information.username }}</p>
              <p>昵称<i class="el-icon-s-tools" style="cursor: pointer; margin-left: 5px"
                      @click="modifyNickname"/>: {{ information.nickname }}</p>
              <p>创建时间: {{ information.create_time }}</p>
              <p>个性签名<i class="el-icon-s-tools" style="cursor: pointer; margin-left: 5px"
                        @click="modifySignature"/>: {{ information.signature }}</p>
            </div>
            <div class="avatar">
              <el-image :src="information.avatar"/>
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
          <div style="height: 33.33%; background-color: #63677a; cursor: pointer" @click="modifyPassword">
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
      <el-row style="height: 50%; background-color: #f5f2eb; padding: 20px">
        <p style="text-align: left; font-size: 3vh; line-height: 6vh">我的帖子</p>
        <div style="height: 80%">
          <div class="my-post" v-for="post in myPosts" :key="post.post_id">
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
        height: this.$store.state.mainBoxHeight
      }
    }
  },
  data() {
    return {
      followedGames: [],
      followedGamesPageID: 1,
      followedGamesMaxPageID: 1,
      myPosts: [],
      myPostsPageID: 1,
      myPostsMaxPageID: 1,
      information: {}
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
        console.log(resp)
      })
    },
    getMyPost() {
      console.log(this.myPostsPageID)
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
    modifyNickname() {
      this.$prompt('修改昵称', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.information.nickname
      }).then(({value}) => {
        this.$message.error('施工中')
        if (value !== undefined) return value
        //waiting backend
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
    modifyPassword() {
      this.$message.error('施工中')
    }
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
  background-color: #d6c8ac;
  border-right: 10px solid #726551;
}

.followed-game {
  height: calc(20% - 25px);
  margin: 20px;
  border: 1px solid gray;
  background-color: #fff0cd;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 2px
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
}

.post-image {
  width: 200px;
  height: 100%;
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
