<template>
  <div>
    <div class="header">
      <img src="board-header.jpg"/>
      <p>Clown 游戏社区</p>
    </div>
    <div class="main-wrap" :style="wrapStyle">
      <el-row :gutter="20" style="height: 100px">
        <el-col style="width: 300px">
          <div class="card" style="display: flex; justify-content: space-around">
            <img class="vertical-center fire-img" src="fire.png"/>
            <p style="font-size: 40px; font-weight: bold; line-height: 60px">最热论坛</p>
          </div>
        </el-col>
        <el-col style="width: calc(100% - 300px)">
          <div class="card">
            <template v-if="$store.state.user.permission === 1">
              <div class="button" @click="$router.push('/modifyGame/-1')">添加新游戏</div>
            </template>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col style="width: 300px">
          <div class="hot-board-wrap card">
            <div style="cursor: pointer" v-for="board in hotBoards" :key="board.board_id"
                 @click="$router.push('/board/'+board.board_id)">
              <div style="display:inline-block; width: 60%">{{ board.game_name }}</div>
              <div style="display:inline-block; width: 40%; text-align: right"> +{{ board.board_active }}</div>
            </div>
          </div>
        </el-col>
        <el-col style="width: calc(100% - 300px)">
          <div class="card board-type" v-for="type of boardTypes" :key="type.id">
            <p class="board-type-title">{{ type.type }}专区</p>
            <div :id="'boards-'+type.id" class="boards">
              <div class="board" v-for="board of boards.get(type.id)" :key="board.board_id"
                   @click="$router.push('/board/'+board.board_id)">
                <el-image class="board-logo" :src="board.board_logo"/>
                <p class="board-name" :title="board.board_name"> {{ board.board_name }}</p>
                <p class="board-intro"> {{ board.board_introduction }}</p>
              </div>
              <template v-if="!reloading">
                <div class="board virtual-board" v-for="i in getPlaceHolderNum(type.id)" :key="type.id * 10 + i"></div>
              </template>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "board-main-page",
  computed: {
    wrapStyle() {
      return {
        minHeight: `calc(${this.$store.state.mainBoxHeight} - 150px`,
      }
    }
  },
  data() {
    return {
      hotBoards: [],
      boardTypes: [{
        id: 1,
        type: '端游'
      }, {
        id: 2,
        type: '手游'
      }, {
        id: 3,
        type: '单机'
      }, {
        id: 4,
        type: '其他'
      }],
      boards: [],
      reloading: false
    }
  },
  methods: {
    getHotBoards() {
      this.$http.post(this.$store.state.api + '/board/hot')
          .then(resp => {
            this.hotBoards = []
            if (resp.data.code === 200) {
              this.hotBoards = resp.data.data.board
            } else this.$message.error(resp.data.message)
          })
    },
    getBoards() {
      this.boards = new Map()
      for (let type of this.boardTypes) {
        this.$http.post(this.$store.state.api + '/board/selectBoardByType', {
          type_id: type.id
        }).then(resp => {
          if (resp.data.code === 200) {
            this.boards.set(type.id, resp.data.data.board)
            this.$forceUpdate()
          } else {
            this.$message.error(resp.data.message)
          }
        })
      }
    },
    getPlaceHolderNum(id) {
      if (!this.boards.has(id)) return 0
      let boardsWrap = document.getElementById('boards-' + id)
      if (boardsWrap === null) return 0
      let cnt = boardsWrap.clientWidth / 325
      if (cnt - Math.floor(cnt) < 0.1) cnt = Math.floor(cnt - 1)
      else cnt = Math.floor(cnt)
      if (this.boards.get(id).length % cnt === 0) return 0;
      return cnt - this.boards.get(id).length % cnt
    }
  },
  mounted() {
    let originOnResize = window.onresize
    window.onresize = (e) => {
      if (originOnResize !== null) originOnResize(e)
      this.reloading = true
      this.$nextTick(() => {
        this.reloading = false
      })
    }
  },
  created() {
    this.getHotBoards()
    this.getBoards()
  }
}
</script>

<style scoped>
.header {
  position: relative;
  height: 150px;
}

.header img {
  width: 100%;
  height: 100%;
}

.header p {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
  color: white;
  font-size: 60px;
}

.card {
  height: 100%;
  color: #f0debe;
  background-color: #2b2a49;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 4px;
  padding: 20px;
  box-sizing: border-box;
}

.fire-img {
  width: 60px;
  height: 60px;
}

.main-wrap {
  width: 100%;
  height: fit-content;
  padding: 20px;
  background-color: #1f1d33;
  box-sizing: border-box;
}

.hot-board-wrap {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

.hot-board-wrap > div {
  padding: 0 30px;
}

.hot-board-wrap > div:not(:first-child) {
  margin-top: 20px;
}

.board-type:not(:first-child) {
  margin-top: 20px;
}

.boards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.board-type-title {
  text-align: left;
  font-size: 30px;
  margin-bottom: 20px;
}

.board {
  width: 300px;
  height: 100px;
  padding: 10px;
  margin-left: 15px;
  margin-top: 15px;
  background-color: #1f1d33;
  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 2px;
  cursor: pointer;
}

.virtual-board {
  opacity: 0;
  cursor: default;
}

.board-logo {
  float: left;
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.board-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-align: left;
  color: #902525;
  font-size: 20px;
  font-weight: bold;
}

.board-intro {
  text-align: left;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 50px;
  border-radius: 15px;
  font-size: 25px;
  cursor: pointer;
  background-color: #4e4d7c;
}

.button:not(:first-child){
  margin-left: 20px;
}

/deep/ .el-col {
  height: 100%;
}

/deep/ .el-row + .el-row {
  margin-top: 20px;
}
</style>
