<template>
  <div>
    <el-carousel ref="carousel" type="card" class="horizontal-center carousel" height="20vw">
      <el-carousel-item v-for="info of information" :key="info.id">
        <div @click="handleCarouselClick(info.id)">
          <el-image style="width: 100%; height: 100%" :src="info.imageSrc"/>
          <p class="carousel-title">{{ info.title }}</p>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="main-box horizontal-center">
      <el-tabs mode="horizontal" style="width: 60%" v-model="currentGameID" @tab-click="handleTabClick">
        <el-tab-pane
            v-for="game in followedGames" :key="game.id"
            :name="game.id.toString()"
            :label="game.name"
            lazy>
          <div v-loading="contentLoading" style="margin-bottom: 20px">
            <div v-for="i in Math.min(reviews.length, information.length)" :key="i">
              <div style="display: flex; justify-content: space-between">
                <div class="content" style="width: 45%"
                     @click="$router.push('/review/' + reviews[i - 1].id)">
                  <el-image class="image" :src="reviews[i - 1].imageSrc"></el-image>
                  <p class="title">{{ reviews[i - 1].title }}</p>
                  <p class="brief">{{ reviews[i - 1].brief }}</p>
                  <p class="time">{{ reviews[i - 1].time }}</p>
                </div>
                <div class="content" style="width: 45%"
                     @click="$router.push('/information/' + information[i - 1].id)">
                  <el-image class="image" :src="information[i - 1].imageSrc"></el-image>
                  <p class="title">{{ information[i - 1].title }}</p>
                  <p class="brief">{{ information[i - 1].brief }}</p>
                  <p class="time">{{ information[i - 1].time }}</p>
                </div>
              </div>
              <el-divider v-if="i !== Math.min(reviews.length, information.length)"/>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs active-name="热门" mode="horizontal" style="width: 30%">
        <el-tab-pane name="热门" label="热门" disabled>
          <template slot="label">
            <p style="color: black">热门</p>
          </template>
          <div v-for="post of hotPosts" :key="post.post_id"
               class="content" style="display: flex"
               @click="$router.push('/posts/'+post.post_id)">
            <div>
              <el-image class="game-logo" :src="post.board_logo"/>
            </div>
            <div style="margin-left: 20px">
              <div class="hot-post-game-name">
                <div class="circle point"/>
                {{ post.game_name }}
              </div>
              <div class="hot-post-title">{{ post.post_title }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "index-page",
  data() {
    return {
      currentGameID: '-1',
      followedGames: [{
        id: -1,
        name: '全部'
      }],
      reviews: [],
      information: [],
      hotPosts: [],
      contentLoading: false
    }
  },
  methods: {
    handleTabClick(tab) {
      let gameID = parseInt(tab.name)
      this.getContent(gameID)
    },
    getContent(gameID) {
      this.contentLoading = true
      if (gameID === -1) {
        this.$http.post(this.$store.state.api + '/home/all')
            .then(resp => {
              this.loadContent(resp)
            })
      } else {
        this.$http.post(this.$store.state.api + '/home/selectByGameId', {
          game_id: gameID
        }).then(resp => {
          this.loadContent(resp)
        })
      }
    },
    loadContent(resp) {
      if (resp.data.code === 200) {
        this.reviews = []
        for (let data of resp.data.data.review) {
          this.reviews.push({
            id: data.review_id,
            title: data.review_title,
            brief: data.review_brief,
            time: data.release_date,
            imageSrc: data.review_enter_src
          })
        }
        this.information = []
        for (let data of resp.data.data.information) {
          this.information.push({
            id: data.information_id,
            title: data.information_title,
            brief: data.information_brief,
            time: data.release_date,
            imageSrc: data.information_enter_src
          })
        }
      } else {
        this.$message.error(resp.data.message)
      }
      this.contentLoading = false
    },
    getHotPost() {
      this.$http.post(this.$store.state.api + '/home/hotpost')
          .then(resp => {
            if (resp.data.code === 200) {
              this.hotPosts = resp.data.data.post
            } else {
              this.$message.error(resp.data.message)
            }
          })
    },
    handleCarouselClick(id) {
      let activeIndex = this.$refs.carousel.activeIndex
      if (id === this.information[activeIndex].id)
        this.$router.push('/information/' + id)
    },
    getFollowGames() {
      this.followedGames = [{
        id: -1,
        name: '全部'
      }]
      if (this.$store.state.user.id) {
        this.$http.post(this.$store.state.api + '/user/star', {
          user_id: this.$store.state.user.id,
          page_id: 1
        }).then(resp => {
          for(let game of resp.data.data.game){
            this.followedGames.push({
              id: game.game_id,
              name: game.game_name
            })
          }
        })
      }
    }
  },
  mounted() {
    this.getContent(-1)
    this.getHotPost()
    this.getFollowGames()
  }
}
</script>

<style scoped>
.carousel {
  width: 90%;
  margin: 20px 0;
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

.main-box {
  display: flex;
  justify-content: space-between;
  text-align: left;
  width: 80%;
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

.title {
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

.game-logo {
  width: 60px;
  height: 60px;
}

.point {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border: 1px solid lightgray;
  background-color: #f8a165;
}

.hot-post-game-name {
  font-size: 18px;
  line-height: 20px;
  font-weight: bold;
}

.hot-post-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 5px;
  font-size: 16px;
}

/deep/ .el-tabs__item {
  font-size: 20px;
}
</style>
