import React, { useState } from 'react';
import { JobPostForm } from './form';
import type { JobPostFormValues } from './form';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Search, Trash2, Edit } from 'lucide-react';
import { useResource } from '@/core/hooks/useResource';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toastify } from '@/core/utils/toastify';
import DataTable from '@/components/table/DataTable';
import { jobPostService } from '@/core/services/job-posts/jobPost.service';

const columns = [
  { key: 'id', header: 'ID', render: (item: any) => <div className="font-bold">{item.id}</div>, sortable: true },
  { key: 'homeowner_id', header: 'ID Propietario', render: (item: any) => <div>{item.homeowner_id}</div>, sortable: true },
  { key: 'title', header: 'Título', render: (item: any) => <div>{item.title}</div>, sortable: true },
  { key: 'description', header: 'Descripción', render: (item: any) => <div>{item.description}</div>, sortable: true },
  { key: 'deadline', header: 'Fecha Límite', render: (item: any) => <div>{item.deadline}</div>, sortable: true },
  { key: 'status', header: 'Estado', render: (item: any) => <span className="font-bold">{item.status}</span>, sortable: true },
];

const JobPostsAdmin: React.FC = () => {
  // Servicio real de job posts
  const ItemService = jobPostService;

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
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 5,
  });

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

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const confirmDelete = (item: any) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el trabajo #${item.id}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const handleDelete = async (item: any) => {
    try {
      await ItemService.remove(item.id);
      toastify.success('Trabajo eliminado');
      fetchItems();
    } catch (error) {
      console.error('Error al eliminar el trabajo:', error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleEdit = (item: any) => {
    void item;
    // Función vacía temporalmente
  };

  const actions = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: any) => handleEdit(item),
      variant: 'primary' as const,
      show: (item: any) => !!item.id,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: any) => confirmDelete(item),
      variant: 'danger' as const,
      show: (item: any) => !!item.id,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  const handleSubmit = async (_data: JobPostFormValues) => {
    setIsProcessing(true);
    try {
      // Aquí deberías llamar a tu API para crear el trabajo
      toastify.success('Trabajo creado exitosamente');
      fetchItems();
    } catch (error) {
      toastify.error('Error al crear el trabajo');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Trabajos" />
      <JobPostForm onSubmit={handleSubmit} loading={isProcessing} />
      <DataTable
        data={items}
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
            dialogConfig.variant === 'danger' ? 'Eliminar' : 'Restaurar'
          }
        />
      )}
    </div>
  );
};

export default JobPostsAdmin;
