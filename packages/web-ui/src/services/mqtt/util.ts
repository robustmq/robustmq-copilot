import { QueryOptions, Pagination, Sorting, Filter, OrderDirection } from '@mbpb/admin_pb';
import { QueryOption } from '../common';

export const getQueryOptions = (query?: QueryOption): QueryOptions => {
  const options = new QueryOptions();
  if (query) {
    const { pagination, sort, filers } = query;
    if (pagination) {
      const page = new Pagination();
      page.setLimit(pagination.limit);
      page.setOffset(pagination.offset);
      options.setPagination(page);
    }
    if (sort) {
      const s = new Sorting();
      s.setOrderBy(sort.orderBy);
      s.setDirection(sort.direction as unknown as OrderDirection);
      options.setSorting(s);
    }
    if (filers) {
      const filterList = filers.map(filter => {
        const f = new Filter();
        f.setField(filter.field);
        f.setValuesList(filter.valueList);
        f.setExactMatch(filter.exactMatch ? 0 : 1);
        return f;
      });
      options.setFiltersList(filterList);
    }
  }
  return options;
};
