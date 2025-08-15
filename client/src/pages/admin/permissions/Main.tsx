import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { PermissonService as ItemService } from "@/core/services/permission/permission.service";
import type { IPermissionResponse as IItemResource } from "@/core/types/IPermission";
import { Search } from 'lucide-react';
import { useResource } from "@/core/hooks/useResource";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IItemResource) => (
      <div className="font-semibold text-gray-700 dark:text-gray-300">{item.id}</div>
    ),
    sortable: true,
  },
  {
    key: 'name',
    header: 'Nombre',
    render: (item: IItemResource) => (
      <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
    ),
    sortable: true,
  },
];

export default function PermissionList() {
  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handleLimitChange,
    handleSearch,
  } = useResource({
    service: ItemService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
  });

  const renderToolbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Permisos" />
      <DataTable
          data={items as IItemResource[]}
          columns={columns}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          availableLimits={[5, 10, 20, 50]}
          loading={loading}
          renderTopToolbar={renderToolbar}
        />
    </>
  );
}
