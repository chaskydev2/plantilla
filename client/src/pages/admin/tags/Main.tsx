import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TagService as ItemService } from "@/core/services/tag/tag.service";
import type { ITag as IItemResource } from "@/core/types/ITag";
import { Search, Plus, Trash2, Edit, Tag } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Form from "./form.tsx";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
// import useAuth from "@/core/hooks/useAuth"; // TODO: Descomentar cuando se configuren los permisos
import DataTable from "@/components/table/DataTable";

// Columns are created inside the component to allow translated labels
// columns will be created inside component to allow translated labels

export default function TagList() {
  const { t } = useTranslation();

  // Define columns with translated headers
  const columns = [
    {
      key: "id",
      header: t('admin.common.id'),
      render: (item: IItemResource) => (
        <div className="flex items-center gap-3">
          <div className="font-bold">{item?.id || '-'}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "name",
      header: t('admin.common.name'),
      render: (item: IItemResource) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-bold">{item?.name || '-'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "slug",
      header: t('admin.tags.slug'),
      render: (item: IItemResource) => (
        <div className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {item?.slug || '-'}
        </div>
      ),
      sortable: true,
    },
    {
      key: "created_at",
      header: t('admin.tags.createdDate'),
      render: (item: IItemResource) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {item?.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '-'}
        </div>
      ),
      sortable: true,
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
    defaultSort: { key: "name", direction: "asc" },
    defaultPerPage: 10,
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

  // const { hasPermission } = useAuth(); // TODO: Descomentar cuando se configuren los permisos

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
      t('admin.common.confirmDelete'),
      t('admin.tags.confirmDeleteMessage', { name: item.name }),
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || t('admin.tags.deleteSuccess'));
      fetchItems();
    } catch (error: any) {
      console.error("Error al eliminar la etiqueta:", error);
      toastify.error(error.response?.data?.message || t('admin.tags.deleteError'));
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: t('admin.common.edit'),
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true, // hasPermission("etiqueta_editar") - TODO: Agregar permisos
    },
    {
      label: t('admin.common.delete'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true, // hasPermission("etiqueta_eliminar") - TODO: Agregar permisos
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {/* hasPermission("etiqueta_crear") && */ true && (
          <button
            className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            {t('admin.tags.addTag')}
          </button>
        )}
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={t('admin.tags.searchPlaceholder')}
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle={t('admin.sidebar.tags')} />
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
        availableLimits={[10, 20, 50, 100]}
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
          confirmText={dialogConfig.variant === "danger" ? t('admin.common.delete') : t('admin.common.confirmText')}
        />
      )}
    </div>
  );
}
