<template>
  <div>
    <div class="main-wrap">
      <div class="game-content">
        <div class="title">
          <span style="line-height: 60px">{{ game.game_name }}</span>
          <el-button v-if="game.is_star" style="margin-left: 20px" size="mini" @click="switchStar">已关注</el-button>
          <el-button v-else style="margin-left: 20px" size="mini" @click="switchStar">关注</el-button>
        </div>
        <el-image class="game-image" :src="game.game_enter_src"/>
        <h1>简介</h1>
        <p v-html="toHTML(game.game_introduction)"/>
        <h1>评价</h1>
        <div style="display: flex">
          <el-popover placement="top" trigger="hover">
            <el-rate v-model="vote" show-score :score-template="vote.toFixed(1)"/>
            <el-button style="float: right; margin-top: 10px"
                       size="mini" type="primary"
                       @click="submitVote">确定
            </el-button>
            <div class="vote" slot="reference">
              <div class="vertical-center">
                <p>{{ game.game_avg_score ? game.game_avg_score.toFixed(1) : '' }}</p>
                <p style="font-size: 15px; margin-top: 15px">{{ game.game_score_cnt }}人参与评分</p>
              </div>
            </div>
          </el-popover>
          <div style="margin-left: 15px" v-if="game.cnt_score">
            <div class="vote-view" v-for="i in 5" :key="i">
              <el-rate v-model="[1, 2, 3, 4, 5][5 - i]" disabled/>
              <el-progress
                  style="width: 200px"
                  :percentage="game.game_score_cnt === 0 ? 0 : game.cnt_score[5 - i] / game.game_score_cnt * 100"
                  :show-text="false"
                  color="#aaaaaa"/>
            </div>
          </div>
        </div>
        <h1>相关测评</h1>
        <div style="display: flex; justify-content: space-between">
          <div v-for="review of reviews.slice(0, 2)" :key="review.review_id"
               class="content" style="width: 45%"
               @click="$router.push('/review/' + review.review_id)">
            <el-image class="image" :src="review.review_enter_src"></el-image>
            <p class="title2">{{ review.review_title }}</p>
            <p class="brief">{{ review.review_brief }}</p>
            <p class="time">{{ review.release_date }}</p>
          </div>
        </div>
        <h1>相关资讯</h1>
        <div style="display: flex; justify-content: space-between">
          <div v-for="information of informations.slice(0, 2)" :key="information.information_id"
               class="content" style="width: 45%"
               @click="$router.push('/information/' + information.information_id)">
            <el-image class="image" :src="information.information_enter_src"></el-image>
            <p class="title2">{{ information.information_title }}</p>
            <p class="brief">{{ information.information_brief }}</p>
            <p class="time">{{ information.release_date }}</p>
          </div>
        </div>
      </div>
      <div class="meta-content">
        <el-tag style="margin-right: 10px"
                v-for="tag of game.game_tag" :key="tag">
          {{ tag }}
        </el-tag>
        <p>{{ game.game_meta }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "game-page",
  inject: ['reload'],
  data() {
    return {
      game: {},
      informations: [],
      reviews: [],
      vote: 0
    }
  },
  methods: {
    toHTML(str) {
      if (typeof str === 'string')
        return str.replace(/\r\n/g, "<br/>")
      return ''
    },
    getData() {
      this.$http.post(this.$store.state.api + '/ranklist/detailedGame', {
        game_id: parseInt(this.$route.params.id),
        user_id: this.$store.state.user.id
      }).then(resp => {
        if (resp.data.code === 200) {
          this.game = resp.data.data.game
          this.game.game_tag = this.game.game_tag.split(',')
          this.game.cnt_score = [
            this.game.one_score_cnt,
            this.game.two_score_cnt,
            this.game.three_score_cnt,
            this.game.four_score_cnt,
            this.game.five_score_cnt,
          ]
          this.vote = this.game.your_score
          this.informations = resp.data.data.information
          this.reviews = resp.data.data.review
        } else this.$message.error(resp.data.message)
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
    },
    submitVote() {
      this.$http.post(this.$store.state.api + '/ranklist/scoreGame', {
        user_id: this.$store.state.user.id,
        game_id: parseInt(this.$route.params.id),
        score_val: this.vote
      }).then(resp => {
        if (resp.data.code === 200) this.$message.success(resp.data.message)
        else this.$message.error(resp.data.message)
      })
    }
  },
  created() {
    if (!this.$store.state.user.id) {
      this.$message.error('请先登录')
      this.$router.push('/login')
      return
    }
    this.getData()
  }
}
</script>

<style scoped>
.main-wrap {
  display: flex;
  width: 1200px;
  justify-content: space-around;
  margin: 32px auto;
}

.game-content {
  text-align: left;
  flex: 1;
}

.game-content > *:not(:first-child) {
  margin-top: 20px;
}

.game-content h1 {
  font-size: 20px;
}

.game-content > p {
  width: 700px;
}

.game-image {
  width: 400px;
  height: 200px;
}

.title {
  width: 100%;
  height: 60px;
  font-size: 30px;
}

.meta-content {
  text-align: left;
  margin-left: 50px;
  margin-top: 60px;
  width: 350px;
}

.vote {
  width: 148px;
  height: 110px;
  background-color: #ff8300;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
}

.vote p {
  width: 100%;
}

.vote-view > * {
  display: inline-block;
}

.content {
  position: relative;
  padding: 15px 15px 30px;
  user-select: none;
  cursor: pointer;
}

.content:hover {
  background-color: #E4E7ED;
}

.image {
  width: 100%;
  height: 10vw;
}

.title2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 16px;
  font-weight: bold;
}

.brief {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 14px;
  margin-top: 10px;
}

.time {
  position: absolute;
  bottom: 10px;
  right: 20px;
  width: 100%;
  font-size: 10px;
  text-align: right;
}
</style>
