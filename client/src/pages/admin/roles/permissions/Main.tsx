import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Search, RefreshCw } from 'lucide-react';
import { toastify } from '@/core/utils/toastify';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import { PermissonService as ItemService } from "@/core/services/permission/permission.service";
import { RolPermissionService } from "@/core/services/rol-permission/rol-permission.service";
import type { IPermissionResponse as IItemResource } from "@/core/types/IPermission";
import { useResource } from "@/core/hooks/useResource";

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: IItemResource) => (
      <div className="font-semibold text-gray-700 dark:text-gray-300">{item.id}</div>
    ),
    sortable: true,
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

export default function PermissionList() {
  const { id } = useParams();
  const [selectedPermissions, setSelectedPermissions] = useState<IItemResource[]>([]);

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
  useEffect(() => {
    if (id) {
      initializeCheckboxes();
    }
  }, [id]);


  const initializeCheckboxes = async () => {
    await RolPermissionService.getAllPaginated(id)
      .then(response => setSelectedPermissions(response.data))
      .catch(error => {
        console.error("Error al obtener permisos del rol:", error);
      });
  };

  const handleSelectionChange = (selectedItems: IItemResource[]) => {
    setSelectedPermissions(selectedItems);
  };

  const handleSync = async () => {
    if (!id) return;

    const names = selectedPermissions?.map(p => p.name) || [];
    const request = {
      permissions: names
    };
    await RolPermissionService.sync(id, request)
      .then(response => {
        fetchItems();
        toastify.success(response.message || 'Item creado');
      })
      .catch(error => toastify.error(error.message));
  }

  const renderToolbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <button
        className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        onClick={handleSync}
      >
        <RefreshCw className="w-5 h-5" />
        Actualizar permisos
      </button>

      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Permisos" />
      <DataTable
        data={items as IItemResource[]}
        columns={columns}
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
        showCheckboxes={true}
        onSelectionChange={handleSelectionChange}
        initialSelectedItems={selectedPermissions}
        rowIdentifier="id"
      />
    </>
  );
}
