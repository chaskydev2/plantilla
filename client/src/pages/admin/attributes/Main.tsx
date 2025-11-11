import { useState } from "react";
import { useTranslation } from 'react-i18next';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AttributeService as ItemService } from "@/core/services/attribute/attribute.service";
import type { IAttribute as IItemResource } from "@/core/types/IAttribute";
import { Search, Plus, Trash2, Edit, Settings, Eye } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import WithPermission from "@/components/common/WithPermission";
// TODO: Restore when permissions are enabled
// import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";

// columns and filters will be created inside component to allow translated labels

export default function AttributeList() {
  const { t } = useTranslation();

  const columns = [
    {
      key: "id",
      header: t("admin.common.id"),
      render: (item: IItemResource) => (
        <div className="flex items-center gap-3">
          <div className="font-bold text-gray-700 dark:text-gray-300">{item.id}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "name",
      header: t("admin.common.name"),
      render: (item: IItemResource) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">/{item.slug}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "required_for",
      header: t("admin.attributes.requiredFor"),
      render: (item: IItemResource) => {
        const getRequiredForBadge = (requiredFor: string) => {
          switch (requiredFor) {
            case 'homeowner':
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t("admin.attributes.requiredForOptions.homeowner")}
                </span>
              );
            case 'contractor':
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {t("admin.attributes.requiredForOptions.contractor")}
                </span>
              );
            case 'both':
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t("admin.attributes.requiredForOptions.both")}
                </span>
              );
            default:
              return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  {t("admin.common.unknown")}
                </span>
              );
          }
        };

        return (
          <div className="flex items-center">
            {getRequiredForBadge(item.required_for)}
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "description",
      header: t("admin.common.description"),
      render: (item: IItemResource) => (
        <div className="max-w-xs">
          <div className="text-gray-700 dark:text-gray-300 truncate" title={item.description || undefined}>
            {item.description || (
              <span className="text-gray-400 italic">{t("admin.attributes.noDescription")}</span>
            )}
          </div>
        </div>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: t("admin.attributes.createdDate"),
      render: (item: IItemResource) => {
        const createdAt = (item as any).created_at;
        const formatted = createdAt
          ? new Date(createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : null;

        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatted ?? <span className="text-gray-400 italic">—</span>}
          </div>
        );
      },
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

  // Debug: Agregar console.log para ver qué datos estamos recibiendo
  console.log("Debug - Items:", items);
  console.log("Debug - Loading:", loading);
  console.log("Debug - Pagination:", pagination);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [viewItem, setViewItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  // TODO: Restore when permissions are enabled
  // const { hasPermission } = useAuth();

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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const handleView = (item: IItemResource) => {
    setViewItem(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item: IItemResource) => {
    console.log("Debug - handleEdit called with:", item);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      t("admin.common.confirmDelete"),
      t("admin.attributes.confirmDeleteMessage", { name: item.name }),
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      console.log("Attempting to delete attribute with ID:", item.id);
      const response = await ItemService.remove(item.id);
      
      if (response.success) {
        toastify.success(response.message || t("admin.attributes.deleteSuccess"));
        fetchItems();
      } else {
        // El servicio retornó success: false, mostrar el mensaje de error
        toastify.error(response.message || t("admin.attributes.deleteError"));
      }
    } catch (error: any) {
      console.error("Error deleting attribute:", error);
      
      // Mostrar el error real del servidor si está disponible
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          t("admin.attributes.deleteError");
      
      toastify.error(errorMessage);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: t("admin.common.view"),
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleView(item),
      variant: "secondary" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("attribute_ver"),
    },
    {
      label: t("admin.common.edit"),
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("attribute_editar"),
    },
    {
      label: t("admin.common.delete"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("attribute_eliminar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
          <button
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold flex items-center gap-3 rounded-xl py-3 px-8 hover:from-purple-700 hover:to-purple-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            {t("admin.attributes.createNew")}
          </button>
        <WithPermission permissions={[]}> {/* TODO: Restore permissions={["attribute_crear"]} */}
          
        </WithPermission>
        
        {/* Additional action button */}
        <WithPermission permissions={[]}> {/* TODO: Restore permissions={["attribute_crear"]} */}
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold flex items-center gap-3 rounded-xl py-3 px-8 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Settings className="w-5 h-5" />
            {t("admin.attributes.addAttribute")}
          </button>
        </WithPermission>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={t("admin.attributes.searchPlaceholder")}
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-xl"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle={t("admin.sidebar.attributes")} />
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
        mode={currentItem ? "edit" : "create"}
      />
      
      {/* View Form Modal */}
      <Form
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewItem(null);
        }}
        initialData={viewItem}
        load={fetchItems}
        mode="view"
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
            dialogConfig.variant === "danger" ? t("admin.common.delete") : t("admin.common.confirmText")
          }
        />
      )}
    </div>
  );
}