import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { SocialNetworkService as ItemService } from '@/core/services/social-network/social-network.service';
import type { ISocialNetwork as IItemResource } from "@/core/types/ISocialNetwork";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => <span>{item.id}</span>,
    sortable: true,
  },
  {
    key: "url_facebook",
    header: "Facebook",
    render: (item: IItemResource) =>
      item.url_facebook ? (
        <a
          href={item.url_facebook ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {item.url_facebook}
        </a>
      ) : (
        "-"
      ),
  },
  {
    key: "url_twitter",
    header: "Twitter",
    render: (item: IItemResource) =>
      item.url_twitter ? (
        <a
          href={item.url_twitter ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {item.url_twitter}
        </a>
      ) : (
        "-"
      ),
  },
  {
    key: "url_instagram",
    header: "Instagram",
    render: (item: IItemResource) =>
      item.url_instagram ? (
        <a
          href={item.url_instagram ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 underline"
        >
          {item.url_instagram}
        </a>
      ) : (
        "-"
      ),
  },
  {
    key: "url_tiktok",
    header: "TikTok",
    render: (item: IItemResource) =>
      item.url_tiktok ? (
        <a
          href={item.url_tiktok ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 underline"
        >
          {item.url_tiktok}
        </a>
      ) : (
        "-"
      ),
  },
  {
    key: "url_linkedin",
    header: "LinkedIn",
    render: (item: IItemResource) =>
      item.url_linkedin ? (
        <a
          href={item.url_linkedin ?? ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-800 underline"
        >
          {item.url_linkedin}
        </a>
      ) : (
        "-"
      ),
  },
];


export default function SocialNetworkList() {
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
    setDialogConfig({ isOpen: true, title, message, onConfirm, variant });
  };

  const closeDialog = () => setDialogConfig(null);

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirmar eliminación",
      `¿Deseas eliminar este registro de redes sociales?`,
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
      console.error("Error al eliminar:", error);
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
    show: (item: IItemResource) => !!item.id && hasPermission("red_social_editar"),
  },
  {
    label: "Eliminar",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (item: IItemResource) => confirmDelete(item),
    variant: "danger" as const,
    show: (item: IItemResource) => !!item.id && hasPermission("red_social_eliminar"),
  },
];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        {hasPermission("red_social_crear") && items.length === 0 && (
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
        )}
      </div>
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
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Redes Sociales" />
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
