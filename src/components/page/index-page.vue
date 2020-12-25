<template>
  <div>
    <el-carousel type="card" class="horizontal-center carousel" height="25vw">
      <el-carousel-item v-for="info of information" :key="info.id">
        <el-image style="width: 100%; height: 100%" :src="info.imageSrc"/>
        <p class="carousel-title">{{ info.title }}</p>
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
                <div class="content" style="width: 45%">
                  <el-image class="image" :src="reviews[i - 1].imageSrc"></el-image>
                  <p class="title">{{ reviews[i - 1].title }}</p>
                  <p class="brief">{{ reviews[i - 1].brief }}</p>
                </div>
                <div class="content" style="width: 45%">
                  <el-image class="image" :src="information[i - 1].imageSrc"></el-image>
                  <p class="title">{{ information[i - 1].title }}</p>
                  <p class="brief">{{ information[i - 1].brief }}</p>
                </div>
              </div>
              <el-divider v-if="i !== reviews.length"/>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs active-name="" mode="horizontal" style="width: 30%">
        <el-tab-pane name="热门" label="热门" disabled>
          <template slot="label">
            <p style="color: black">热门</p>
          </template>
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
      followedGames: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '英雄联盟'
        },
        {
          id: 2,
          name: '原神'
        }
      ],
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
            time: data.review_date,
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
    }
  },
  mounted() {
    this.getContent(-1)
    this.getHotPost()
  }
}
</script>

<style scoped>
.carousel {
  width: 90%;
  margin: 50px 0;
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
  padding: 15px;
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
  font-size: 16px;
  font-weight: bold;
}

.brief {
  font-size: 14px;
  margin-top: 10px;
}

.title:first-letter, .brief:first-letter {
  margin-left: 28px;
}

/deep/ .el-tabs__item {
  font-size: 20px;
}
</style>