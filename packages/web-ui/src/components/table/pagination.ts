import { create } from 'zustand';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export const usePaginationStore = create<PaginationState>(set => ({
  pageIndex: 0,
  pageSize: 10,
  setPagination: pagination => set(pagination),
}));
