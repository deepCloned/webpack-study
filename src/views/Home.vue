<template>
  <div class="home">
    <h1>hello home vue</h1>
    <h2>{{ express }}</h2>
    <img src="../4.jpg" alt="" />
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    express () {
      return 'hello world';
    }
  }
}
</script>

<style lang="scss" scoped>
  .home{
    h1{
      color: #666666;
    }
  }
</style>
