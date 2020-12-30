<template>
  <div class="main-wrap">
    <div class="delete-info" v-if="$store.state.user.permission === 1"
         @click="delInfo">
      <i class="el-icon-delete" style="font-size: 40px; color: #f5cf8b"/>
      <p style="margin-top: 10px; color: #8694c9">删除资讯</p>
    </div>
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
    },
    delInfo() {
      this.$confirm('确认删除此条资讯吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$store.state.api + '/admin/information/delete', {
          information_id: parseInt(this.$route.params.id)
        }).then(resp => {
          if (resp.data.code === 200) {
            this.$message.success('删除成功')
            this.$router.push('/information')
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
}

.main-wrap > *:not(:first-child) {
  margin-top: 20px;
}

.delete-info {
  position: absolute;
  left: -150px;
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

.game-meta {
  display: flex;
  align-items: center;
}

.game-meta > *:not(:first-child) {
  margin-left: 20px;
}

.game-meta a {
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

.time {
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
