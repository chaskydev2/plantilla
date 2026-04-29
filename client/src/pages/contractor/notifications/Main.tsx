import { useEffect, useMemo, useState } from "react";
import { Bell, Eye, Search, ShieldCheck, X } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import type { ITableAction, ITableColumn, ITableProps, ITableSort } from "@/core/types/ITable";
import type { IPagination } from "@/core/types/IApi";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  status: "read" | "unread";
  category: "booking" | "system" | "payment" | "security";
  created_at: string;
  updated_at: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 201,
    title: "Nuevo mensaje de cliente",
    message: "Laura Pérez envió un mensaje sobre el proyecto Remodelación de cocina.",
    status: "unread",
    category: "booking",
    created_at: "2024-09-14T08:32:00Z",
    updated_at: "2024-09-14T08:32:00Z",
  },
  {
    id: 202,
    title: "Pago recibido",
    message: "Se ha recibido el pago de Carlos Gutiérrez por Instalación de luminarias.",
    status: "read",
    category: "payment",
    created_at: "2024-09-10T17:05:00Z",
    updated_at: "2024-09-10T17:06:00Z",
  },
  {
    id: 203,
    title: "Actualización de sistema",
    message: "Se han mejorado las notificaciones en tiempo real.",
    status: "read",
    category: "system",
    created_at: "2024-09-09T06:12:00Z",
    updated_at: "2024-09-09T06:12:00Z",
  },
  {
    id: 204,
    title: "Alerta de seguridad",
    message: "Detectamos un inicio de sesión desde un nuevo dispositivo.",
    status: "unread",
    category: "security",
    created_at: "2024-09-12T10:20:00Z",
    updated_at: "2024-09-12T11:05:00Z",
  },
];

const NotificationDetailPanel = ({
  notification,
  onClose,
}: {
  notification: NotificationItem | null;
  onClose: () => void;
}) => {
  if (!notification) return null;

  const badgeStyles: Record<NotificationItem["category"], string> = {
    booking: "bg-indigo-100 text-indigo-700",
    system: "bg-gray-100 text-gray-600",
    payment: "bg-emerald-100 text-emerald-700",
    security: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Detalle de notificación</p>
          <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 px-6 py-5 text-sm text-gray-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[notification.category]}`}>
            {notification.category === "booking" && "Reservas"}
            {notification.category === "system" && "Sistema"}
            {notification.category === "payment" && "Pagos"}
            {notification.category === "security" && "Seguridad"}
          </span>
          <span className="text-xs text-gray-500">
            Recibida: {new Date(notification.created_at).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            Actualizada: {new Date(notification.updated_at).toLocaleString()}
          </span>
        </div>
        <p className="text-base text-gray-800">{notification.message}</p>
        {notification.category === "security" && (
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <ShieldCheck className="h-4 w-4 text-gray-500" />
            Revisa la actividad reciente y cambia tu contraseña si no reconoces el acceso.
          </div>
        )}
      </div>
    </div>
  );
};

const ContractorNotifications: React.FC = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<ITableSort>({ key: "created_at", direction: "desc" });
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    count: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 0,
  });
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setItems(mockNotifications);
      setPagination((prev) => ({
        ...prev,
        total: mockNotifications.length,
        count: mockNotifications.length,
        total_pages: Math.max(1, Math.ceil(mockNotifications.length / prev.per_page)),
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.title.toLowerCase().includes(query) || item.message.toLowerCase().includes(query));
  }, [items, searchInput]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredItems.length,
      count: filteredItems.length,
      total_pages: Math.max(1, Math.ceil(filteredItems.length / prev.per_page)),
      current_page: Math.min(prev.current_page, Math.max(1, Math.ceil(filteredItems.length / prev.per_page))) || 1,
    }));
  }, [filteredItems]);

  const actions: ITableAction<NotificationItem>[] = [
    {
      label: "Ver",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item) => setSelectedNotification({ ...item, status: "read" }),
    },
  ];

  const columns: ITableColumn<NotificationItem>[] = [
    {
      key: "title",
      header: "Título",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.title}</p>
          <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: "message",
      header: "Mensaje",
      render: (item) => <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>,
    },
    {
      key: "status",
      header: "Estado",
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "unread" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.status === "unread" ? "Sin leer" : "Leída"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "category",
      header: "Categoría",
      render: (item) => (
        <span className="text-sm capitalize text-gray-600">{item.category}</span>
      ),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar notificaciones"
          className="input w-full rounded-xl border border-gray-300 bg-white pl-11 text-sm text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );

  const tableProps: ITableProps<NotificationItem> = {
    data: filteredItems,
    columns,
    actions,
    sort,
    onSortChange: setSort,
    onFilterChange: () => undefined,
    onSearch: setSearchInput,
    pagination,
    onPageChange: (page) => setPagination((prev) => ({ ...prev, current_page: page })),
    onLimitChange: (limit) =>
      setPagination((prev) => ({
        ...prev,
        per_page: limit,
        current_page: 1,
        total_pages: Math.max(1, Math.ceil(filteredItems.length / limit)),
      })),
    loading,
    renderTopToolbar: renderToolbar,
    availableLimits: [10, 20, 50],
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Mis Notificaciones" icon={<Bell className="h-5 w-5" />} />
      <DataTable<NotificationItem> {...tableProps} />
      <NotificationDetailPanel notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
    </div>
  );
};

export default ContractorNotifications;
