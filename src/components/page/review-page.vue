<template>
  <div class="main-wrap">
    <div class="delete-review" v-if="$store.state.user.permission === 1"
         @click="delReview">
      <i class="el-icon-delete" style="font-size: 40px; color: #f5cf8b"/>
      <p style="margin-top: 10px; color: #8694c9">删除测评</p>
    </div>
    <div class="circle rate">
      <p>{{ review.review_score !== undefined ? review.review_score.toFixed(1) : '' }}</p>
    </div>
    <p class="game-name">{{ review.game_name }}</p>
    <p class="title" :title="review.review_title">{{ review.review_title }}</p>
    <div class="review-meta">
      <el-image class="circle avatar" :src="review.user_avatar">
        <template slot="error">
          <div class="default-user">
            <i class="el-icon-user vertical-center"/>
          </div>
        </template>
      </el-image>
      <div>By <span style="text-decoration: underline">{{ review.user_name }}</span></div>
      <p>发表于 {{ review.release_date }}</p>
    </div>
    <div class="md-wrap">
      <mavon-editor v-model="review.review_content"
                    :boxShadow="false"
                    previewBackground="#ffffff" :toolbarsFlag="false" :subfield="false"
                    defaultOpen="preview"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "review-page",
  data() {
    return {
      review: {}
    }
  },
  methods: {
    getData() {
      this.$http.post(this.$store.state.api + '/review/openReview/', {
        review_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) this.review = resp.data.data
        else this.$message.error(this.resp.data.message)
      })
    },
    delReview() {
      this.$confirm('确认删除此条评测吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/review/delete', {
          review_id: parseInt(this.$route.params.id)
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('删除成功')
            this.$router.push('/review')
          } else this.$message.error(resp.data.message)
        })
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.main-wrap {
  position: relative;
  width: 1200px;
  margin: 20px auto;
  text-align: left;
  padding: 0 80px;
  box-sizing: border-box;
}

.delete-review {
  position: absolute;
  left: -100px;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 10px;
  border-radius: 15px;
  font-size: 20px;
  font-weight: bold;
  background-color: #31393c;
  cursor: pointer;
}

.main-wrap *:not(:first-child) {
  margin-top: 20px;
}

.rate {
  position: absolute;
  top: 50px;
  left: 1000px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background-color: #2b2a49;
  font-size: 36px;
  color: #dac296;
}

.game-name {
  color: red;
  width: fit-content;
  font-size: 20px;
  border-bottom: 1px solid;
}

.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  max-width: 800px;
  font-size: 40px;
  font-weight: bold;
}

.review-meta {
  display: flex;
  align-items: center;
  font-size: 30px;
}

.review-meta > *:not(:first-child) {
  margin-left: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
}

.md-wrap {
  width: 800px;
  border-right: 1px gray solid;
}

.v-note-wrapper {
  border: none;
}

/deep/ .default-user {
  width: 100%;
  height: 100%;
  background-color: #dddddd;
  font-size: 60px;
}
</style>
