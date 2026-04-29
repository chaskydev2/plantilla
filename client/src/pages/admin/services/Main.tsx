import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ServiceService as ItemService } from "@/core/services/service/service.service";
import type { IService as IItemResource } from "@/core/types/IService";
import type { IProfession } from "@/core/types/IProfession";
import { Search, Plus, Trash2, Edit, Eye, Image as ImageIcon } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import DataTable from "@/components/table/DataTable";
import Modal from "@/components/modal/Modal";

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
      header: "Name",
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
      header: "Icon",
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
      header: "Image",
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
      header: "Created",
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
  const [profModalOpen, setProfModalOpen] = useState(false);
  const [profLoading, setProfLoading] = useState(false);
  const [profError, setProfError] = useState<string | null>(null);
  const [profItems, setProfItems] = useState<IProfession[]>([]);
  const [profServiceName, setProfServiceName] = useState<string>("");
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

  const handleViewProfessions = async (item: IItemResource) => {
    setProfServiceName(item.name || "");
    setProfModalOpen(true);
    setProfLoading(true);
    setProfError(null);
    try {
      const res = await ItemService.getProfessionsByService(item.id);
      setProfItems((res.data as IProfession[]) || []);
    } catch {
      setProfError("Could not load professions for this service");
      setProfItems([]);
    } finally {
      setProfLoading(false);
    }
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirm deletion",
      `Are you sure you want to delete the service "${item.name}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Service deleted");
      fetchItems();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || "Error deleting service");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "View professions",
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleViewProfessions(item),
      variant: "secondary" as const,
      show: () => true,
    },
    {
      label: "Delete",
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
          Add service
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search services..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Services" />
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

      {profModalOpen && (
        <Modal
          isOpen
          onClose={() => setProfModalOpen(false)}
          title={`Professions of ${profServiceName || "service"}`}
          size="lg"
        >
          <div className="space-y-3">
            {profLoading && <div className="text-sm text-gray-500">Loading professions...</div>}
            {profError && !profLoading && <div className="text-sm text-red-600">{profError}</div>}
            {!profLoading && !profError && profItems.length === 0 && (
              <div className="text-sm text-gray-500">No professions associated with this service.</div>
            )}
            {!profLoading && !profError && profItems.length > 0 && (
              <ul className="divide-y divide-gray-200 max-h-80 overflow-auto">
                {profItems.map((p) => (
                  <li key={p.id} className="py-2">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">/{p.slug}</div>
                    {p.description && <div className="text-sm text-gray-700 mt-1 line-clamp-2">{p.description}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal>
      )}
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
