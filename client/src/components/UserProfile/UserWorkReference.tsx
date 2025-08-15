import type { IWorkReference } from "@/core/types/IWorkReference";
import DataTable from "@/components/table/DataTable";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useResource } from "@/core/hooks/useResource";
import { useState } from "react";
import { WorkReferenceService } from "@/core/services/auth/work-reference.service";
import useAuth from "@/core/hooks/useAuth";
import { toastify } from "@/core/utils/toastify";
import { ConfirmDialog } from "../common/ConfirmDialog";
import Form from "./form/work-reference-form/form";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.id}</div>
    ),
    sortable: true
  },
  {
    key: 'reference_name',
    header: 'Nombre de la referencia',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.reference_name}</div>
    ),
    sortable: true,
  },
  {
    key: 'company',
    header: 'Institución o Empresa',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.company}</div>
    ),
    sortable: true,
  },
  {
    key: 'position',
    header: 'Cargo o puesto',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.position}</div>
    ),
    sortable: true,
  },
  {
    key: 'phone',
    header: 'Celular o teléfono',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.phone}</div>
    ),
    sortable: true,
  },
  {
    key: 'email',
    header: 'Correo electrónico',
    render: (item: IWorkReference) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.email}</div>
    ),
    sortable: true,
  },
  {
    key: 'additional_notes',
    header: 'Notas adicionales',
    render: (item: IWorkReference) => (
      <div className="text-sm text-gray-600 dark:text-gray-300">{item.additional_notes}</div>
    ),
    sortable: true,
  },
];

export default function UserWorkReferenceCard() {
  const { user } = useAuth();
  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useResource({
    service: WorkReferenceService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
    resourceId: user?.id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IWorkReference | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'primary' | 'danger';
  } | null>(null);

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: 'primary' | 'danger' = 'primary'
  ) => {
    setDialogConfig({ isOpen: true, title, message, onConfirm, variant });
  };

  const handleEdit = (item: IWorkReference) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IWorkReference) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el ${item.reference_name}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleDelete = async (item: IWorkReference) => {
    try {
      const response = await WorkReferenceService.remove(user?.id, item.id);
      toastify.success(response?.message || 'Item eliminado');
      fetchItems();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IWorkReference) => handleEdit(item),
      variant: 'primary' as const,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IWorkReference) => confirmDelete(item),
      variant: 'danger' as const,
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
          Agregar
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <DataTable
          title="Referencias laborales"
          data={items as IWorkReference[]}
          columns={columns}
          actions={actions}
          sort={sort}
          onSortChange={handleSortChange}
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
          userId={user?.id}
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
    </div>
  );
}
