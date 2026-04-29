
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DataTable from '@/components/table/DataTable';
import { useResource } from '@/core/hooks/useResource';
import { JobService } from '@/core/services/job/job.service';
import type { IJob as IItemResource } from '@/core/types/IJob';
import { formatDateTime } from '@/core/utils/dateUtils';
import { Search } from 'lucide-react';
import CreateJobForm from './CreateJobForm.tsx';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toastify } from '@/core/utils/toastify';



export default function JobList() {
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
        header: 'Title',
        render: (item: IItemResource) => <div className="font-semibold">{item.title}</div>,
        sortable: true,
      },
      {
        key: 'service_type',
        header: 'Service',
        render: (item: IItemResource) => <div>{item.service_type}</div>,
        sortable: true,
      },
      {
        key: 'location',
        header: 'Location',
        render: (item: IItemResource) => <div>{item.location}</div>,
        sortable: true,
      },
      {
        key: 'job_date',
        header: 'Job Date',
        render: (item: IItemResource) => (
          <div className="text-sm">{item.job_date ? formatDateTime(item.job_date) : 'Not defined'}</div>
        ),
        sortable: true,
      },
      {
        key: 'amount_paid',
        header: 'Amount Paid',
        render: (item: IItemResource) => <div>{item.amount_paid ?? 'N/A'}</div>,
        sortable: true,
      },
      {
        key: 'status',
        header: 'Status',
        render: (item: IItemResource) => {
          const active = item.is_active ?? (item.status ? item.status !== 'inactive' : false);
          const label = item.status
            ? item.status
                .replace('_', ' ')
                .replace('pending', 'Pending')
                .replace('in_progress', 'In Progress')
                .replace('completed', 'Completed')
                .replace('cancelled', 'Cancelled')
            : active ? 'Active' : 'Inactive';

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
        header: 'Created',
        render: (item: IItemResource) => (
          <div className="text-xs text-gray-500">{item.created_at ? formatDateTime(item.created_at) : 'N/A'}</div>
        ),
        sortable: true,
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (item: IItemResource) => (
          <div className="flex gap-2">
            <button
              className="btn btn-xs btn-warning"
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-xs btn-error"
              onClick={() => confirmDelete(item)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ];
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [editJob, setEditJob] = useState<IItemResource | null>(null);
  const [jobToDelete, setJobToDelete] = useState<IItemResource | null>(null);
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
    service: { getAllPaginated: JobService.getAllCreatorJobs },
    initialFilters: {},
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 10,
  });

  // Handlers para editar y eliminar
  const handleEdit = (job: IItemResource) => {
    setEditJob(job);
  };

  const confirmDelete = (job: IItemResource) => {
    setJobToDelete(job);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsProcessing(true);
    try {
      await JobService.remove(jobToDelete.id);
      toastify.success(`Job "${jobToDelete.title}" deleted successfully.`);
      fetchItems();
      setJobToDelete(null);
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || 'Error deleting job');
    } finally {
      setIsProcessing(false);
    }
  };

  // Actualizar filtros personalizados
  const handleCustomFilterChange = (newStatus: string, newService: string) => {
    setStatusFilter(newStatus);
    setServiceFilter(newService);
    handleFilterChange({
      ...(newStatus ? { status: newStatus } : {}),
      ...(newService ? { service_type: newService } : {}),
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
            placeholder="Search..."
            className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-36"
          value={statusFilter}
          onChange={e => handleCustomFilterChange(e.target.value, serviceFilter)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          className="input input-bordered w-36"
          placeholder="Service type"
          value={serviceFilter}
          onChange={e => handleCustomFilterChange(statusFilter, e.target.value)}
        />
      </div>
    </div>
  );

  // Solo formulario de edición, no botón de agregar
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <PageBreadcrumb pageTitle="Trabajos" />
        <CreateJobForm creatorId={null} onCreated={fetchItems} jobToEdit={editJob} onEditClosed={() => setEditJob(null)} />
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
        {jobToDelete && (
          <ConfirmDialog
            isOpen={!!jobToDelete}
            title="Delete Job"
            message={`Are you sure you want to delete the job "${jobToDelete.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setJobToDelete(null)}
            isProcessing={isProcessing}
            variant="danger"
            confirmText="Delete"
          />
        )}
      </div>
    </div>
  );
}
