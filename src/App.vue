<template>
  <div id="app">
    <h1>{{title}}</h1>
    <Sudoku msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Sudoku from "./components/Sudoku.vue";

export default {
  name: "App",
  data() {
    return {
      title: 'Sudoku',
    };
  },
  components: {
    Sudoku,
  },
};
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
