import React, { useState } from 'react';
import { JobPostForm } from './form';
import type { JobPostFormValues } from './form';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Search } from 'lucide-react';
import { useResource } from '@/core/hooks/useResource';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toastify } from '@/core/utils/toastify';
import DataTable from '@/components/table/DataTable';
import { jobPostService } from '@/core/services/job-posts/jobPost.service';
import { formatDateTime } from '@/core/utils/dateUtils';

const JobPostsAdmin: React.FC = () => {
  const ItemService = jobPostService;

  const [statusFilter, setStatusFilter] = useState('');
  const [jobPostToDelete, setJobPostToDelete] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    fetchItems,
  } = useResource({
    service: ItemService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 10,
  });

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="font-bold">{item.id}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'title',
      header: 'Título',
      render: (item: any) => <div className="font-semibold">{item.title}</div>,
      sortable: true,
    },
    {
      key: 'homeowner_id',
      header: 'ID Propietario',
      render: (item: any) => <div>{item.homeowner_id}</div>,
      sortable: true,
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (item: any) => (
        <div className="max-w-xs truncate">{item.description}</div>
      ),
      sortable: true,
    },
    {
      key: 'deadline',
      header: 'Fecha Límite',
      render: (item: any) => (
        <div className="text-sm">
          {item.deadline ? formatDateTime(item.deadline) : 'No definida'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'price',
      header: 'Precio',
      render: (item: any) => <div>{item.price ?? 'N/A'}</div>,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item: any) => {
        const status = item.status || 'open';
        const badge =
          status === 'closed'
            ? 'badge-error'
            : status === 'open'
            ? 'badge-success'
            : 'badge-secondary';

        const label = status === 'open' ? 'Abierto' : status === 'closed' ? 'Cerrado' : status;

        return <span className={`badge ${badge}`}>{label}</span>;
      },
      sortable: true,
    },
    {
      key: 'created_at',
      header: 'Creado',
      render: (item: any) => (
        <div className="text-xs text-gray-500">
          {item.created_at ? formatDateTime(item.created_at) : 'N/A'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: any) => (
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-error"
            onClick={() => confirmDelete(item)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const confirmDelete = (jobPost: any) => {
    setJobPostToDelete(jobPost);
  };

  const handleDelete = async () => {
    if (!jobPostToDelete) return;
    setIsProcessing(true);
    try {
      await ItemService.remove(jobPostToDelete.id);
      toastify.success(`Trabajo "${jobPostToDelete.title}" eliminado exitosamente.`);
      fetchItems();
      setJobPostToDelete(null);
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || 'Error al eliminar el trabajo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    handleFilterChange({
      ...(newStatus ? { status: newStatus } : {}),
    });
  };

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 w-full">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
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
        <select
          className="select select-bordered w-36"
          value={statusFilter}
          onChange={(e) => handleCustomFilterChange(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          <option value="open">Abierto</option>
          <option value="closed">Cerrado</option>
        </select>
      </div>
    </div>
  );

  const handleSubmit = async (_data: JobPostFormValues) => {
    setIsProcessing(true);
    try {
      toastify.success('Trabajo creado exitosamente');
      fetchItems();
    } catch (error) {
      toastify.error('Error al crear el trabajo');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <PageBreadcrumb pageTitle="Trabajos" />
        <JobPostForm 
          onSubmit={handleSubmit} 
          loading={isProcessing}
        />
        <DataTable
          data={items}
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
        {jobPostToDelete && (
          <ConfirmDialog
            isOpen={!!jobPostToDelete}
            title="Eliminar Trabajo"
            message={`¿Estás seguro que deseas eliminar el trabajo "${jobPostToDelete.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setJobPostToDelete(null)}
            isProcessing={isProcessing}
            variant="danger"
            confirmText="Eliminar"
          />
        )}
      </div>
    </div>
  );
};

export default JobPostsAdmin;
