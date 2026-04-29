import { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DataTable from '@/components/table/DataTable';
import { useResource } from '@/core/hooks/useResource';
import { JobCreatorService } from '@/core/services/job/jobCreator.service';
import type { IJob as IItemResource } from '@/core/types/IJob';
import type { ITableAction } from '@/core/types/ITable';
import { formatDateTime } from '@/core/utils/dateUtils';
import { Search, Eye, Pencil, Trash } from 'lucide-react';
import { toastify } from '@/core/utils/toastify';
import CreateJobForm from './CreateJobForm';
import JobDetailModal from './JobDetailModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

// Servicio adaptado para useResource con resourceId (creatorId) apuntando a /v1/jobs-creator
const JobServiceByCreator = {
  getAllPaginated: async (
    creatorId: number,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: { sort?: string; order?: 'asc' | 'desc' };
      is_active?: boolean;
    },
    config?: { signal?: AbortSignal }
  ) => {
    const query = {
      id_creator: creatorId,
      search: params?.search,
      is_active: params?.is_active,
      sort_by: params?.sortBy?.sort ?? 'created_at',
      sort_dir: params?.sortBy?.order ?? 'desc',
      per_page: params?.limit ?? 10,
      page: params?.page ?? 1,
    };

    const res = await JobCreatorService.getAll(query as any, config);
    const raw = res as any;
    const data = Array.isArray(raw?.data?.data) ? raw.data.data : Array.isArray(raw?.data) ? raw.data : [];

    const pagination = raw?.meta?.pagination
      ? raw.meta.pagination
      : {
          total: raw?.total ?? data.length ?? 0,
          count: data.length ?? 0,
          per_page: raw?.per_page ?? query.per_page,
          current_page: raw?.current_page ?? query.page,
          total_pages:
            raw?.last_page ?? Math.max(1, Math.ceil((raw?.total ?? data.length ?? 0) / ((raw?.per_page ?? query.per_page) || 1))),
        };

    return {
      success: true,
      data,
      meta: { pagination },
    } as const;
  },
};

// Obtener el ID de usuario desde localStorage (robusto ante string/number)
const getUserIdFromLocalStorage = (): number | null => {
  try {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const possibleId = parsed?.id ?? parsed?.user?.id ?? parsed?.user_id ?? null;
    const numId = typeof possibleId === 'number' ? possibleId : Number(possibleId);
    return Number.isFinite(numId) ? numId : null;
  } catch {
    return null;
  }
};

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
    header: 'Job date',
    render: (item: IItemResource) => (
      <div className="text-sm">{item.job_date ? formatDateTime(item.job_date) : 'Not defined'}</div>
    ),
    sortable: true,
  },
  {
    key: 'amount_paid',
    header: 'Amount paid',
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
            .replace('in_progress', 'In progress')
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
];

export default function JobList() {
  const userId = getUserIdFromLocalStorage();
  const [viewJob, setViewJob] = useState<IItemResource | null>(null);
  const [editJob, setEditJob] = useState<IItemResource | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    fetchItems,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handleLimitChange,
    handleSearch,
  } = useResource({
    service: JobServiceByCreator,
    resourceId: userId ?? undefined,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 10,
  });

  const askDelete = (jobId: number) => {
    setDeleteTargetId(jobId);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      const res = await JobCreatorService.remove(deleteTargetId);
      if (res?.success) {
        toastify.success('Job deleted');
        fetchItems();
      } else {
        toastify.error(res?.message || 'Could not delete');
      }
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || 'Delete error');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
      setConfirmOpen(false);
    }
  };

  const actions: ITableAction<IItemResource>[] = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: IItemResource) => setViewJob(item),
      variant: 'secondary',
    },
    {
      label: 'Edit',
      icon: <Pencil className="w-4 h-4" />,
      onClick: (item: IItemResource) => setEditJob(item),
      variant: 'primary',
    },
    {
      label: 'Delete',
      icon: <Trash className="w-4 h-4" />,
      onClick: (item: IItemResource) => {
        if (deleting) return;
        askDelete(item.id);
      },
      variant: 'danger',
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search jobs, services or locations..."
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
        <PageBreadcrumb pageTitle="Jobs" />
        <CreateJobForm
          creatorId={userId}
          onCreated={fetchItems}
          jobToEdit={editJob}
          onEditClosed={() => setEditJob(null)}
        />
        <DataTable
          data={items as IItemResource[]}
          columns={columns}
          actions={actions}
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
        <JobDetailModal item={viewJob} onClose={() => setViewJob(null)} />
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Confirm deletion"
          message="Are you sure you want to delete this job? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => {
            setConfirmOpen(false);
            setDeleteTargetId(null);
            setDeleting(false);
          }}
          onConfirm={handleDelete}
          isProcessing={deleting}
          variant="danger"
        />
      </div>
    </div>
  );
}
