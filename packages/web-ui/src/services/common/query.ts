import { FilterOption } from './filter';
import { Pagination } from './pagination';
import { SortOption } from './sort';

export interface QueryOption {
  pagination?: Pagination;
  sort?: SortOption;
  filers?: FilterOption[];
}
