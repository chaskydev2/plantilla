// AttributeContractors.nojsx.tsx
import React, { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { AttributeContractorService as ItemService } from '@/core/services/attribute-contractor/attribute-contractor.service';
import type { AttributeContractor as IItemResource } from '@/pages/admin/attribute-contractor/types';
import { Search, Trash2, Eye } from 'lucide-react';
import AttributeContractorModal from './AttributeContractorModal';
import { useResource } from '@/core/hooks/useResource';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toastify } from '@/core/utils/toastify';
import AttributeContractorTable from './AttributeContractorTable';

type WithRelations = IItemResource & {
  attribute?: { id?: number; name?: string } | null;
  contractor?: { id?: number; user?: { id?: number; name?: string } | null } | null;
};

const h = React.createElement;

const AttributeContractors: React.FC = () => {
  const [viewFile, setViewFile] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<WithRelations | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'primary' | 'danger';
  } | null>(null);

  const {
    items,
    loading,
    pagination,
    sort,
    searchInput = '',
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useResource({
    service: ItemService,
    defaultSort: { key: 'id', direction: 'asc' },
    defaultPerPage: 10,
  });

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
      `¿Estás seguro que deseas eliminar el atributo del contratista #${item.id}?`,
      () => handleDelete(item),
      'danger'
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      setIsProcessing(true);
      const response = await ItemService.remove(item.id);
      if (response.success) {
        toastify.success(response.message || 'Atributo eliminado');
        fetchItems();
      } else {
        toastify.error(response.message || 'Error al eliminar');
      }
    } catch (error: any) {
      toastify.error(error.response?.data?.message || error.message || 'Error al eliminar');
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: 'Ver',
      icon: h(Eye, { className: 'w-4 h-4' }) as React.ReactNode,
      onClick: (item: WithRelations) => {
        if (item.value) {
          setViewFile(String(item.value));
          setViewItem(item);
        }
      },
      variant: 'secondary' as const,
      show: (item: WithRelations) => !!item.value,
    },
    {
      label: 'Eliminar',
      icon: h(Trash2, { className: 'w-4 h-4' }) as React.ReactNode,
      onClick: (item: WithRelations) => confirmDelete(item),
      variant: 'danger' as const,
      show: (item: WithRelations) => !!item.id,
    },
  ];

  const columns: import('@/core/types/ITable').ITableColumn<WithRelations>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item: WithRelations) => h('div', { className: 'flex items-center gap-3' }, h('div', { className: 'font-bold text-gray-700 dark:text-gray-300' }, String(item.id))),
      sortable: true,
    },
    {
      key: 'contractor_name',
      header: 'Nombre del Contratista',
      render: (item: WithRelations) => h('div', { className: 'text-gray-900 dark:text-gray-100' }, item.contractor?.user?.name ?? '-'),
      sortable: false,
    },
    {
      key: 'attribute_name',
      header: 'Nombre del Atributo',
      render: (item: WithRelations) => h('div', { className: 'text-gray-900 dark:text-gray-100' }, item.attribute?.name ?? '-'),
      sortable: false,
    },
    {
      key: 'created_at',
      header: 'Creado',
      render: (item: WithRelations) => h('div', { className: 'text-sm text-gray-600 dark:text-gray-400' }, item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'),
      sortable: true,
    },
    {
      key: 'updated_at',
      header: 'Actualizado',
      render: (item: WithRelations) => h('div', { className: 'text-sm text-gray-600 dark:text-gray-400' }, item.updated_at ? new Date(item.updated_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'),
      sortable: true,
    },
  ];

  const renderToolbar = (): React.ReactElement =>
    h(
      'div',
      { className: 'flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between' },
      h(
        'div',
        { className: 'relative w-full sm:w-64' },
        h(
          'div',
          {
            className: 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300',
          },
          h(Search, { className: 'w-5 h-5' })
        ),
        h('input', {
          type: 'text',
          placeholder: 'Buscar...',
          className:
            'input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-xl',
          value: searchInput,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value),
        })
      )
    );

  return h(
    'div',
    null,
    h(PageBreadcrumb, { pageTitle: 'Atributos de Contratistas' }),
    h(AttributeContractorTable, {
      items: items as WithRelations[],
      columns,
      actions: actions as import('@/core/types/ITable').ITableAction<WithRelations>[],
      sort,
      onSortChange: handleSortChange,
      onFilterChange: handleFilterChange,
      onSearch: handleSearch,
      pagination,
      onPageChange: handlePageChange,
      onLimitChange: handleLimitChange,
      loading,
      renderTopToolbar: renderToolbar,
    }),
    h(AttributeContractorModal, {
      viewFile,
      viewItem,
      setViewFile,
      setViewItem,
      fetchItems,
      isProcessing,
      setIsProcessing,
    }),
    dialogConfig &&
      h(ConfirmDialog, {
        isOpen: dialogConfig.isOpen,
        title: dialogConfig.title,
        message: dialogConfig.message,
        onConfirm: dialogConfig.onConfirm,
        onCancel: closeDialog,
        isProcessing,
        variant: dialogConfig.variant,
        confirmText: dialogConfig.variant === 'danger' ? 'Eliminar' : 'Confirmar',
      })
  );
};

export default AttributeContractors;
