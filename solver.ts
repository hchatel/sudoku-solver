import { Board } from "./board.ts";
import { Cell, Grid, Row, Value } from "./types.ts";

type SolverCell = {
  value: Cell;
  initialValue: boolean;
  options: Value[];
};

const OPTIONS: Value[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Solver {
  grid: Grid<SolverCell>;
  board: Board;
  stuck = false;
  solved = false;
  step = 0;
  foundValues = 0;

  constructor(board: Board) {
    this.board = board;
    this.grid = this.board.grid.map(
      (row) =>
        row.map((cell) => {
          if (cell) {
            this.foundValues++;
          }

          const solverCell: SolverCell = {
            value: cell,
            initialValue: Boolean(cell),
            options: cell ? [cell] : OPTIONS,
          };

          return solverCell;
        }) as Row<SolverCell>
    ) as Grid<SolverCell>;
  }

  solve() {
    console.info("\nSolving board: ");
    this.board.display();

    while (!(this.stuck || this.solved)) {
      this.step++;
      try {
        this.solveEasy();
      } catch (e) {
        console.error(`Error: Failed to solve this grid at step ${this.step}.`);

        console.error(e);
        this.board.display();
        return;
      }
    }

    console.info(
      `\n${this.solved ? "Solved" : "Stuck"} after ${this.step} steps !`
    );
    this.display();
  }

  display() {
    const styles: string[] = [];
    console.info(
      this.grid
        .map((row) =>
          row
            .map((cell) => {
              if (!cell.value) {
                return "   ";
              }
              if (cell.initialValue) {
                return ` ${cell.value} `;
              }

              styles.push("color: green;", "color: white;");
              return ` %c${cell.value}%c `;
            })
            .join("|")
        )
        .join("\n---+---+---+---+---+---+---+---+---\n"),
      ...styles,
      "\n"
    );
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
          this.getValuesInCol(J).forEach((v) => existingValues.add(v));
          // Check for row
          this.getValuesInRow(I).forEach((v) => existingValues.add(v));
          // Check for square
          this.getValuesInSquare(I, J).forEach((v) => existingValues.add(v));

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

  private getValuesInCol(J: number): Value[] {
    const values: Value[] = [];
    for (let i = 0; i < 9; i++) {
      const value = this.grid[i][J].value;
      if (value) {
        values.push(value);
      }
    }
    if (values.length !== new Set(values).size) {
      throw new Error(
        `Wrong board, encountered twice the same number in col ${J}. (${values})`
      );
    }

    return values;
  }

  private getValuesInRow(I: number): Value[] {
    const values: Value[] = [];
    for (let j = 0; j < 9; j++) {
      const value = this.grid[I][j].value;
      if (value) {
        values.push(value);
      }
    }
    if (values.length !== new Set(values).size) {
      throw new Error(
        `Wrong board, encountered twice the same number in row ${I}. (${values})`
      );
    }

    return values;
  }

  private getValuesInSquare(I: number, J: number): Value[] {
    const values: Value[] = [];
    const iStart = I - (I % 3);
    const jStart = J - (J % 3);
    for (let i = iStart; i < iStart + 3; i++) {
      for (let j = jStart; j < jStart + 3; j++) {
        const value = this.grid[i][j].value;
        if (value) {
          values.push(value);
        }
      }
    }
    if (values.length !== new Set(values).size) {
      throw new Error(
        `Wrong board, encountered twice the same number in square (${
          iStart / 3
        }, ${jStart / 3}). (${values})`
      );
    }

    return values;
  }
}
