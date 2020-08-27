<template>
  <div id="app">
    <h1>{{title}}</h1>
    <Sudoku />
  </div>
</template>

<script>
import Sudoku from "./components/Sudoku.vue";

export default {
  name: "App",
  data() {
    return {
      title: "Sudoku",
      rooms: [],
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

h1 {
  margin-bottom: 5px;
}
</style>
