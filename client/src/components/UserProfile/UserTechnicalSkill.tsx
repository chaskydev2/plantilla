import type { ITechnicalSkill } from "@/core/types/ITechnicalSkill";
import DataTable from "@/components/table/DataTable";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useResource } from "@/core/hooks/useResource";
import { useState } from "react";
import { TechnicalSkillService } from "@/core/services/auth/technical-skill.service";
import useAuth from "@/core/hooks/useAuth";
import { toastify } from "@/core/utils/toastify";
import { ConfirmDialog } from "../common/ConfirmDialog";
import Form from "./form/technical-skill-form/form";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: ITechnicalSkill) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.id}</div>
    ),
    sortable: true
  },
  {
    key: 'skill_name',
    header: 'Nombre de la habilidad técnica',
    render: (item: ITechnicalSkill) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.skill_name}</div>
    ),
    sortable: true,
  },
  {
    key: 'skill_level',
    header: 'Nivel de habilidad técnica',
    render: (item: ITechnicalSkill) => (
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.skill_level}</div>
    ),
    sortable: true,
  },
  {
    key: 'description',
    header: 'Descripción',
    render: (item: ITechnicalSkill) => (
      <div className="text-sm text-gray-600 dark:text-gray-300">{item.description}</div>
    ),
  },
];

const tableFilters = [
  {
    key: 'type',
    label: 'Filtrar por tipo de habilidad',
    options: [
      { value: '', label: 'Todos' },
      { value: 'software', label: 'Software' },
      { value: 'equipment', label: 'Equipos' },
      { value: 'technical', label: 'Habilidad Técnica' },
    ],
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
    handleFilterChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useResource({
    service: TechnicalSkillService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
    resourceId: user?.id,
    initialFilters: { type: '' },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ITechnicalSkill | null>(null);
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

  const handleEdit = (item: ITechnicalSkill) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: ITechnicalSkill) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el ${item.skill_name}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleDelete = async (item: ITechnicalSkill) => {
    try {
      const response = await TechnicalSkillService.remove(user?.id, item.id);
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
      onClick: (item: ITechnicalSkill) => handleEdit(item),
      variant: 'primary' as const,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: ITechnicalSkill) => confirmDelete(item),
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
          title="Habilidades Técnicas"
          data={items as ITechnicalSkill[]}
          columns={columns}
          filters={tableFilters}
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