import { TagValue } from '@/components/tag-search-box';

export interface FilterValue {
  field: string;
  valueList: string[];
  exactMatch?: boolean;
}

export const convertTagToSearchValue = (tagFilters: TagValue[]): FilterValue[] => {
  return tagFilters.map(tag => ({
    field: tag.attr?.key ?? '',
    valueList: tag.values?.map(v => v.name) ?? [],
    exactMatch: false,
  }));
};
