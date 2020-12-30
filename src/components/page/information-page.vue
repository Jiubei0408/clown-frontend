<template>
  <div class="main-wrap">
    <div class="game-meta">
      <p class="game-name">{{ information.game_name }}</p>
      <el-link :underline="false" @click="$router.push('/game/' + information.game_id)">游戏详情</el-link>
      <el-link :underline="false" @click="$router.push('/board/' + information.game_id)">进入论坛</el-link>
    </div>
    <p class="title">{{ information.information_title }}</p>
    <p class="time">发表于 {{ information.release_date }}</p>
    <div class="md-wrap">
      <mavon-editor v-model="information.information_content"
                    :boxShadow="false"
                    previewBackground="#ffffff" :toolbarsFlag="false" :subfield="false"
                    defaultOpen="preview"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "information-page",
  data() {
    return {
      information: {}
    }
  },
  methods: {
    getData() {
      this.$http.post(this.$store.state.api + '/information/openInformation/', {
        information_id: parseInt(this.$route.params.id)
      }).then(resp => {
        if (resp.data.code === 200) this.information = resp.data.data
        else this.$message.error(this.resp.data.message)
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
}

.main-wrap > *:not(:first-child) {
  margin-top: 20px;
}

.game-meta {
  display: flex;
  align-items: center;
}

.game-meta > *:not(:first-child){
  margin-left: 20px;
}

.game-meta a{
  font-size: 20px;
}

.game-name {
  color: red;
  width: fit-content;
  font-size: 30px;
  border-bottom: 1px solid;
}

.title {
  font-size: 40px;
  font-weight: bold;
}

.time{
  font-size: 20px;
  color: #c71818;
}

.md-wrap {
  width: 1200px;
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
