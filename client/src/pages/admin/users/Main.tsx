import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { UserService as ItemService } from "@/core/services/user/user.service";
import type { IUserResponse as IItemResource } from "@/core/types/IUser";
import { Search, Plus, Trash2, RotateCw, Edit, EyeIcon } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import type { IRolResponse } from "@/core/types/IRol";
import { RolService } from "@/core/services/rol/rol.service";
import WithPermission from "@/components/common/WithPermission";
import useAuth from "@/core/hooks/useAuth";
import { useNavigate } from "react-router";
import DataTable from "@/components/table/DataTable";

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
    key: "name",
    header: "Nombre",
    render: (item: IItemResource) => (
      <div className="font-bold">{item.name}</div>
    ),
    sortable: true,
  },
  {
    key: "email",
    header: "Email",
    render: (item: IItemResource) => (
      <div className="font-bold">{item.email}</div>
    ),
    sortable: true,
  },
  {
    key: "role",
    header: "Rol",
    render: (item: IItemResource) => (
      <span className="badge badge-primary">
        {(item as any).role_name || "Usuario"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Estado",
    render: (item: IItemResource) => (
      <span className="badge badge-success">
        {item.deleted_id == null ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    key: "edit_profile",
    header: "Perfil actualizado",
    render: (item: IItemResource) =>
      item.edit_profile ? (
        <span className="badge badge-success">Actualizado</span>
      ) : (
        <span className="badge badge-warning">Pendiente</span>
      ),
  },
];

type FilterOption = {
  value: string;
  label: string;
};

type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
  currentValue?: string;
};

export default function UserList() {
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

  const [filters, setFilters] = useState<FilterConfig[]>([
    {
      key: "role",
      label: "Filtrar por rol",
      options: [{ value: "", label: "Todos" }],
      currentValue: "",
    },
  ]);
  const [roles, setRoles] = useState<IRolResponse[]>([]);

  const { hasPermission } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    getAllPermissions();
  }, []);

  const getAllPermissions = async () => {
    const res = await RolService.getAll();
    const rolOptions = res.data.map((item: IRolResponse) => ({
      value: item.name,
      label: item.name,
    }));
    setFilters((prev) => [
      {
        ...prev[0],
        options: [{ value: "", label: "Todos" }, ...rolOptions],
      },
    ]);
    setRoles(res.data);
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
      `¿Estás seguro que deseas eliminar al usuario ${item.name}?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const confirmRestore = (item: IItemResource) => {
    openDialog(
      "Confirmar restauración",
      `¿Estás seguro que deseas restaurar al usuario ${item.name}?`,
      () => handleRestore(item)
    );
  };

  const handleDelete = async (item: IItemResource) => {
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Item eliminado");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const handleRestore = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.restore(item.id);
      toastify.success(response?.message || "Item restaurado");
      fetchItems();
    } catch (error) {
      console.error("Error al restaurar usuario:", error);
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Ver perfil",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: (item: IItemResource) => navigate(`/admin/usuarios/${item.id}`),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        item.deleted_id == null && hasPermission("usuario_ver"),
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        item.deleted_id == null && hasPermission("usuario_editar"),
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: (item: IItemResource) =>
        item.deleted_id == null && hasPermission("usuario_eliminar"),
    },
    {
      label: "Restaurar",
      icon: <RotateCw className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmRestore(item),
      variant: "primary" as const,
      show: (item: IItemResource) =>
        item.deleted_id != null && hasPermission("usuario_restaurar"),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <WithPermission permissions={["usuario_crear"]}>
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
          placeholder="Buscar usuarios..."
          className=" input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        /> 
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Usuarios" />
      <DataTable
        data={items as IItemResource[]}
        columns={columns}
        actions={actions}
        filters={filters}
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
        roles={roles}
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
          confirmText={dialogConfig.variant === "danger" ? "Eliminar" : "Restaurar"}
        />
      )}
    </div>
  );
}
