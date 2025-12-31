import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ServiceService as ItemService } from "@/core/services/service/service.service";
import type { IService as IItemResource } from "@/core/types/IService";
import { Search, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import DataTable from "@/components/table/DataTable";

export default function ServiceList() {
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (item: IItemResource) => (
        <div className="font-bold">{item?.id ?? "-"}</div>
      ),
      sortable: true,
    },
    {
      key: "name",
      header: "Nombre",
      render: (item: IItemResource) => <div className="font-semibold">{item?.name ?? "-"}</div>,
      sortable: true,
    },
    {
      key: "slug",
      header: "Slug",
      render: (item: IItemResource) => (
        <span className="font-mono text-sm text-gray-600 dark:text-gray-300">{item?.slug ?? "-"}</span>
      ),
      sortable: true,
    },
    {
      key: "icon",
      header: "Icono",
      render: (item: IItemResource) => {
        const src = item?.icon;
        if (!src) return <span className="text-gray-500">-</span>;
        const resolved = src.startsWith("http") ? src : `${import.meta.env.VITE_API_URL ?? ''}/${src}`;
        return (
          <div className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <img src={resolved} alt={item?.name || "icon"} className="h-full w-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            <ImageIcon className="w-4 h-4 text-gray-400 absolute" />
          </div>
        );
      },
    },
    {
      key: "image",
      header: "Imagen",
      render: (item: IItemResource) => {
        const src = item?.image;
        if (!src) return <span className="text-gray-500">-</span>;
        const resolved = src.startsWith("http") ? src : `${import.meta.env.VITE_API_URL ?? ''}/${src}`;
        return (
          <div className="h-12 w-16 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={resolved}
              alt={item?.name || "image"}
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <ImageIcon className="w-4 h-4 text-gray-400 absolute" />
          </div>
        );
      },
    },
    {
      key: "created_at",
      header: "Creado",
      render: (item: IItemResource) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {item?.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
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

  const closeDialog = () => setDialogConfig(null);

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirmar eliminación",
      `¿Seguro que deseas eliminar el servicio "${item.name}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Servicio eliminado");
      fetchItems();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || "Error al eliminar servicio");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Agregar servicio
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar servicios..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Servicios" />
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
          confirmText={dialogConfig.variant === "danger" ? "Eliminar" : "Confirmar"}
        />
      )}
    </div>
  );
}
