import type { IWorkExperience } from "@/core/types/IWorkExperience";
import DataTable from "@/components/table/DataTable";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useResource } from "@/core/hooks/useResource";
import { useState } from "react";
import { WorkExperienceService } from "@/core/services/auth/work-experience.service";
import useAuth from "@/core/hooks/useAuth";
import { toastify } from "@/core/utils/toastify";
import { ConfirmDialog } from "../common/ConfirmDialog";
import Form from "./form/work-experience-form/form";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IWorkExperience) => (
      <p className="font-semibold text-gray-800 dark:text-gray-200">{item.id}</p>
    ),
    sortable: true
  },
  {
    key: 'company_name',
    header: 'Institución o Empresa',
    render: (item: IWorkExperience) => (
      <p className="text-sm font-medium text-gray-700 dark:text-gray-100">{item.company_name}</p>
    ),
    sortable: true,
  },
  {
    key: 'company_location',
    header: 'Ubicación de la empresa',
    render: (item: IWorkExperience) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.company_location}</p>
    ),
    sortable: true,
  },
  {
    key: 'start_date',
    header: 'Fecha de inicio',
    render: (item: IWorkExperience) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.start_date}</p>
    ),
    sortable: true,
  },
  {
    key: 'end_date',
    header: 'Fecha de finalización',
    render: (item: IWorkExperience) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.end_date}</p>
    ),
    sortable: true,
  },
  {
    key: 'position',
    header: 'Cargo o puesto',
    render: (item: IWorkExperience) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.position}</p>
    ),
    sortable: true,
  },
  {
    key: 'responsibilities',
    header: 'Responsabilidades',
    render: (item: IWorkExperience) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.responsibilities}</p>
    ),
    sortable: true,
  },
];

export default function UserWorkExperienceCard() {
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
    service: WorkExperienceService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
    resourceId: user?.id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IWorkExperience | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'primary' | 'danger';
  } | null>(null);

  const openDialog = (title: string, message: string, onConfirm: () => void, variant: 'primary' | 'danger' = 'primary') => {
    setDialogConfig({ isOpen: true, title, message, onConfirm, variant });
  };

  const handleEdit = (item: IWorkExperience) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IWorkExperience) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el trabajo en ${item.company_name}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleDelete = async (item: IWorkExperience) => {
    try {
      const response = await WorkExperienceService.remove(user?.id, item.id);
      toastify.success(response?.message || 'Registro eliminado');
      fetchItems();
    } catch (error) {
      toastify.error('Error al eliminar');
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IWorkExperience) => handleEdit(item),
      variant: 'primary' as const,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IWorkExperience) => confirmDelete(item),
      variant: 'danger' as const,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
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
          placeholder="Buscar..."
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          title="Experiencia Profesional"
          data={items as IWorkExperience[]}
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
            confirmText={dialogConfig.variant === 'danger' ? 'Eliminar' : 'Confirmar'}
          />
        )}
      </div>
    </div>
  );
}
