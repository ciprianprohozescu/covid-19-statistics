<template>
  <div id="app">
    <Statistics/>
  </div>
</template>

<script>
import Statistics from './components/Statistics.vue'

export default {
  name: 'App',
  components: {
    Statistics
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
