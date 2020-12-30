<template>
  <div class="infinite-list"
       v-infinite-scroll="loadMore" infinite-scroll-immediate="false"
       :infinite-scroll-disabled="!hasMore">
    <div class="nav-wrap">
      <div
          v-if="$store.state.user.permission === 1"
          class="new-information" @click="$router.push('/new-information')">
        <i class="el-icon-edit"/>
        <p style="margin-left: 10px">发布资讯</p>
      </div>
      <div class="nav-game-name" v-for="game of followedGames" :key="game.id"
           @click="switchGame(game.id)">
        {{ game.name }}
      </div>
      <el-pagination class="horizontal-center" style="position: absolute; bottom: 20px"
                     layout="prev, pager, next"
                     :current-page.sync="gamePageID" :page-count="gameMaxPageID"/>
    </div>
    <div class="main-wrap" :style="{minHeight: $store.state.mainBoxHeight}" v-loading="loading">
      <el-carousel ref="carousel" type="card" class="horizontal-center carousel" height="20vw">
        <el-carousel-item v-for="info of information.slice(0, 5)" :key="info.id">
          <div @click="handleCarouselClick(info.information_id)">
            <el-image style="width: 100%; height: 100%" :src="info.information_enter_src"/>
            <p class="carousel-title">{{ info.information_title }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="horizontal-center" style="overflow: auto; width: 80%">
        <div class="infinite-list-item info-wrap"
             v-for="info of information" :key="info.information_id"
             @click="$router.push('/information/' + info.information_id)">
          <el-image class="info-image" :src="info.information_enter_src"/>
          <div class="info-right">
            <p style="font-size: 20px">{{ info.information_title }}</p>
            <p class="info-brief">{{ info.information_brief }}</p>
            <p class="info-time"> {{ info.release_date }}</p>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <p v-if="loading">加载中...</p>
        <p v-if="!hasMore">没有更多了</p>
        <p v-if="!loading && hasMore">滚动加载更多...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "information-main-page",
  computed: {
    hasMore() {
      return this.infoPageID < this.infoMaxPageID
    }
  },
  data() {
    return {
      currentGameID: -1,
      followedGames: [{
        id: -1,
        name: '全部游戏'
      }],
      gamePageID: 1,
      gameMaxPageID: 1,
      information: [],
      infoPageID: 1,
      infoMaxPageID: 1,
      loading: false
    }
  },
  methods: {
    loadMore() {
      this.infoPageID++
      this.loadInformation()
    },
    handleCarouselClick(id) {
      let activeIndex = this.$refs.carousel.activeIndex
      if (id === this.information[activeIndex].information_id)
        this.$router.push('/information/' + id)
    },
    switchGame(id) {
      this.infoPageID = 1
      this.currentGameID = id
      this.information = []
      this.loadInformation()
    },
    loadInformation() {
      let id = this.currentGameID
      this.loading = true
      if (id === -1) {
        this.$http.post(this.$store.state.api + '/information/selectAllInformation', {
          page_id: this.infoPageID
        }).then(resp => {
          if (resp.data.code === 200) {
            this.information.push.apply(this.information, resp.data.data.information)
            this.infoMaxPageID = resp.data.data.page_cnt
            this.loading = false
          } else this.$message.error(resp.data.message)
        })
      } else {
        this.$http.post(this.$store.state.api + '/information/selectByGameId', {
          page_id: this.infoPageID,
          game_id: id
        }).then(resp => {
          if (resp.data.code === 200) {
            this.information.push.apply(this.information, resp.data.data.information)
            this.infoMaxPageID = resp.data.data.page_cnt
            this.loading = false
          } else this.$message.error(resp.data.message)
        })
      }
    },
    getFollowGames() {
      this.followedGames = [{
        id: -1,
        name: '全部游戏'
      }]
      if (this.$store.state.user.id) {
        this.$http.post(this.$store.state.api + '/user/star', {
          user_id: this.$store.state.user.id,
          page_id: this.gamePageID
        }).then(resp => {
          this.gameMaxPageID = resp.data.data.page_cnt
          for (let game of resp.data.data.game) {
            this.followedGames.push({
              id: game.game_id,
              name: game.game_name
            })
          }
        })
      }
    }
  },
  created() {
    this.getFollowGames()
    this.switchGame(-1)
  },
}
</script>

<style scoped>
.nav-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  background-color: #2b2a49;
  padding: 20px;
  box-sizing: border-box;
}

.new-information {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 15px;
  background-color: #4492cd;
  color: #ecdbbc;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  padding: 20px;
  box-sizing: border-box;
}

.nav-game-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: 20px;
  color: #ecdbbc;
  text-align: left;
  cursor: pointer;
}

.nav-game-name:not(:first-child) {
  margin-top: 20px;
}

.main-wrap {
  background-color: #323131;
  color: #f5cf8b;
  padding: 20px;
  margin-left: 200px;
}

.carousel-title {
  position: absolute;
  width: 100%;
  background-color: #000000bb;
  bottom: 0;
  padding: 10px 0;
  height: 2vw;
  line-height: 2vw;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1.4vw;
  font-weight: bold;
  color: white;
}

.info-wrap {
  padding: 20px;
  cursor: pointer;
  overflow: hidden;
}

.info-wrap:hover {
  background-color: #6e5f5f;
}

.info-image {
  float: left;
  width: 320px;
  height: 160px;
}

.info-right {
  position: relative;
  width: calc(100% - 350px);
  height: 160px;
  float: left;
  margin-left: 30px;
  text-align: left;
}

.info-brief {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 16px;
}

.info-time {
  position: absolute;
  bottom: 0;
}
</style>
