<template>
  <div style="min-width: 1500px">
    <div class="header">
      <img src="board-header.jpg"/>
      <p>Clown 游戏社区</p>
    </div>
    <div class="main-wrap" :style="wrapStyle">
      <el-row :gutter="20" style="height: 100px">
        <el-col :span="4">
          <div class="card" style="display: flex; justify-content: space-around">
            <img class="vertical-center fire-img" src="fire.png"/>
            <p style="font-size: 1.5vw; font-weight: bold; line-height: 60px">最热论坛</p>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="card" style="display: flex">
            <template v-if="$store.state.user.permission === 1">
              <div class="button" @click="delGame">删除此游戏</div>
              <div class="button" @click="$router.push('/modifyGame/' + $route.params.id)">修改此游戏</div>
            </template>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="hot-board-wrap card">
            <div style="cursor: pointer" v-for="board in hotBoards" :key="board.board_id"
                 @click="$router.push('/board/'+board.board_id)">
              <div style="display:inline-block; width: 60%">{{ board.game_name }}</div>
              <div style="display:inline-block; width: 40%; text-align: right"> +{{ board.board_active }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <el-row :gutter="20" style="height: 300px">
            <el-col style="width: 500px">
              <div class="card" style="text-align: left; background-color: #4e4d7c">
                <div class="horizontal-center">
                  <div class="base-info-wrap">
                    <span class="game-name">{{ board.game_name }}</span>
                    <span>日活跃数：{{ board.board_active }}</span>
                    <div class="star" @click="switchStar">
                      <p v-if="board.is_starred">已关注</p>
                      <p v-else>关注</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: flex-start">
                    <el-image class="circle" style="width: 60px; height: 60px" :src="board.board_logo"/>
                    <span class="text-intro" style="width: 340px; margin-left: 40px">{{
                        board.board_introduction
                      }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col style="width: calc(100% - 500px)">
              <div class="card"
                   style="border: 8px solid #b3a180; padding-top:0; background-color: #ecdbbc; color: black">
                <p style="font-size: 36px; font-weight: bold; line-height: 60px; color: #4e4d7c">今日热帖</p>
                <div class="hot-post-wrap">
                  <p class="horizontal-center post-link"
                     v-for="hotPost in hot_posts" :key="hotPost.post_id"
                     @click="$router.push('/posts/'+hotPost.post_id+'/1')">
                    {{ hotPost.post_title }}
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-table class="horizontal-center post-table" header-row-class-name="post-table-row"
                      row-class-name="post-table-row"
                      :data="distillated_posts">
              <el-table-column label="精华帖子" width="700px" prop="post_title">
                <template slot-scope="scope">
                  <el-link @click="$router.push('/posts/' + scope.row.post_id +'/1')">
                    {{ scope.row.post_title }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="发表" width="250px">
                <template slot-scope="scope">
                  {{ scope.row.post_author }} {{ scope.row.release_time }}
                </template>
              </el-table-column>
              <el-table-column label="最后回复" width="250px">
                <template slot-scope="scope">
                  {{ scope.row.last_comment_user_nickname }}
                  <template v-if="scope.row.last_comment_time !== '暂无人评论'">
                    {{ scope.row.last_comment_time }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <el-table class="horizontal-center post-table" header-row-class-name="post-table-row"
                      row-class-name="post-table-row"
                      :data="posts">
              <el-table-column label="交流专区" prop="post_title" width="700px">
                <template slot-scope="scope">
                  <el-link @click="$router.push('/posts/' + scope.row.post_id+'/1')">
                    {{ scope.row.post_title }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="发表" width="250px">
                <template slot-scope="scope">
                  {{ scope.row.post_author }} {{ scope.row.release_time }}
                </template>
              </el-table-column>
              <el-table-column label="最后回复" width="250px">
                <template slot-scope="scope">
                  {{ scope.row.last_comment_user_nickname }}
                  <template v-if="scope.row.last_comment_time !== '暂无人评论'">
                    {{ scope.row.last_comment_time }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <div class="horizontal-center" style="width: 1200px; overflow: hidden; margin-top: 20px;">
              <el-pagination style="width: fit-content; float: left" background
                             :current-page.sync="postPageID" :page-count="postMaxPageID"/>
              <div class="new-post" style="float: right"
                   @click="$router.push('/new-post/'+$route.params.id)">
                发表新帖
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "board-page",
  inject: ['reload'],
  computed: {
    wrapStyle() {
      return {
        minHeight: `calc(${this.$store.state.mainBoxHeight} - 150px`
      }
    }
  },
  data() {
    return {
      hotBoards: [],
      board: {},
      distillated_posts: [],
      hot_posts: [],
      posts: [],
      postPageID: 1,
      postMaxPageID: 1
    }
  },
  methods: {
    delGame() {
      this.$confirm('确定要删除此游戏吗？', '提示',)
          .then(() => {
            this.$http.post(this.$store.state.api + '/admin/game/delete', {
              game_id: parseInt(this.$route.params.id)
            }).then(resp => {
              if(resp.data.code === 200){
                this.$message.success('操作成功')
                this.$router.push('/board')
              }else this.$message.error(resp.data.message)
            })
          })
    },
    getHotBoards() {
      this.$http.post(this.$store.state.api + '/board/hot')
          .then(resp => {
            this.hotBoards = []
            if (resp.data.code === 200) {
              this.hotBoards = resp.data.data.board
            } else this.$message.error(resp.data.message)
          })
    },
    getMetaData() {
      this.$http.post(this.$store.state.api + '/board/openBoard', {
        user_id: this.$store.state.user.id,
        board_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) {
          this.board = resp.data.data.board
          this.distillated_posts = resp.data.data.distillated_post
          this.hot_posts = resp.data.data.hot_post
        } else this.$message.error(resp.data.message)
      })
    },
    getNormalPost() {
      this.$http.post(this.$store.state.api + '/board/showPage', {
        user_id: this.$store.state.user.id,
        board_id: parseInt(this.$route.params.id),
        page_id: this.postPageID
      }).then(resp => {
        if (resp.data.code === 200) this.posts = resp.data.data.normal_post
        else this.$message.error(resp.data.message)
      })
    },
    switchStar() {
      if (!this.$store.state.user.id) return
      this.$http.post(this.$store.state.api + '/board/clickStar', {
        user_id: this.$store.state.user.id,
        game_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) {
          if (resp.data.data.isStar) this.$message.success('关注成功')
          else this.$message.success('取消关注成功')
          this.reload()
        } else this.$message.error(resp.data.message)
      })
    }
  },
  created() {
    if (!this.$store.state.user.id) {
      this.$message.error('请先登录')
      this.$router.push('/login')
      return
    }
    this.getHotBoards()
    this.getMetaData()
    this.getNormalPost()
  }
}
</script>

<style scoped>
.header {
  position: relative;
  height: 150px;
}

.header img {
  width: 100%;
  height: 100%;
}

.header p {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
  color: white;
  font-size: 60px;
}

.card {
  height: 100%;
  color: #f0debe;
  background-color: #2b2a49;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 4px;
  padding: 20px;
  box-sizing: border-box;
}

.fire-img {
  min-width: 30px;
  min-height: 30px;
  width: 3.5vw;
  height: 3.5vw;
}

.main-wrap {
  width: 100%;
  height: fit-content;
  padding: 20px;
  background-color: #1f1d33;
  box-sizing: border-box;
}

.search-input {
  width: 80%;
  margin-right: 20px;
}

.hot-board-wrap {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.hot-board-wrap > div {
  padding: 0 30px;
}

.hot-board-wrap > div:not(:first-child) {
  margin-top: 20px;
}

.game-name {
  color: white;
  font-size: 36px;
  line-height: 60px;
  font-weight: bold;
}

.star {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #f3c573;
  border-radius: 10px;
  color: #a71e51;
}

.base-info-wrap {
  display: flex;
  align-items: center;
  font-size: 18px;
  flex-wrap: wrap;
  height: fit-content;
  justify-content: space-evenly;
}

.text-intro {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  overflow: hidden;
}

.hot-post-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid #bbbbbb;
  background-color: #b3a180;
  min-height: 200px;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 6px;
}

.post-link {
  width: fit-content;
  color: black;
  font-size: 20px;
  cursor: pointer;
}

.post-link:hover {
  color: #ecdbbc;
}

.post-table {
  width: 1200px;
  background-color: transparent;
}

.post-table:before {
  content: none;
}

.new-post {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 30px;
  border-radius: 10px;
  background-color: #ecdbbc;
  cursor: pointer;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 50px;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer;
  background-color: #4e4d7c;
}

.button:not(:first-child) {
  margin-left: 20px;
}

/deep/ .post-table-row, /deep/ .post-table-row th, /deep/ .post-table-row td {
  background-color: transparent;
  border: none;
}

/deep/ .post-table-row td:not(:first-child):after {
  position: absolute;
  top: 1px;
  bottom: 1px;
  content: '';
  border-right: 1px dashed #ecdbbc;
}

/deep/ .post-table-row .el-link, .post-table-row .el-link:hover:after {
  color: #ecdbbc;
  border-bottom-color: #ecdbbc;
}

/deep/ .post-table span, /deep/ .post-table-row td {
  font-size: 15px;
  color: #ecdbbc;
}

/deep/ .post-table-row th {
  font-size: 20px;
  font-weight: normal;
  color: #ecdbbc;
}

/deep/ .post-table-row:hover td {
  background-color: #2f2e52 !important;
}

/deep/ .el-pagination.is-background .el-pager li {
  color: black !important;
  background: #ecdbbc !important;
}

/deep/ .el-pagination.is-background .el-pager li:hover {
  background: #ffefd4 !important;
}

/deep/ .el-pagination__jump {
  color: #ecdbbc;
}

/deep/ .el-col {
  height: 100%;
}

/deep/ .el-row + .el-row {
  margin-top: 20px;
}
</style>
