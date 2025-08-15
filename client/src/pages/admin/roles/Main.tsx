import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { useState } from "react";
import { RolService as ItemService } from "@/core/services/rol/rol.service";
import type { IRolResponse as IItemResource } from "@/core/types/IRol";
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import { useNavigate } from "react-router";
import useAuth from "@/core/hooks/useAuth";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IItemResource) => (
      <div className="font-semibold text-gray-700 dark:text-gray-300">{item.id}</div>
    ),
    sortable: true
  },
  {
    key: 'name',
    header: 'Nombre',
    render: (item: IItemResource) => (
      <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
    ),
    sortable: true,
  },
];

export default function RoleList() {
  const navigate = useNavigate();

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
    initialFilters: { role: '' },
    defaultSort: { key: 'id', direction: 'asc' },
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
    variant: 'primary' | 'danger';
  } | null>(null);
  
  const { hasPermission } = useAuth();
  
  const openDialog = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    variant: 'primary' | 'danger' = 'primary'
  ) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant
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
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar al usuario ${item.name}?`,
      () => handleDelete(item),
      'danger'
    );
  }

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || 'Item eliminado');
      fetchItems();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toastify.error('Error al eliminar el usuario.');
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  }

  const actions = [
    {
      label: 'Permisos',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => navigate(`/admin/roles/${item.id}/permisos`),
      variant: 'primary' as const,
      show: (item: IItemResource) => item.id != null && hasPermission('rol_permiso_editar'),
    },
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: 'primary' as const,
      show: (item: IItemResource) => item.id != null && hasPermission('rol_editar'),
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: 'danger' as const,
      show: (item: IItemResource) => item.id != null && hasPermission('rol_eliminar'),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
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

      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
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
          showCheckboxes={false}
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
          confirmText={dialogConfig.variant === 'danger' ? 'Eliminar' : 'Restaurar'}
        />
        
      )}
    </div>
  );
}
