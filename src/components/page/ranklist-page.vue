<template>
  <div style="background-color: #1f1d33;" :style="wrapStyle" v-if="refreshing">
    <div class="right-wrap" style="z-index: 100" v-if="gameData !== null && gameData !== undefined">
      <p class="rate">{{ gameData.game_score.toFixed(1) }}</p>
      <p class="game-name" :title="gameData.game_name">{{ gameData.game_name }}</p>
      <p class="game-intro" v-html="toHTML(gameData.game_introduction)"></p>
      <el-image class="game-image horizontal-center" :src="gameData.game_enter_src"/>
      <div class="star horizontal-center" @click="switchStar">
        <template v-if="gameData.is_star">已关注</template>
        <template v-else>关注</template>
      </div>
      <div style="display: flex; justify-content: space-around; margin-top: 20px">
        <div class="button" @click="$router.push('/board/' + gameData.game_id)">进入论坛</div>
        <div class="button" @click="$router.push('/game/' + gameData.game_id)">进入简介</div>
      </div>
    </div>
    <div class="main-wrap horizontal-center">
      <div class="left-wrap">
        <div style="display: flex; justify-content: center; padding: 20px 0">
          <div class="button" :class="type===0?'is-active':''"
               @click="switchType(0)">
            热度榜
          </div>
          <div class="button" :class="type===1?'is-active':''" style="margin-left: 20px"
               @click="switchType(1)">
            评分榜
          </div>
        </div>
        <div class="game-card" v-for="game of ranklist"
             :key="game.game_id"
             @mouseenter="getGameData(game.game_id)"
             @click="$router.push('/game/' + game.game_id)">
          <el-image class="game-image" :src="game.game_enter_src"/>
          <div class="game-info">
            <p class="game-name">{{ game.game_name }}</p>
            <div class="game-tags">
              <el-tag v-for="tag of game.game_tag.split(',') " :key="tag">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <el-pagination background style="margin-top: 20px" :current-page.sync="pageID" :page-count="maxPageID"
                     @current-change="getData"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ranklist-page",
  computed: {
    wrapStyle() {
      return {
        minHeight: this.$store.state.mainBoxHeight,
      }
    }
  },
  data() {
    return {
      type: 0,
      ranklist: [],
      gameData: null,
      pageID: 1,
      maxPageID: 1,
      refreshing: false
    }
  },
  methods: {
    toHTML(str) {
      if (typeof str === 'string')
        return str.replace(/[\r\n]+/g, "<br/>")
      return ''
    },
    switchType(type) {
      this.type = type
      this.pageID = 1
      this.getData()
    },
    getData() {
      let url = this.$store.state.api + '/ranklist/hotRanklist'
      if (this.type === 1) url = this.$store.state.api + '/ranklist/scoreRanklist'
      this.$http.post(url, {
        page_id: this.pageID
      }).then(resp => {
        if (resp.data.code === 200) {
          this.ranklist = resp.data.data.ranklist
          if (this.ranklist.length > 0) this.getGameData(this.ranklist[0].game_id)
          this.maxPageID = resp.data.data.page_cnt
          this.refreshing = true
          this.$nextTick(() => {
            this.refreshing = false
          })
        } else this.$message.error(resp.data.message)
      })
    },
    getGameData(game_id) {
      this.$http.post(this.$store.state.api + '/ranklist/showGame', {
        game_id: game_id,
        user_id: this.$store.state.user.id
      }).then(resp => {
        if (resp.data.code === 200) {
          this.gameData = resp.data.data
          this.gameData.game_id = game_id
        } else this.$message.error(resp.data.message)
      })
    },
    switchStar() {
      this.$http.post(this.$store.state.api + '/board/clickStar', {
        game_id: this.gameData.game_id,
        user_id: this.$store.state.user.id
      }).then(resp => {
        if (resp.data.code === 200) {
          this.$message.success('操作成功')
          this.gameData.is_star = resp.data.data.isStar
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
    this.switchType(0)
  }
}
</script>

<style scoped>
.main-wrap {
  width: 1200px;
  padding: 50px 0;
}

.left-wrap {
  width: 700px;
  min-height: 600px;
  background-color: #2b2a49;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 2px;
  color: #ecdbbc;
}

.right-wrap {
  position: fixed;
  top: 110px;
  left: calc((100% - 1200px) / 2 + 700px + 20px);
  padding: 20px;
  box-sizing: border-box;
  width: calc(500px - 20px);
  min-height: 200px;
  max-height: 600px;
  background-color: #f5cf8b;
  text-align: left;
}

.game-card {
  display: flex;
  padding: 20px;
  cursor: pointer;
}

.game-card:hover {
  background-color: #4e4d6d;
}

.game-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: space-between;
}

.game-tags {
  display: flex;
  justify-content: left;
  margin-top: 20px;
}

.game-tags *:not(:first-child) {
  margin-left: 10px;
}

.game-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.left-wrap .game-name {
  font-size: 20px;
  max-width: 400px;
}

.right-wrap .game-name {
  width: calc(100% - 100px);
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  font-weight: bold;
}

.right-wrap .rate {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
  height: 50px;
  width: 100px;
  border-radius: 15px;
  background-color: #2b2a49;
  color: #dac296;
  font-size: 25px;
}

.right-wrap .game-intro {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
}

.left-wrap .game-image {
  width: 200px;
  height: 100px;
}

.right-wrap .game-image {
  width: 400px;
  height: 200px;
  margin-top: 20px;
}

.star {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 200px;
  height: 50px;
  background-color: whitesmoke;
  border-radius: 15px;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 50px;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer;
}

.left-wrap .button {
  background-color: whitesmoke;
  color: black;
}

.left-wrap .button.is-active {
  background-color: #ecdbbc;
}

.right-wrap .button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 50px;
  background-color: #2b2a49;
  color: #ecdbbc;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer;
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
</style>
