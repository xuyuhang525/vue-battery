<template>
  <div class="home">
    <iframe
      width="100%"
      :src="htmlSrc"
      ref="tempHtml"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      htmlSrc: "static/index.html",
    };
  },
};
</script>
<style scoped lang="scss">
.home {
  height: calc(100vh - 50px);
}
</style>
