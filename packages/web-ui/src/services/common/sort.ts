export enum SortDirection {
  asc = 0,
  desc = 1,
}

export interface SortOption {
  orderBy: string;
  direction: SortDirection;
}
