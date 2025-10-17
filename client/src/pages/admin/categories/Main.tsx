import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { CategoryService as ItemService } from "@/core/services/category/category.service";
import type { ICategory as IItemResource } from "@/core/types/ICategory";
import { isParentCategory, hasChildren } from "@/core/types/ICategory";
import { Search, Plus, Trash2, Edit, FolderTree, Eye, Folder, FolderOpen } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import WithPermission from "@/components/common/WithPermission";
// TODO: Restore when permissions are enabled
// import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold text-gray-700 dark:text-gray-300">{item.id}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "name",
    header: "Category",
    render: (item: IItemResource) => {
      const isParent = isParentCategory(item);
      const hasChildrenCount = hasChildren(item);
      
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isParent 
                ? 'bg-emerald-100 dark:bg-emerald-900' 
                : 'bg-blue-100 dark:bg-blue-900'
            }`}>
              {isParent ? (
                hasChildrenCount ? (
                  <FolderOpen className={`w-4 h-4 ${
                    isParent ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                ) : (
                  <Folder className={`w-4 h-4 ${
                    isParent ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                )
              ) : (
                <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* Indent for subcategories */}
              {!isParent && <span className="text-gray-400">└─</span>}
              <div className="font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
              {item.icon && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                  {item.icon}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">/{item.slug}</div>
          </div>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "parent_id",
    header: "Parent Category",
    render: (item: IItemResource) => {
      if (isParentCategory(item)) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Root Category
          </span>
        );
      }

      // If it has parent info, show it
      if (item.parent) {
        return (
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.parent.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                /{item.parent.slug}
              </div>
            </div>
          </div>
        );
      }

      // Fallback if we only have parent_id
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          ID: {item.parent_id}
        </span>
      );
    },
    sortable: false,
  },
  {
    key: "children_count",
    header: "Subcategories",
    render: (item: IItemResource) => {
      const childrenCount = item.children_count || 0;
      
      if (childrenCount === 0) {
        return (
          <span className="text-gray-400 text-sm">None</span>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {childrenCount} {childrenCount === 1 ? 'subcategory' : 'subcategories'}
          </span>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "description",
    header: "Description",
    render: (item: IItemResource) => (
      <div className="max-w-xs">
        <div className="text-gray-700 dark:text-gray-300 truncate" title={item.description || undefined}>
          {item.description || (
            <span className="text-gray-400 italic">No description</span>
          )}
        </div>
      </div>
    ),
    sortable: false,
  },
  {
    key: "created_at",
    header: "Created Date",
    render: (item: IItemResource) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(item.timestamps.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    ),
    sortable: true,
  },
];

export default function CategoryList() {
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
    const hasSubcategories = hasChildren(item);
    const warningText = hasSubcategories 
      ? ` This category has ${item.children_count} subcategories that will also be deleted.`
      : '';

    openDialog(
      "Confirm Deletion",
      `Are you sure you want to delete the category "${item.name}"?${warningText}`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      console.log("Attempting to delete category with ID:", item.id);
      const response = await ItemService.remove(item.id);
      
      if (response.success) {
        toastify.success(response.message || "Category deleted successfully");
        fetchItems();
      } else {
        // El servicio retornó success: false, mostrar el mensaje de error
        toastify.error(response.message || "Error deleting category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      
      // Mostrar el error real del servidor si está disponible
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Error deleting category";
      
      toastify.error(errorMessage);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "View",
      icon: <Eye className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleView(item),
      variant: "secondary" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("category_ver"),
    },
    {
      label: "Edit",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("category_editar"),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) =>
        !!item.id, // TODO: Restore && hasPermission("category_eliminar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
          <button
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold flex items-center gap-3 rounded-xl py-3 px-8 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Create New Category
          </button>
        <WithPermission permissions={[]}> {/* TODO: Restore permissions={["category_crear"]} */}
          
        </WithPermission>
        
        {/* Additional action button */}
        <WithPermission permissions={[]}> {/* TODO: Restore permissions={["category_crear"]} */}
          <button
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold flex items-center gap-3 rounded-xl py-3 px-8 hover:from-teal-700 hover:to-teal-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setCurrentItem(null);
              setIsModalOpen(true);
            }}
          >
            <FolderTree className="w-5 h-5" />
            Add Category
          </button>
        </WithPermission>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search categories..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-xl"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />
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
            dialogConfig.variant === "danger" ? "Delete" : "Confirm"
          }
        />
      )}
    </div>
  );
}