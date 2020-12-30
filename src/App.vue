<template>
  <div id="app" ref="pageBox">
    <el-scrollbar ref="scrollbar" class="scroll-bar">
      <div id="appBox">
        <page-nav ref="pageNavBox"/>
        <div class="page-main-box" ref="pageMainBox">
          <router-view v-if="!reloading"/>
        </div>
        <page-footer ref="pageFooterBox"/>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import PageNav from "@/components/page-items/page-nav";
import PageFooter from "@/components/page-items/page-footer";

export default {
  name: 'app',
  components: {PageFooter, PageNav},
  provide() {
    return {
      reload: this.reload,
      scrollToTop: this.scrollToTop
    }
  },
  data() {
    return {
      reloading: false
    }
  },
  methods: {
    fixBox() {
      let clientHeight = window.innerHeight
      let clientWidth = window.innerWidth
      let navHeight = this.$refs.pageNavBox.$el.clientHeight
      let footerHeight = this.$refs.pageFooterBox.$el.clientHeight
      this.$refs.pageMainBox.style.minHeight = clientHeight - navHeight - footerHeight + 'px'
      this.$store.commit('saveMainBoxHeight', this.$refs.pageMainBox.style.minHeight)
      this.$refs.pageBox.style.height = clientHeight + 'px'
      this.$refs.pageBox.style.widows = clientWidth + 'px'
    },
    reload() {
      this.reloading = true;
      this.$nextTick(() => {
        this.reloading = false
      })
    },
    scrollToTop() {
      window.scrollTo({behavior: 'smooth', top: 0})
      this.$refs.scrollbar.$refs['wrap'].scrollTo({behavior: 'smooth', top: 0})
    }
  },
  mounted() {
    this.fixBox()
    let originOnResize = window.onresize
    window.onresize = (e) => {
      if (originOnResize !== null) originOnResize(e)
      this.fixBox()
    }
  },
  created() {
    window.addEventListener('unhandledrejection', (e) => {
      e.promise.catch(err => {
        if (err.response && err.response.data)
          this.$message.error(err.response.data.error)
        else console.log(err)
      })
    })
  },
  watch: {
    $route() {
      this.reload()
      this.scrollToTop()
      document.title = this.$route.meta.title
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  border: 0;
  text-decoration: none;
  list-style-type: none;
}

body, html {
  min-width: 1100px;
  overflow-y: hidden;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  overflow: hidden;
  width: fit-content;
  min-width: 100%;
  text-align: center;
}

.page-main-box {
  position: relative;
}

.scroll-bar {
  height: 100%;
}

.el-scrollbar__wrap {
  overflow: auto !important;
}

.el-scrollbar__bar {
  z-index: 100000 !important;
}

.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll;
}

.horizontal-center {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.vertical-center {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
}

.center {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fill-background {
  background-repeat: no-repeat;
  background-size: 100% 100%
}

.circle {
  border-radius: 100%;
}
</style>
