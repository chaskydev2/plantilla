import React from 'react';
import DataTable from '@/components/table/DataTable';
import type { AttributeHomeowner } from '@/pages/admin/attribute-homeowner/types';

type WithRelations = AttributeHomeowner & {
  attribute?: { id?: number; name?: string } | null;
  homeowner?: { id?: number; user?: { id?: number; name?: string } | null } | null;
};

interface AttributeHomeownerTableProps {
  items: WithRelations[];
  columns: import('@/core/types/ITable').ITableColumn<WithRelations>[];
  actions: import('@/core/types/ITable').ITableAction<WithRelations>[];
  sort: any;
  onSortChange: (sort: any) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  onSearch: (query: string) => void;
  pagination: any;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  loading: boolean;
  renderTopToolbar: () => React.ReactElement;
}

const h = React.createElement;

const AttributeHomeownerTable: React.FC<AttributeHomeownerTableProps> = ({
  items,
  columns,
  actions,
  sort,
  onSortChange,
  onFilterChange,
  onSearch,
  pagination,
  onPageChange,
  onLimitChange,
  loading,
  renderTopToolbar,
}) => {
  const dataTableProps: import('@/core/types/ITable').ITableProps<WithRelations> = {
    data: items,
    columns,
    actions,
    sort,
    onSortChange,
    onFilterChange,
    onSearch,
    pagination,
    onPageChange,
    onLimitChange,
    availableLimits: [10, 20, 50],
    loading,
    renderTopToolbar,
  };

  return h(DataTable as React.FC<typeof dataTableProps>, dataTableProps);
};

export default AttributeHomeownerTable;
