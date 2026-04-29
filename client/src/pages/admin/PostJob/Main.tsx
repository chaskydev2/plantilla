import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Search, Trash2, Edit } from "lucide-react";
import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";

import Form from "./Form";
import { getAllJobPosts, deleteJobPostById } from '@/core/services/jobPost.service';

// Get API base URL from env
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
// Custom hook for pagination, sorting, and search
function useJobPostResource() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10, total: 0 });
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'id', direction: 'desc' });
  const [searchInput, setSearchInput] = useState('');

  const fetchItems = async (opts?: { page?: number; perPage?: number; sort?: any; search?: string }) => {
    setLoading(true);
    try {
      // Use admin API to get all job posts
      const data = await getAllJobPosts();
      let filtered = data.data || [];
      if (opts?.search) {
        const s = opts.search.toLowerCase();
        filtered = filtered.filter((item: any) =>
          item.title?.toLowerCase().includes(s) ||
          item.description?.toLowerCase().includes(s) ||
          item.city?.toLowerCase().includes(s)
        );
      }
      if (opts?.sort) {
        filtered = [...filtered].sort((a, b) => {
          const dir = opts.sort.direction === 'asc' ? 1 : -1;
          if (a[opts.sort.key] < b[opts.sort.key]) return -1 * dir;
          if (a[opts.sort.key] > b[opts.sort.key]) return 1 * dir;
          return 0;
        });
      }
      const page = opts?.page || pagination.page;
      const perPage = opts?.perPage || pagination.perPage;
      const total = filtered.length;
      const paged = filtered.slice((page - 1) * perPage, page * perPage);
      setItems(paged);
      setPagination({ page, perPage, total });
    } catch (err) {
      setItems([]);
      setPagination({ page: 1, perPage: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems({ page: 1, perPage: pagination.perPage, sort, search: searchInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchItems({ page, perPage: pagination.perPage, sort, search: searchInput });
  };
  const handleLimitChange = (perPage: number) => {
    fetchItems({ page: 1, perPage, sort, search: searchInput });
  };
  const handleSortChange = (sort: any) => {
    setSort(sort);
    fetchItems({ page: 1, perPage: pagination.perPage, sort, search: searchInput });
  };
  const handleSearch = (value: string) => {
    setSearchInput(value);
    fetchItems({ page: 1, perPage: pagination.perPage, sort, search: value });
  };

  return {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  };
}

// JobPost data type simulation
export type JobPost = {
  id: number;
  homeowner_id: number;
  service_id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  price: number;
  currency: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state_code: string;
  postal_code: string;
  lat: number;
  lng: number;
  image_path: string;
  service?: { name: string };
  homeowner?: any;
};

export default function JobPostList() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<JobPost | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  // Resource hook for pagination, sorting, search
  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useJobPostResource();

  const columns = [
    { key: "id", header: "ID", render: (item: JobPost) => <div>{item.id}</div>, sortable: true },
    { key: "title", header: "Title", render: (item: JobPost) => <div>{item.title}</div>, sortable: true },
    { key: "description", header: "Description", render: (item: JobPost) => <div>{item.description}</div>, sortable: true },
    { key: "service", header: "Service", render: (item: JobPost) => <div>{item.service?.name}</div>, sortable: true },
    { key: "deadline", header: "Deadline", render: (item: JobPost) => (
      <div>{item.deadline ? new Date(item.deadline).toLocaleDateString() : '-'}</div>
    ), sortable: true },
    { key: "status", header: "Status", render: (item: JobPost) => <div>{item.status}</div>, sortable: true },
    { key: "price", header: "Price", render: (item: JobPost) => <div>{item.price} {item.currency}</div>, sortable: true },
    { key: "address_line1", header: "Address", render: (item: JobPost) => <div>{item.address_line1} {item.address_line2}</div>, sortable: false },
    { key: "city", header: "City", render: (item: JobPost) => <div>{item.city}</div>, sortable: true },
    { key: "image_path", header: "Image", render: (item: JobPost) => {
      let src = item.image_path || '';
      if (src && !src.startsWith('http') && !src.startsWith('https')) {
        // Remove leading slash if present
        src = src.startsWith('/') ? src.slice(1) : src;
        src = `${API_BASE_URL.replace(/\/$/, '')}/${src}`;
      }
      return src ? (
        <img src={src} alt={item.title} width={50} style={{ maxHeight: 50, objectFit: 'contain', borderRadius: 6, boxShadow: '0 1px 4px #0001' }} />
      ) : null;
    }, sortable: false },
  ];

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "primary" | "danger" = "primary"
  ) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleEdit = (item: JobPost) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Only close modal and reset currentItem, do not refresh table
  const handleFormClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const confirmDelete = (item: JobPost) => {
    openDialog(
      "Delete Post",
      `Are you sure you want to delete the post "${item.title}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: JobPost) => {
    setIsProcessing(true);
    try {
      const res = await deleteJobPostById(item.id);
      if (res.success) {
        toastify.success(res.message || `Post "${item.title}" deleted successfully.`);
        // Always refresh table after delete, reset to first page
        await fetchItems({ page: 1, perPage: pagination.perPage, sort, search: searchInput });
      } else {
        toastify.error(res.message || 'Error deleting post.');
      }
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || 'Error deleting post.');
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: JobPost) => handleEdit(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: JobPost) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true,
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
          placeholder="Search..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  // Adapt pagination to IPagination interface expected by DataTable
  const adaptedPagination = {
    count: items.length,
    per_page: pagination.perPage,
    current_page: pagination.page,
    total: pagination.total,
    total_pages: Math.ceil(pagination.total / pagination.perPage) || 1,
    // ...other fields if needed
  };

  return (
    <div className="mx-auto px-2 md:px-6 py-4">
      <PageBreadcrumb pageTitle="Job Posts" />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-2 md:p-6 max-w-full">
        <div className="w-full max-w-full overflow-x-auto">
          <div className="min-w-full">
            <DataTable
              data={items}
              columns={columns}
              actions={actions}
              sort={sort}
              onSortChange={handleSortChange}
              pagination={adaptedPagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              availableLimits={[10, 20, 50, 100]}
              loading={loading}
              renderTopToolbar={renderToolbar}
            />
          </div>
        </div>
      </div>
      <Form
        isOpen={isModalOpen}
        onClose={handleFormClose}
        initialData={currentItem}
        load={fetchItems}
      />
      {dialogConfig && (
        <ConfirmDialog
          isOpen={dialogConfig.isOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          onConfirm={dialogConfig.onConfirm}
          onCancel={closeDialog}
          isProcessing={isProcessing}
          variant={dialogConfig.variant}
          confirmText={dialogConfig.variant === "danger" ? "Delete" : "Confirm"}
        />
      )}
    </div>
  );
}
