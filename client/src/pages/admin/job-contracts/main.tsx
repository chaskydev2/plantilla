import React, { useState } from 'react';
import { JobContractForm } from './form';
import type { JobContractFormValues } from './form';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { JobContractService as ItemService } from '@/core/services/job-contracts/jobContract.service';
import type { IJobContract as IItemResource } from '@/core/types/IJobContract';
import { Search, Trash2, Edit } from 'lucide-react';
import { useResource } from '@/core/hooks/useResource';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toastify } from '@/core/utils/toastify';
import DataTable from '@/components/table/DataTable';

const columns = [
  { key: 'id', header: 'ID', render: (item: IItemResource) => <div className="font-bold">{item.id}</div>, sortable: true },
  { key: 'job_post_id', header: 'ID de Publicación', render: (item: IItemResource) => <div>{item.job_post_id}</div>, sortable: true },
  { key: 'contractor_id', header: 'ID de Contratista', render: (item: IItemResource) => <div>{item.contractor_id}</div>, sortable: true },
  { key: 'start_date', header: 'Fecha de Inicio', render: (item: IItemResource) => <div>{item.start_date}</div>, sortable: true },
  { key: 'end_date', header: 'Fecha de Fin', render: (item: IItemResource) => <div>{item.end_date}</div>, sortable: true },
  { key: 'status', header: 'Estado', render: (item: IItemResource) => <span className="font-bold">{item.status}</span>, sortable: true },
];

const JobContractsAdmin: React.FC = () => {
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

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar el contrato #${item.id}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || 'Contrato eliminado');
      fetchItems();
    } catch (error) {
      console.error('Error al eliminar el contrato:', error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleEdit = (item: IItemResource) => {
    void item;
    // Función vacía temporalmente
  };

  const actions = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: 'primary' as const,
      show: (item: IItemResource) => !!item.id,
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: 'danger' as const,
      show: (item: IItemResource) => !!item.id,
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

  const handleSubmit = async (data: JobContractFormValues) => {
    setIsProcessing(true);
    try {
      await ItemService.create(data);
      toastify.success('Contrato creado exitosamente');
      fetchItems();
    } catch (error) {
      toastify.error('Error al crear el contrato');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Contratos de Trabajo" />
      <JobContractForm onSubmit={handleSubmit} loading={isProcessing} />
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

export default JobContractsAdmin;
