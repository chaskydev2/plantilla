import type { IAcademic } from "@/core/types/IAcademicTraining";
import DataTable from "@/components/table/DataTable";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useResource } from "@/core/hooks/useResource";
import { useState } from "react";
import { AcademicTrainingService } from "@/core/services/auth/academictraining.service";
import useAuth from "@/core/hooks/useAuth";
import { toastify } from "@/core/utils/toastify";
import { ConfirmDialog } from "../common/ConfirmDialog";
import Form from "./form/academic-training-form/form";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IAcademic) => (
      <p className="font-semibold text-gray-800 dark:text-gray-200">{item.id}</p>
    ),
    sortable: true,
  },
  {
    key: 'professional_title',
    header: 'Título profesional',
    render: (item: IAcademic) => (
      <p className="text-sm font-medium text-gray-700 dark:text-gray-100">{item.professional_title}</p>
    ),
    sortable: true,
  },
  {
    key: 'academic_degree',
    header: 'Grado académico',
    render: (item: IAcademic) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.academic_degree}</p>
    ),
    sortable: true,
  },
  {
    key: 'graduated_from',
    header: 'Titulado de la institución',
    render: (item: IAcademic) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.graduated_from}</p>
    ),
    sortable: true,
  },
  {
    key: 'relevant_certifications',
    header: 'Certificaciones relevantes',
    render: (item: IAcademic) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.relevant_certifications}</p>
    ),
    sortable: true,
  },
  {
    key: 'graduation_date',
    header: 'Fecha de egreso',
    render: (item: IAcademic) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.graduation_date}</p>
    ),
    sortable: true,
  },
  {
    key: 'degree_date',
    header: 'Fecha de obtención del título',
    render: (item: IAcademic) => (
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.degree_date}</p>
    ),
    sortable: true,
  },
];

export default function UserAcademicsCard() {
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
    service: AcademicTrainingService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
    resourceId: user?.id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IAcademic | null>(null);
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

  const handleEdit = (item: IAcademic) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IAcademic) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el título "${item.professional_title}"?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleDelete = async (item: IAcademic) => {
    try {
      const response = await AcademicTrainingService.remove(user?.id, item.id);
      toastify.success(response?.message || 'Registro eliminado');
      fetchItems();
    } catch (error) {
      toastify.error("Error al eliminar");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IAcademic) => handleEdit(item),
      variant: 'primary' as const,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IAcademic) => confirmDelete(item),
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
          title="Formación Académica"
          data={items as IAcademic[]}
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
