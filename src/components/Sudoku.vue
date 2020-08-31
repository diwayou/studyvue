<template>
  <div class="hello">
    <div v-if="game !== null">
      <p>{{formatedTime}}</p>
      <table class="sudoku-table">
        <tbody>
          <tr v-for="(row, irow) in game" :key="'row'+irow">
            <td
              v-for="(cell, icell) in row"
              :key="'col'+icell"
              :class="['i'+irow, 'j'+icell, cell.editable ? 'editable': 'not-editable', cell.hasConflict ? 'has-conflict' : 'no-conflict']"
            >
              <input
                type="tel"
                :value="cell.value"
                :readonly="!cell.editable"
                :key="irow + '-' + icell"
                :data-i="irow"
                :data-j="icell"
                @click="cellClick"
                @keyup="cellKeyUp"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>
      <button @click="difficultyClick" data-difficulty="easy">Easy</button>
      <button @click="difficultyClick" data-difficulty="medium">Medium</button>
      <button @click="difficultyClick" data-difficulty="hard">Hard</button>
    </p>
    <div class="controls" v-if="game !== null">
      <button @click="save">Save</button>
      <ul>
        <li
          v-for="sp in savepoints"
          :key="sp.id"
          @click="loadSavepoint"
          :data-id="sp.id"
        >ID{{sp.id}}:&nbsp;&nbsp;{{timeFormat(sp.time)}}</li>
      </ul>
    </div>

    <div v-if="game !== null">
      <div v-if="answers !== null">
        <div v-for="answer in answers" :key="answer">
          <pre v-for="row in answer" :key="row">
          {{JSON.stringify(row)}}
        </pre>
          <hr />
        </div>
      </div>
      <div v-else>
        <button @click="showAnswers">Answer</button>
        <button @click="checkAnswers">Check</button>
      </div>
    </div>
  </div>
</template>

<script>
import randomBoard from "./randomBoard";
import timeFormat from "@/utils/time";
import solve from "./solve";

export default {
  name: "Sudoku",
  props: {
    msg: String,
  },
  data() {
    return {
      game: null,
      origGame: null,
      savepoints: [],
      time: 0,
      id: 0,
      answers: null,
      answersCache: null,
    };
  },
  computed: {
    formatedTime() {
      return timeFormat(this.time);
    },
  },
  methods: {
    showAnswers() {
      this.answers = this.calcAnswer();
    },
    checkAnswers() {
      let ans = this.calcAnswer();

      let re = ans[0];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let cur = this.game[i][j];
          if (cur.value !== null && re[i][j] != cur.value) {
            cur.hasConflict = true;
          }
        }
      }
    },
    calcAnswer() {
      if (this.answersCache !== null) {
        return this.answersCache;
      }

      let re = solve(this.origGame);
      this.answersCache = re.map((s) => {
        return this.chunk(s, 9);
      });

      return this.answersCache;
    },
    timeFormat(t) {
      return timeFormat(t);
    },
    chunk(arr, len) {
      let chunks = [],
        i = 0,
        n = arr.length;
      while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
      }
      return chunks;
    },
    difficultyClick(event) {
      event.preventDefault();

      let board = randomBoard(event.target.getAttribute("data-difficulty"));
      let game = [];
      for (let i = 0; i < 81; i++) {
        if (board[i] === "0") {
          game.push(null);
        } else {
          game.push(parseInt(board[i]));
        }
      }
      game = this.chunk(game, 9);
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let value = game[i][j];
          game[i][j] = {
            i: i,
            j: i,
            value: value,
            editable: value === null,
            hasConflict: false,
          };
        }
      }

      this.game = game;
      this.origGame = JSON.parse(JSON.stringify(game));

      setInterval(this.setTimer, 1000);
    },
    setTimer() {
      if (this.game != null && this.time !== null) {
        this.time++;
      }
    },
    markAllWithoutConflict() {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          this.game[i][j].hasConflict = false;
        }
      }
    },
    checkSubset(array) {
      let nums = new Map();
      for (let i = 0; i < 9; i++) {
        if (array[i].value !== null && nums.has(array[i].value)) {
          array[i].hasConflict = true;
          array[nums.get(array[i].value)].hasConflict = true;
        }
        nums.set(array[i].value, i);
      }
    },
    checkConflicts() {
      this.markAllWithoutConflict();

      // check horizontal lines
      for (let i = 0; i < 9; i++) {
        let arr = [];
        for (let j = 0; j < 9; j++) {
          arr.push(this.game[i][j]);
        }
        this.checkSubset(arr);
      }
      // check vertical lines
      for (let j = 0; j < 9; j++) {
        let arr = [];
        for (let i = 0; i < 9; i++) {
          arr.push(this.game[i][j]);
        }
        this.checkSubset(arr);
      }
      // check squares
      let c = this.game;
      this.checkSubset([
        c[0][0],
        c[0][1],
        c[0][2],
        c[1][0],
        c[1][1],
        c[1][2],
        c[2][0],
        c[2][1],
        c[2][2],
      ]);
      this.checkSubset([
        c[3][0],
        c[3][1],
        c[3][2],
        c[4][0],
        c[4][1],
        c[4][2],
        c[5][0],
        c[5][1],
        c[5][2],
      ]);
      this.checkSubset([
        c[6][0],
        c[6][1],
        c[6][2],
        c[7][0],
        c[7][1],
        c[7][2],
        c[8][0],
        c[8][1],
        c[8][2],
      ]);
      this.checkSubset([
        c[0][3],
        c[0][4],
        c[0][5],
        c[1][3],
        c[1][4],
        c[1][5],
        c[2][3],
        c[2][4],
        c[2][5],
      ]);
      this.checkSubset([
        c[3][3],
        c[3][4],
        c[3][5],
        c[4][3],
        c[4][4],
        c[4][5],
        c[5][3],
        c[5][4],
        c[5][5],
      ]);
      this.checkSubset([
        c[6][3],
        c[6][4],
        c[6][5],
        c[7][3],
        c[7][4],
        c[7][5],
        c[8][3],
        c[8][4],
        c[8][5],
      ]);
      this.checkSubset([
        c[0][6],
        c[0][7],
        c[0][8],
        c[1][6],
        c[1][7],
        c[1][8],
        c[2][6],
        c[2][7],
        c[2][8],
      ]);
      this.checkSubset([
        c[3][6],
        c[3][7],
        c[3][8],
        c[4][6],
        c[4][7],
        c[4][8],
        c[5][6],
        c[5][7],
        c[5][8],
      ]);
      this.checkSubset([
        c[6][6],
        c[6][7],
        c[6][8],
        c[7][6],
        c[7][7],
        c[7][8],
        c[8][6],
        c[8][7],
        c[8][8],
      ]);
    },
    cellKeyUp(event) {
      let el = event.target;
      let value = el.value;
      if (value.length > 1) {
        el.value = value[0];
        value = el.value;
      }
      if (!/^[1-9]$/.test(value)) {
        event.target.value = "";
      }

      let i = parseInt(el.getAttribute("data-i"));
      let j = parseInt(el.getAttribute("data-j"));
      if (el.value.length > 0) {
        this.game[i][j].value = parseInt(value);
      } else {
        this.game[i][j].value = null;
      }

      this.checkConflicts();

      if (value.length > 0) {
        event.target.blur();
      }
    },
    cellClick(event) {
      if (event.target.readOnly) {
        event.target.blur();
      } else {
        event.target.select();
      }
    },
    save() {
      this.savepoints.push({
        id: this.id++,
        time: this.time,
        game: JSON.stringify(this.game),
      });
    },
    loadSavepoint(event) {
      let el = event.target;
      let i = parseInt(el.getAttribute("data-id"));

      let savepoint = this.savepoints[i];

      this.game = JSON.parse(savepoint.game);
      this.time = savepoint.time;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import url("sudoku.less");
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
  cursor: pointer;
}
a {
  color: #42b983;
}
p,
pre {
  padding: 0;
  margin: 0;
}
</style>
