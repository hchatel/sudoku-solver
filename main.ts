import { Board } from "./board.ts";
import { Solver } from "./solver.ts";

const board1Str = `
54  2 8 6
 19  7  3
   3  21 
9  4 5 2 
  1   6 4
6 4 32 8 
 6    19 
4 2  9  5
 9  7 4 2
`;

const board = new Board(board1Str);
const solver = new Solver(board);

solver.solve();
