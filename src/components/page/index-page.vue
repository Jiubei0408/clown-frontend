<template>
  <div>
    <el-carousel></el-carousel>
    <div class="main-box horizontal-center">
      <el-tabs mode="horizontal" v-model="currentGameID">
        <el-tab-pane v-for="game in followedGames" :label="game.name" :name="game.id.toString()" :key="game.id" lazy>
          {{ game.name }}
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
      ]
    }
  }
}
</script>

<style scoped>
.main-box {
  width: 80%;
}
</style>