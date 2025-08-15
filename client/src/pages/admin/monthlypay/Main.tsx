import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PaymentService as ItemService } from "@/core/services/payment/payment.service";
import type {
  IPaymentResponse as IItemResource,
  IPaymentResponse,
} from "@/core/types/IPayment";
import { Search, Plus, Trash2, Edit, PrinterIcon } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import WithPermission from "@/components/common/WithPermission";
import useAuth from "@/core/hooks/useAuth";
import DataTable from "@/components/table/DataTable";
import { UserService } from "@/core/services/user/user.service";

const paymentMethods = [
  { id: "cash", name: "Pago en efectivo" },
  { id: "qr", name: "Pago por QR" },
];

const paymentType = [
  { id: "1", name: "Pago de Mensualidad" },
  { id: "2", name: "Multar" },
  { id: "3", name: "Pago de Curso" },
  { id: "4", name: "Pago de Multa" },
  { id: "5", name: "Pago De Certificacion" },
  { id: "6", name: "Pago de Visacion de Planos" },
  { id: "7", name: "Otros Pago" },
];

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div>
          <div className="font-bold">{item.id}</div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "user",
    header: "Nombre",
    render: (item: IItemResource) => (
      <div className="flex flex-col gap-1">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          {item.user.name}
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "amount",
    header: "Importe",
    render: (item: IItemResource) => (
      <div className="flex flex-col gap-1">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          {item.amount} bs.
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "payment_type",
    header: "Tipo de pago",
    render: (item: IItemResource) => {
      const type = paymentType.find((p) => p.id === item.payment_type);
      return (
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-900 dark:text-gray-100">
            {type?.name ?? "Desconocido"}
          </div>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "payment_method",
    header: "Metodo de pago",
    render: (item: IItemResource) => {
      const type = paymentMethods.find((p) => p.id === item.payment_method);
      return (
        <div className="flex flex-col gap-1">
          <div className="font-bold text-gray-900 dark:text-gray-100">
            {type?.name ?? "Desconocido"}
          </div>
        </div>
      );
    },
    sortable: true,
  },
  {
    key: "date",
    header: "Mes",
    render: (item: IItemResource) => (
      <div className="flex flex-col gap-1">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          {item.payment_month} - {item.payment_year}
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "observation",
    header: "Observacion",
    render: (item: IItemResource) => (
      <div className="flex flex-col gap-1">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          {item.observation}
        </div>
      </div>
    ),
    sortable: true,
  },
];

export default function paymentList() {
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
    initialFilters: { role: "" },
    defaultSort: { key: "id", direction: "asc" },
    defaultPerPage: 5,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  const [users, setUsers] = useState<IPaymentResponse[]>([]);
  const { hasPermission } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await UserService.getAll();
    setUsers(res.data);
  };
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
      `¿Estás seguro que deseas eliminar el Pago de ${item.user.name}?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handlePrint = async (item: IItemResource) => {
    try {
      const pdfBlob = await ItemService.printVoucher(item.id);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (error) {
      console.error("Error al eliminar payment:", error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Item eliminado");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar payment:", error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Imprimir comprobante",
      icon: <PrinterIcon className="w-4 h-4" />,
      onClick: (item: IItemResource) => handlePrint(item),
      variant: "primary" as const,
      show: () => hasPermission("payment_ver"),
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => hasPermission("payment_editar"),
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => hasPermission("payment_eliminar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <WithPermission permissions={["payment_crear"]}>
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
        </WithPermission>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar payments..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-green-500 focus:border-green-600 focus:ring-1 focus:ring-green-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Pagos" />
      <DataTable
        title=""
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
      <Form
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
        initialData={currentItem}
        load={fetchItems}
        users={users}
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
            dialogConfig.variant === "danger" ? "Eliminar" : "Restaurar"
          }
        />
      )}
    </div>
  );
}
