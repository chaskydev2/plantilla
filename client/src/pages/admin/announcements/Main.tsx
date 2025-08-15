import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AnnouncementService as ItemService } from "@/core/services/announcement/announcement.service";
import type { IAnnouncement as IItemResource } from "@/core/types/IAnnouncement";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import WithPermission from "@/components/common/WithPermission";
import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";
import { formatDateTime } from "@/core/utils/dateUtils";
import { ANNOUNCEMENT_TYPES } from '@/core/constants';

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold">{item.id}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "title",
    header: "Título",
    render: (item: IItemResource) => (
      <div className="font-bold">{item.title}</div>
    ),
    sortable: true,
  },
  {
    key: "type",
    header: "Tipo",
    render: (item: IItemResource) => (
      <span className="badge badge-info">
        {ANNOUNCEMENT_TYPES[item.type as keyof typeof ANNOUNCEMENT_TYPES] || item.type}
      </span>
    ),
    sortable: true,
  },
  {
    key: "content",
    header: "Contenido",
    render: (item: IItemResource) => (
      <div className="max-w-xs truncate" title={item.content}>
        {item.content}
      </div>
    ),
  },
  {
    key: "dates",
    header: "Fechas",
    render: (item: IItemResource) => (
      <div className="flex flex-col">
        <span className="text-sm">
          <strong>Inicio:</strong> {formatDateTime(item.start_date)}
        </span>
        <span className="text-sm">
          <strong>Visible hasta:</strong> {formatDateTime(item.visible_until)}
        </span>
      </div>
    ),
  },
  {
    key: "image",
    header: "Imagen",
    render: (item: IItemResource) => (
      item.image ? (
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-10 h-10 object-cover rounded-md"
        />
      ) : (
        <span className="text-gray-400">Sin imagen</span>
      )
    ),
  },
];

export default function AnnouncementList() {
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
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar al usuario ${item.title}?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Item eliminado");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar comunicado:", error);
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
      show: (item: IItemResource) =>
        item.id && hasPermission("comunicado_editar"),
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) =>
        item.id && hasPermission("comunicado_eliminar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <WithPermission permissions={["comunicado_crear"]}>
          <button
            className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        </WithPermission>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar comunicados..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        /> 
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Comunicados" />
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
          confirmText={dialogConfig.variant === "danger" ? "Eliminar" : "Restaurar"}
        />
      )}
    </div>
  );
}
