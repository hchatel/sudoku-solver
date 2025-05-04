import { Grid, Row } from "./types.ts";

export class Board {
  grid: Grid;

  constructor(str: string) {
    const rows = str.split("\n").slice(1);

    this.grid = Array.from(
      { length: 9 },
      (_, i) =>
        Array.from({ length: 9 }, (_, j) => {
          const value = rows[i].charAt(j);
          return value === " " ? undefined : Number(value);
        }) as Row
    ) as Grid;
  }

  display() {
    console.info(
      this.grid
        .map((row) => row.map((cell) => ` ${cell ?? " "} `).join("|"))
        .join("\n---+---+---+---+---+---+---+---+---\n")
    );
  }
}
