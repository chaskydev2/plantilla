import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DataTable from '@/components/table/DataTable';
import { useResource } from '@/core/hooks/useResource';
import { JobService as ItemService } from '@/core/services/job/job.service';
import type { IJob as IItemResource } from '@/core/types/IJob';
import { formatDateTime } from '@/core/utils/dateUtils';
import { Search } from 'lucide-react';

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold">{item.id}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'title',
    header: 'Título',
    render: (item: IItemResource) => <div className="font-semibold">{item.title}</div>,
    sortable: true,
  },
  {
    key: 'service_type',
    header: 'Servicio',
    render: (item: IItemResource) => <div>{item.service_type}</div>,
    sortable: true,
  },
  {
    key: 'location',
    header: 'Ubicación',
    render: (item: IItemResource) => <div>{item.location}</div>,
    sortable: true,
  },
  {
    key: 'job_date',
    header: 'Fecha de trabajo',
    render: (item: IItemResource) => (
      <div className="text-sm">{item.job_date ? formatDateTime(item.job_date) : 'Sin definir'}</div>
    ),
    sortable: true,
  },
  {
    key: 'amount_paid',
    header: 'Monto pagado',
    render: (item: IItemResource) => <div>{item.amount_paid ?? 'N/D'}</div>,
    sortable: true,
  },
  {
    key: 'status',
    header: 'Estado',
    render: (item: IItemResource) => {
      const active = item.is_active ?? (item.status ? item.status !== 'inactive' : false);
      const label = item.status
        ? item.status
            .replace('_', ' ')
            .replace('pending', 'Pendiente')
            .replace('in_progress', 'En progreso')
            .replace('completed', 'Completado')
            .replace('cancelled', 'Cancelado')
        : active ? 'Activo' : 'Inactivo';

      const badge = item.status === 'completed'
        ? 'badge-success'
        : item.status === 'in_progress'
        ? 'badge-warning'
        : item.status === 'cancelled'
        ? 'badge-error'
        : active
        ? 'badge-success'
        : 'badge-secondary';

      return <span className={`badge ${badge}`}>{label}</span>;
    },
    sortable: true,
  },
  {
    key: 'created_at',
    header: 'Creado',
    render: (item: IItemResource) => (
      <div className="text-xs text-gray-500">{item.created_at ? formatDateTime(item.created_at) : 'N/D'}</div>
    ),
    sortable: true,
  },
];

export default function JobList() {
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
    defaultPerPage: 10,
  });

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <PageBreadcrumb pageTitle="Trabajos" />
        <DataTable
          data={items as IItemResource[]}
          columns={columns}
          actions={[]}
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
      </div>
    </div>
  );
}
