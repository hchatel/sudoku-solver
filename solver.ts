import { Board } from "./board.ts";
import { Grid, Row, Value } from "./types.ts";

type SolverCell = {
  value: Value | undefined;
  options: Value[];
};

const OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Solver {
  grid: Grid<SolverCell>;
  board: Board;
  stuck = false;
  solved = false;
  step = 0;
  foundValues = 0;

  constructor(g: Board) {
    this.board = g;
    this.grid = this.board.grid.map(
      (row) =>
        row.map((cell) => {
          if (cell) {
            this.foundValues++;
          }

          return {
            value: cell,
            options: cell ? [cell] : OPTIONS,
          } as SolverCell;
        }) as Row<SolverCell>
    ) as Grid<SolverCell>;
  }

  solve() {
    console.info("Solving board: ");
    this.board.display();

    while (!(this.stuck || this.solved)) {
      this.step++;
      this.solveEasy();
    }

    console.info(
      `${this.solved ? "Solved" : "Stuck"} after ${this.step} steps !`
    );
    this.board.display();
  }

  private solveEasy = () => {
    this.stuck = true;

    // Visit every cell
    for (let I = 0; I < 9; I++) {
      for (let J = 0; J < 9; J++) {
        // If no value, try to reduce options for that cell
        if (!this.grid[I][J].value) {
          const existingValues = new Set();
          // Check for column
          for (let i = 0; i < 9; i++) {
            const value = this.grid[i][J].value;
            if (value) {
              existingValues.add(value);
            }
          }
          // Check for row
          for (let j = 0; j < 9; j++) {
            const value = this.grid[I][j].value;
            if (value) {
              existingValues.add(value);
            }
          }
          // Check for square
          const iStart = I - (I % 3);
          const jStart = J - (J % 3);
          for (let i = iStart; i < iStart + 3; i++) {
            for (let j = jStart; j < jStart + 3; j++) {
              const value = this.grid[i][j].value;
              if (value) {
                existingValues.add(value);
              }
            }
          }

          // Remove existing values from options
          this.grid[I][J].options = this.grid[I][J].options.filter(
            (option) => !existingValues.has(option)
          );

          // If only one possibility, a new value has been found !
          if (this.grid[I][J].options.length === 1) {
            this.grid[I][J].value = this.grid[I][J].options[0];
            this.board.grid[I][J] = this.grid[I][J].value;
            this.stuck = false;
            this.foundValues++;
            if (this.foundValues === 9 * 9) {
              this.solved = true;
            }
          }
        }
      }
    }
  };
}
