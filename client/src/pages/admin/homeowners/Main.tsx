import { useState } from "react";
import * as React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { HomeownerService as ItemService } from "@/core/services/homeowner/homeowner.service";
import type { IHomeowner as IItemResource } from "@/core/types/IHomeowner";
import { CountryOptions, StateOptions } from "@/core/types/IHomeowner";
import { Search, Plus, Trash2, Edit, Home, MapPin, Globe } from "lucide-react";
import Form from "./form-stepper";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
// import useAuth from "@/core/hooks/useAuth"; // TODO: Descomentar cuando se configuren los permisos
import DataTable from "@/components/table/DataTable";

const columns = [
  {
    key: "user_id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold">{item?.user_id || '-'}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "user_name",
    header: "Usuario",
    render: (item: IItemResource) => (
      <div>
        <div className="font-medium">{item?.user?.first_name} {item?.user?.last_name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{item?.user?.email}</div>
      </div>
    ),
    sortable: false,
  },
  {
    key: "address",
    header: "Dirección",
    render: (item: IItemResource) => (
      <div className="flex items-start gap-2">
        <Home className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
        <div>
          <div className="font-medium">{item?.address_line1}</div>
          {item?.address_line2 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">{item.address_line2}</div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item?.city}, {item?.state_code} {item?.preferred_zip}
          </div>
        </div>
      </div>
    ),
    sortable: false,
  },
  {
    key: "location",
    header: "Ubicación",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <div>
          <div className="text-sm font-medium">{item?.city}, {item?.state_code}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{item?.preferred_zip}</div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "country",
    header: "País",
    render: (item: IItemResource) => {
      const country = CountryOptions.find(c => c.value === item?.country_code);
      return (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm">{country?.label || item?.country_code}</span>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "coordinates",
    header: "Coordenadas",
    render: (item: IItemResource) => (
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {item?.lat && item?.lng ? (
          <div>
            <div>Lat: {item.lat.toFixed(4)}</div>
            <div>Lng: {item.lng.toFixed(4)}</div>
          </div>
        ) : (
          <span className="text-gray-400">No disponibles</span>
        )}
      </div>
    ),
    sortable: false,
  },
  {
    key: "created_at",
    header: "Fecha de Creación",
    render: (item: IItemResource) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {item?.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '-'}
      </div>
    ),
    sortable: true,
  },
];

export default function HomeownerList() {
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
    defaultSort: { key: "user_id", direction: "desc" },
    defaultPerPage: 10,
  });

  // Console.log para ver todos los datos de la API
  console.log('=== HOMEOWNER COMPONENT DATA ===');
  console.log('🔢 Items (total):', items?.length);
  console.log('📊 Items (array):', items);
  console.log('🏠 First item structure:', items?.[0]);
  console.log('⏳ Loading state:', loading);
  console.log('📄 Pagination:', pagination);
  console.log('🔀 Sort:', sort);
  console.log('🔍 SearchInput:', searchInput);
  
  // Debug específico para verificar si items es array válido
  console.log('📋 Items is array?:', Array.isArray(items));
  console.log('📋 Items type:', typeof items);
  
  // DEBUGGING TEMPORAL - Llamar directamente al servicio para comparar
  React.useEffect(() => {
    const directServiceCall = async () => {
      try {
        console.log('🧪 DIRECT SERVICE CALL TEST');
        const directResponse = await ItemService.getAllPaginated();
        console.log('🧪 Direct service response:', directResponse);
        console.log('🧪 Direct response data field:', directResponse.data);
        console.log('🧪 Direct response is data array?:', Array.isArray(directResponse.data));
      } catch (error) {
        console.error('🧪 Direct service call error:', error);
      }
    };
    
    // Ejecutar solo una vez para debugging
    if (!items || items.length === 0) {
      directServiceCall();
    }
  }, []); // Solo se ejecuta una vez
  
  console.log('=====================================');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  // const { hasPermission } = useAuth(); // TODO: Descomentar cuando se configuren los permisos

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

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    const userName = item?.user ? `${item.user.first_name} ${item.user.last_name}` : `ID: ${item.user_id}`;
    openDialog(
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar el propietario "${userName}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.user_id);
      toastify.success(response?.message || "Propietario eliminado");
      fetchItems();
    } catch (error: any) {
      console.error("Error al eliminar el propietario:", error);
      toastify.error(error.response?.data?.message || "Error al eliminar el propietario");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true, // hasPermission("propietario_editar") - TODO: Agregar permisos
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true, // hasPermission("propietario_eliminar") - TODO: Agregar permisos
    },
  ];

  const handleCountryFilter = (country: string) => {
    setCountryFilter(country);
    const filters: any = {};
    if (country) filters.country_code = country;
    if (stateFilter) filters.state_code = stateFilter;
    handleFilterChange(filters);
  };

  const handleStateFilter = (state: string) => {
    setStateFilter(state);
    const filters: any = {};
    if (countryFilter) filters.country_code = countryFilter;
    if (state) filters.state_code = state;
    handleFilterChange(filters);
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-2">
      <select
        value={countryFilter}
        onChange={(e) => handleCountryFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
      >
        <option value="">Todos los países</option>
        {CountryOptions.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      
      <select
        value={stateFilter}
        onChange={(e) => handleStateFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
      >
        <option value="">Todos los estados</option>
        {StateOptions.map((state) => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {/* hasPermission("propietario_crear") && */ true && (
            <button
              className="bg-blue-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-blue-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setCurrentItem(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              Agregar Propietario
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar propietarios..."
            className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      {renderFilters()}
    </div>
  );

  // Debug para verificar que se pasan datos correctos a DataTable
  const dataForTable = items as IItemResource[];
  console.log('🔧 Data being passed to DataTable:', dataForTable);
  console.log('🔧 DataTable will render', dataForTable?.length, 'items');

  return (
    <div>
      <PageBreadcrumb pageTitle="Propietarios" />
      
      {/* Mostrar información de debug en la interfaz si no hay datos */}
      {!loading && (!items || items.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="text-yellow-800 font-medium">🚨 Debug Info - No hay datos</h3>
          <p className="text-yellow-700 text-sm mt-2">
            Items length: {items?.length || 0} | Loading: {loading ? 'true' : 'false'} | 
            Pagination total: {pagination?.total || 0}
          </p>
          <p className="text-yellow-700 text-sm">
            Revisa la consola para más detalles de la respuesta de la API.
          </p>
        </div>
      )}

      <DataTable
        data={dataForTable}
        columns={columns}
        actions={actions}
        sort={sort}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        availableLimits={[10, 20, 50, 100]}
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
          confirmText={dialogConfig.variant === "danger" ? "Confirmar" : "Confirmar"}
        />
      )}
    </div>
  );
}