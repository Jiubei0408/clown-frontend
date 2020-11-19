<template>
  <div id="app">
    <el-scrollbar class="scroll-bar">
      <div id="appBox">
        <page-nav ref="pageNav"/>
        <div ref="pageMainBox">
          <router-view/>
        </div>
        <page-footer ref="pageFooter"/>
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
  methods: {
    fixBox() {
      this.$refs.pageMainBox.style.height = window.innerHeight - this.$refs.pageNav.$el.offsetHeight - this.$refs.pageFooter.$el.offsetHeight + 'px'
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
  min-width: 800px;
}

.scroll-bar {
  height: 100%;
}

.el-scrollbar__wrap {
  overflow: auto;
}

.horizontal-center, .horizontal-center > * {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.vertical-center, .vertical-center > * {
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
}

.center, .center > * {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fill-background {
  background-repeat: no-repeat;
  background-size: 100% 100%
}
</style>
