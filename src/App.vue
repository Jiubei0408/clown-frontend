<template>
  <div id="app">
    <el-scrollbar class="scroll-bar">
      <div id="appBox">
        <page-nav ref="pageNav"/>
        <div ref="pageMainBox">
          <router-view/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import PageNav from "@/components/page-items/page-nav";

export default {
  name: 'app',
  components: {PageNav},
  methods: {
    fixBox() {
      this.$refs.pageMainBox.style.height = window.outerHeight - this.$refs.pageNav.$el.offsetHeight + 'px'
    }
  },
  mounted() {
    this.fixBox()
    const that = this
    window.onresize = function () {
      that.fixBox()
    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.scroll-bar {
  height: 100%;
}

.el-scrollbar__wrap {
  overflow: auto;
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
</style>
