<template>
  <div
      class="fill-background"
      style="width: 100%; height: 100%;"
      :style="{'background-image': `url(${background_image}`}">
  </div>
</template>

<script>
export default {
  name: "register-page",
  data() {
    return {
      background_image: require("@/assets/register-background.png")
    }
  }
}
</script>

<style scoped>

</style>
