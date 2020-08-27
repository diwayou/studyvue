export default function solve(game) {
    console.time("sudoku_solve");
    // build structure
    var cells = Array(81), rows = Array(9), cols = Array(9), grids = Array(9);

    for ( var i = 0; i < 9; i++) {
        rows[i] = [];
        cols[i] = [];
        grids[i] = [];
    }

    for ( var row = 0; row < 9; row++) {
        for ( var col = 0; col < 9; col++) {
            var grid = row - row % 3 + col / 3 << 0;
            var cell = cells[row * 9 + col] = {
                row : row,
                col : col,
                grid : grid,
                value : game[row][col].value
            };
            rows[row].push(cell);
            cols[col].push(cell);
            grids[grid].push(cell);
        }
    }

    cells.forEach(function(cell) {
        var arr = cell.groups = [ cell ];
        rows[cell.row].concat(cols[cell.col]).concat(grids[cell.grid]).forEach(function(obj) {
            if (arr.indexOf(obj) === -1) {
                arr.push(obj);
            }
        });
        arr.shift();
    });
    var results = [];
    solve(0);

    function solve(n) {
        // console.log("solving depth " + n);
        if (n === 81) { // solved
            var result = cells.map(function(cell) {
                return cell.value;
            });
            console.log(result);
            results.push(result);
            console.timeEnd("sudoku_solve");
            return;
        }
        var cell = cells[n];
        if (cell.value) {
            solve(n + 1);
        } else {
            for ( var i = 1; i <= 9; i++) {
                if (cell.groups.some(function(obj) {
                    return obj.value === i;
                })) {
                    continue;
                }
                cell.value = i;
                solve(n + 1);
            }
            cell.value = 0;
        }
    }
    console.log("found " + results.length + " results");
    return results;
}