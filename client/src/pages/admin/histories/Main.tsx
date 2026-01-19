import { useState } from "react";
import { useTranslation } from 'react-i18next';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { HistoryService as ItemService } from '@/core/services/history/history.service';
import type { IHistory as IItemResource } from "@/core/types/IHistory";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";

// columns moved inside component so they can use translations

export default function HistoryList() {
  const { t } = useTranslation();

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  function getBannerImageUrl(image?: string | null): string {
    if (!image) return 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2000&auto=format&fit=crop';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_BASE}/${image.replace(/^\/?api(\/|$)/, '')}`;
  }

  const columns = [
    {
      key: "id",
      header: t("admin.common.id"),
      render: (item: IItemResource) => (
        <div className="flex items-center gap-3">
          <div className="font-bold">{item.id}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "title",
      header: t("admin.histories.title"),
      render: (item: IItemResource) => (
        <div className="font-bold">{item.title}</div>
      ),
      sortable: true,
    },
    {
      key: "content",
      header: t("admin.histories.content"),
      render: (item: IItemResource) => (
        <div className="font-bold">{item.content}</div>
      ),
      sortable: true,
    },
    {
      key: "banner1",
      header: t("admin.histories.banner1"),
      render: (item: IItemResource) =>
        item.banner1 ? (
          <img
            src={getBannerImageUrl(item.banner1)}
            alt={item.title}
            className="w-10 h-10 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">{t("admin.common.noData")}</span>
        ),
    },
    {
      key: "banner2",
      header: t("admin.histories.banner2"),
      render: (item: IItemResource) =>
        item.banner2 ? (
          <img
            src={getBannerImageUrl(item.banner2)}
            alt={item.title}
            className="w-10 h-10 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">{t("admin.common.noData")}</span>
        ),
    },
    {
      key: "banner3",
      header: t("admin.histories.banner3"),
      render: (item: IItemResource) =>
        item.banner3 ? (
          <img
            src={getBannerImageUrl(item.banner3)}
            alt={item.title}
            className="w-10 h-10 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">{t("admin.common.noData")}</span>
        ),
    },
  ];
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
    defaultSort: { key: "id", direction: "asc" },
    defaultPerPage: 5,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  const { hasPermission } = useAuth();

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

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      t("admin.common.confirmDelete"),
      t("admin.histories.confirmDeleteMessage", { title: item.title }),
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || t("admin.histories.deleteSuccess"));
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar la historia:", error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: t("admin.common.edit"),
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        item.id && hasPermission("historia_editar"),
    },
    {
      label: t("admin.common.delete"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) =>
        item.id && hasPermission("historia_eliminar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {
          ( hasPermission('historia_crear') && items.length == 0 ) &&
          <button
            className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
              {t("admin.common.add")}
          </button>
        }
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={t("admin.common.search")}
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
  <PageBreadcrumb pageTitle={t("admin.sidebar.history")} />
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
      <Form
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
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
          confirmText={
            dialogConfig.variant === "danger" ? t("admin.common.delete") : t("admin.common.restore")
          }
        />
      )}
    </div>
  );
}
