<template>
  <div style="min-width: 1000px">
    <div class="wrap-add-review"
         v-if="this.$store.state.user.permission === 1"
         @click="$router.push('/new-review')">
      <el-image style="width: 50px; height: 50px" src="logo-pencil.png"/>
      <p style="margin-left: 10px">发表测评</p>
    </div>
    <div style="position: absolute; left: 20%; top: 20px; display: flex">
      <el-image style="width: 80px; height: 80px" src="logo-handle.png"></el-image>
      <p style="font-size: 40px; font-weight: bold; line-height: 80px; margin-left: 10px">测评</p>
    </div>
    <div class="main-wrap">
      <div class="review-wrap" v-for="review of reviews" :key="review.review_id">
        <div class="horizontal-center" style="width: fit-content; overflow: hidden">
          <el-image class="review-image" :src="review.review_enter_src"
                    @click="$router.push('/review/' + review.review_id)"/>
          <div style="float: left; margin-left: 100px">
            <div style="display: flex">
              <el-image style="width: 80px; height: 80px" src="logo-game.png"/>
              <p class="review-game-name"> {{ review.game_name }}</p>
            </div>
            <div style="display: flex; align-items: center; margin-left: 20px; margin-top: 20px; cursor: pointer"
                 @click="$router.push('/review/' + review.review_id)">
              <div class="circle review-id">
                <p>0{{ review.review_id }}</p>
              </div>
              <p class="review-title">{{ review.review_title }}</p>
            </div>
            <p class="release-date">{{ review.release_date }}</p>
          </div>
        </div>
        <div class="brief-wrap">
          <p>{{ getTimeStr(review.review_length) }}</p>
          <div class="circle" style="width: 60px; height: 60px; background-color: #c03838">
            <p style="line-height: 60px; color: white">{{ review.review_score.toFixed(1) }}</p>
          </div>
          <p class="review-brief">{{ review.review_brief }}</p>
        </div>
      </div>
      <el-pagination :current-page.sync="reviewPageID" :page-count="reviewMaxPageID" @current-change="getReview"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "review-main-page",
  inject: ['scrollToTop'],
  data() {
    return {
      reviews: [],
      reviewPageID: 1,
      reviewMaxPageID: 1
    }
  },
  methods: {
    getReview() {
      this.$http.post(this.$store.state.api + '/review/selectAllReviews', {
        page_id: this.reviewPageID
      }).then(resp => {
        this.reviews = resp.data.data.review
        this.reviewMaxPageID = resp.data.data.page_cnt
        this.scrollToTop()
      })
    },
    getTimeStr(minutes) {
      let str = ''
      if (minutes > 60) str += Math.floor(minutes / 60) + '小时'
      str += minutes % 60 + '分钟'
      return str
    }
  },
  created() {
    this.getReview()
  }
}
</script>

<style scoped>
.wrap-add-review {
  position: absolute;
  top: 10px;
  right: 30px;
  display: flex;
  font-size: 30px;
  font-weight: bold;
  line-height: 50px;
  padding: 10px 20px;
  width: fit-content;
  border-radius: 10px;
  background-color: #31393c;
  color: #8694c9;
  cursor: pointer;
}

.main-wrap {
  padding-top: 120px;
  padding-bottom: 30px;
}

.review-wrap {
  overflow: hidden;
  width: 100%;
  margin-bottom: 20px;
}

.review-image {
  float: left;
  width: 640px;
  height: 360px;
  cursor: pointer;
}

.review-game-name {
  font-size: 40px;
  font-weight: bold;
  line-height: 80px;
  margin-left: 10px;
}

.review-id {
  display: flex;
  width: 60px;
  height: 60px;
  align-items: center;
  background-color: #8694c9;
}

.review-id p {
  width: 100%;
  color: white;
  font-size: 20px;
}

.review-title {
  width: 300px;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.release-date {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 20px;
  color: red;
}

.brief-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  background-color: #030303;
  margin-top: 10px;
  color: #dac296;
  padding: 0 50px;
  font-size: 20px;
}

.brief-wrap > *:not(:first-child) {
  margin-left: 50px;
}

.review-brief {
  width: calc(90% - 200px);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-align: left;
}

</style>
