import { useState } from "react";
import { Search, Plus, Trash2, RefreshCw, Pencil } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import Modal from "@/components/modal/Modal";
import { useResource } from "@/core/hooks/useResource";
import { toastify } from "@/core/utils/toastify";
import { YouTubeVideoService as ItemService } from "@/core/services/youtube/youtubeVideo.service";
import type { IYouTubeVideo } from "@/core/types/IYouTubeVideo";
import YouTubeVideoForm from "./Form";

export default function YouTubeVideosMain() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IYouTubeVideo | null>(null);
  const [dialogConfig, setDialogConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; variant: "primary" | "danger" } | null>(null);

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
  } = useResource<IYouTubeVideo>({
    service: ItemService,
    defaultSort: { key: "id", direction: "desc" },
    defaultPerPage: 10,
  });

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (item: IYouTubeVideo) => <div className="font-bold">{item.id}</div>,
      sortable: true,
    },
    {
      key: "title",
      header: "Title",
      render: (item: IYouTubeVideo) => <div className="font-semibold">{item.title || "-"}</div>,
      sortable: true,
    },
    {
      key: "youtube_url",
      header: "YouTube URL",
      render: (item: IYouTubeVideo) => (
        <a href={item.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {item.youtube_url}
        </a>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: IYouTubeVideo) => <div>{item.category || "-"}</div>,
      sortable: true,
    },
    {
      key: "topic",
      header: "Topic",
      render: (item: IYouTubeVideo) => <div>{item.topic || "-"}</div>,
      sortable: true,
    },
    {
      key: "views",
      header: "Views",
      render: (item: IYouTubeVideo) => <div>{item.views ?? 0}</div>,
      sortable: true,
    },
    {
      key: "created_at",
      header: "Created",
      render: (item: IYouTubeVideo) => <div>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</div>,
      sortable: true,
    },
  ];

  const openDialog = (title: string, message: string, onConfirm: () => void, variant: "primary" | "danger" = "primary") => {
    setDialogConfig({ isOpen: true, title, message, onConfirm, variant });
  };

  const closeDialog = () => setDialogConfig(null);

  const confirmDelete = (item: IYouTubeVideo) => {
    openDialog(
      "Confirm deletion",
      `Are you sure you want to delete the video "${item.title ?? item.youtube_url}"?`,
      () => handleDelete(item.id),
      "danger"
    );
  };

  const handleDelete = async (id: number) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(id);
      toastify.success(response?.message || "Video removed");
      fetchItems();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || "Error removing video");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (item: IYouTubeVideo) => {
        setEditingItem(item);
        setIsFormOpen(true);
      },
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Remove",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IYouTubeVideo) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-8 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          New video
        </button>
        <button
          className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 font-semibold flex items-center gap-2 rounded-xl py-3 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => fetchItems()}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search videos..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <PageBreadcrumb pageTitle="YouTube Videos" />
      </div>
      <DataTable
        data={items as IYouTubeVideo[]}
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

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit video" : "New video"}
        size="lg"
      >
        <YouTubeVideoForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            fetchItems();
            setIsFormOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>
    </div>
  );
}
