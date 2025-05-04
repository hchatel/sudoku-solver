export type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Cell = Value | undefined;
export type Row<T = Cell> = [T, T, T, T, T, T, T, T, T];
export type Grid<T = Cell> = [
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>,
  Row<T>
];
