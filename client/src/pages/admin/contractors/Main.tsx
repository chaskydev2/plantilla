import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ContractorService as ItemService } from "@/core/services/contractor/contractor.service";
import type { IContractor as IItemResource } from "@/core/types/IContractor";
import { ContractStatus, ContractStatusLabels } from '../../../core/types/IContractor';
import { Search, Plus, Trash2, Edit, Building2, CheckCircle, XCircle, Pause, Star, MapPin } from "lucide-react";
import Form from "./form-stepper";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
// import useAuth from "@/core/hooks/useAuth"; // TODO: Descomentar cuando se configuren los permisos
import DataTable from "@/components/table/DataTable";

const getStatusColor = (status: string) => {
  switch (status) {
    case ContractStatus.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case ContractStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case ContractStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case ContractStatus.SUSPENDED:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

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
    key: "company_name",
    header: "Empresa",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <div>
          <div className="font-bold">{item?.company_info?.company_name || '-'}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item?.company_info?.license_number || 'Sin licencia'}
          </div>
        </div>
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
    key: "service_area",
    header: "Área de Servicio",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm">{item?.company_info?.service_area || '-'}</span>
      </div>
    ),
    sortable: false,
  },
  {
    key: "average_rating",
    header: "Calificación",
    render: (item: IItemResource) => {
      const rating = item?.company_info?.average_rating;
      const formattedRating = (rating && typeof rating === 'number') ? rating.toFixed(1) : '0.0';
      
      return (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{formattedRating}</span>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "contract_status",
    header: "Estado",
    render: (item: IItemResource) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item?.contract?.contract_status)}`}>
        {item?.contract?.status_label || 'Sin estado'}
      </span>
    ),
    sortable: true,
  },
  {
    key: "affiliation_date",
    header: "Fecha de Afiliación",
    render: (item: IItemResource) => (
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {item?.contract?.affiliation_date ? new Date(item.contract.affiliation_date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '-'}
      </div>
    ),
    sortable: true,
  },
];

export default function ContractorList() {
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
    defaultSort: { key: "company_name", direction: "asc" },
    defaultPerPage: 10,
  });

  // 🐛 DEBUG: Log para ver qué datos están llegando
  console.log('=== CONTRACTOR MAIN COMPONENT DEBUG ===');
  console.log('👷 Items received:', items);
  console.log('👷 Items type:', typeof items);
  console.log('👷 Items is array?:', Array.isArray(items));
  console.log('👷 Items length:', items?.length);
  console.log('⏳ Loading state:', loading);
  console.log('📄 Pagination:', pagination);
  console.log('=======================================');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
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
    openDialog(
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar el trabajador "${item.company_info?.company_name}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.user_id);
      toastify.success(response?.message || "Trabajador eliminado");
      fetchItems();
    } catch (error: any) {
      console.error("Error al eliminar el contrato:", error);
      toastify.error(error.response?.data?.message || "Error al eliminar el contrato");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleApprove = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.approve(item.user_id);
      toastify.success(response?.message || "Trabajador aprobado");
      fetchItems();
    } catch (error: any) {
      console.error("Error al aprobar el contrato:", error);
      toastify.error(error.response?.data?.message || "Error al aprobar el contrato");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.reject(item.user_id);
      toastify.success(response?.message || "Trabajador rechazado");
      fetchItems();
    } catch (error: any) {
      console.error("Error al rechazar el contrato:", error);
      toastify.error(error.response?.data?.message || "Error al rechazar el contrato");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspend = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.suspend(item.user_id);
      toastify.success(response?.message || "Trabajador suspendido");
      fetchItems();
    } catch (error: any) {
      console.error("Error al suspender el contrato:", error);
      toastify.error(error.response?.data?.message || "Error al suspender el contrato");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmApprove = (item: IItemResource) => {
    openDialog(
      "Confirmar aprobación",
      `¿Estás seguro que deseas aprobar el trabajador "${item.company_info?.company_name}"?`,
      () => handleApprove(item),
      "primary"
    );
  };

  const confirmReject = (item: IItemResource) => {
    openDialog(
      "Confirmar rechazo",
      `¿Estás seguro que deseas rechazar el trabajador "${item.company_info?.company_name}"?`,
      () => handleReject(item),
      "danger"
    );
  };

  const confirmSuspend = (item: IItemResource) => {
    openDialog(
      "Confirmar suspensión",
      `¿Estás seguro que deseas suspender el trabajador "${item.company_info?.company_name}"?`,
      () => handleSuspend(item),
      "danger"
    );
  };

  const actions = [
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true, // hasPermission("contrato_editar") - TODO: Agregar permisos
    },
    {
      label: "Aprobar",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmApprove(item),
      variant: "primary" as const,
      show: (item: IItemResource) => item?.contract?.contract_status === ContractStatus.PENDING,
    },
    {
      label: "Rechazar",
      icon: <XCircle className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmReject(item),
      variant: "danger" as const,
      show: (item: IItemResource) => item?.contract?.contract_status === ContractStatus.PENDING || item?.contract?.contract_status === ContractStatus.APPROVED,
    },
    {
      label: "Suspender",
      icon: <Pause className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmSuspend(item),
      variant: "danger" as const,
      show: (item: IItemResource) => item?.contract?.contract_status === ContractStatus.APPROVED,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true, // hasPermission("contrato_eliminar") - TODO: Agregar permisos
    },
  ];

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status) {
      handleFilterChange({ status });
    } else {
      handleFilterChange({});
    }
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-2">
      <select
        value={statusFilter}
        onChange={(e) => handleStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
      >
        <option value="">Todos los estados</option>
        <option value={ContractStatus.PENDING}>{ContractStatusLabels[ContractStatus.PENDING]}</option>
        <option value={ContractStatus.APPROVED}>{ContractStatusLabels[ContractStatus.APPROVED]}</option>
        <option value={ContractStatus.REJECTED}>{ContractStatusLabels[ContractStatus.REJECTED]}</option>
        <option value={ContractStatus.SUSPENDED}>{ContractStatusLabels[ContractStatus.SUSPENDED]}</option>
      </select>
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {/* hasPermission("contrato_crear") && */ true && (
            <button
              className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                setCurrentItem(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              Agregar Trabajador
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar trabajadores..."
            className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      {renderFilters()}
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Trabajadores" />
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