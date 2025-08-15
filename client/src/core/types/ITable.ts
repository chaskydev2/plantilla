import type { IPagination } from "./IApi";

export interface ITableColumn<T = any> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface ITableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  show?: (item: T) => boolean;
}

export interface ITableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface ITableSort {
  key: string;
  direction: "asc" | "desc";
}

export interface ITableProps<T = any> {
  data: T[];
  columns: ITableColumn<T>[];
  actions?: ITableAction<T>[];
  filters?: ITableFilter[];
  sort?: ITableSort;
  onSortChange?: (sort: ITableSort) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSearch?: (query: string) => void;
  pagination?: IPagination;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  availableLimits?: number[];
  loading?: boolean;
  title?: string;
  showCheckboxes?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  renderTopToolbar?: () => React.ReactNode;
  renderBottomToolbar?: () => React.ReactNode;
  initialSelectedItems?: T[];
  rowIdentifier?: keyof T;
}
