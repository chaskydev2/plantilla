import { useEffect, useMemo, useState } from "react";
import { Bell, Eye, Search, ShieldCheck, X } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import type { ITableAction, ITableColumn, ITableProps, ITableSort } from "@/core/types/ITable";
import type { IPagination } from "@/core/types/IApi";
import useAuth from "@/core/hooks/useAuth";
import { NotificationService } from "@/core/services/notification/notification.service";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  status: "read" | "unread";
  category: "booking" | "system" | "payment" | "security";
  created_at: string;
  updated_at: string;
  url?: string | null;
}

// Notifications will be loaded from backend API

const NotificationDetailPanel = ({
  notification,
  onClose,
  onDelete,
}: {
  notification: NotificationItem | null;
  onClose: () => void;
  onDelete?: (id: number) => void | Promise<void>;
}) => {
  if (!notification) return null;

  const badgeStyles: Record<NotificationItem["category"], string> = {
    booking: "bg-indigo-100 text-indigo-700",
    system: "bg-gray-100 text-gray-600",
    payment: "bg-emerald-100 text-emerald-700",
    security: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(720px,95%)] rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Notification details</p>
            <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {notification.url && (
              <a
                href={notification.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100"
              >
                Open URL
              </a>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(notification.id)}
                className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-3 py-1 text-sm text-rose-700 hover:bg-rose-100"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 px-6 py-5 text-sm text-gray-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[notification.category]}`}>
              {notification.category === "booking" && "Bookings"}
              {notification.category === "system" && "System"}
              {notification.category === "payment" && "Payments"}
              {notification.category === "security" && "Security"}
            </span>
            <span className="text-xs text-gray-500">Received: {new Date(notification.created_at).toLocaleString()}</span>
            <span className="text-xs text-gray-500">Updated: {new Date(notification.updated_at).toLocaleString()}</span>
          </div>
          <p className="text-base text-gray-800">{notification.message}</p>
          {notification.category === "security" && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <ShieldCheck className="h-4 w-4 text-gray-500" />
              We recommend enabling two-factor authentication to keep your account secure.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomeownerNotifications: React.FC = () => {
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
  const { user } = useAuth();
  const [showConfirmAllRead, setShowConfirmAllRead] = useState(false);
  const [processingAllRead, setProcessingAllRead] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [deleteAllMode, setDeleteAllMode] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setItems([]);
        return;
      }

      const userId = Number(user.id);

      const params: Record<string, any> = {
        per_page: pagination.per_page,
        page: pagination.current_page,
      };

      if (searchInput.trim()) params.search = searchInput.trim();

      const api = await NotificationService.getByUser(userId, params);
      const data: NotificationItem[] = api.data || [];
      const meta: Partial<IPagination> = api.meta?.pagination ?? {};

      setItems(data);
      setPagination((prev) => ({
        ...prev,
        total: meta.total ?? data.length,
        count: data.length,
        per_page: meta.per_page ?? prev.per_page,
        current_page: meta.current_page ?? prev.current_page,
        total_pages: meta.total_pages ?? Math.max(1, Math.ceil((meta.total ?? data.length) / prev.per_page)),
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // refetch when pagination or search changes
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, pagination.per_page, searchInput, user?.id]);

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
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: async (item) => {
        setSelectedNotification(item);
        try {
          if (!user?.id) return;
          const userId = Number(user.id);
          await NotificationService.markRead(userId, item.id);
          // optimistically update local state
          setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "read" } : it)));
        } catch (e) {
          // ignore - keep optimistic behavior
        }
      },
    },
    {
      label: "Delete",
      icon: <X className="h-4 w-4" />,
      onClick: async (item) => {
        if (!user?.id) return;
        setDeleteAllMode(false);
        setDeleteTargetId(item.id);
        setShowConfirmDelete(true);
      },
    },
  ];

  const columns: ITableColumn<NotificationItem>[] = [
    {
      key: "title",
      header: "Title",
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
      header: "Message",
      render: (item) => <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "unread" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.status === "unread" ? "Unread" : "Read"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="text-sm capitalize text-gray-600">{item.category}</span>
      ),
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowConfirmAllRead(true)}
          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-100"
        >
          Mark all read
        </button>
        <button
          type="button"
          onClick={() => {
              if (!user?.id) return;
              setDeleteAllMode(true);
              setDeleteTargetId(null);
              setShowConfirmDelete(true);
            }}
          className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
        >
          Delete all
        </button>
      </div>
      <div className="relative w-full sm:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
              placeholder="Search notifications"
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
        per_page: Number(limit),
        current_page: 1,
        total_pages: Math.max(1, Math.ceil(filteredItems.length / Number(limit))),
      })),
    loading,
    renderTopToolbar: renderToolbar,
    availableLimits: [10, 20, 50],
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="My Notifications" icon={<Bell className="h-5 w-5" />} />
      <DataTable<NotificationItem> {...tableProps} />
      <NotificationDetailPanel
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onDelete={(id) => {
          if (!user?.id) return;
          setDeleteAllMode(false);
          setDeleteTargetId(id);
          setShowConfirmDelete(true);
        }}
      />
      <ConfirmDialog
        isOpen={showConfirmAllRead}
        title="Mark all as read"
        message={"Are you sure you want to mark all notifications as read?"}
        confirmText="Mark all"
        cancelText="Cancel"
        isProcessing={processingAllRead}
        variant="success"
        onCancel={() => setShowConfirmAllRead(false)}
        onConfirm={async () => {
          if (!user?.id) return;
          const userId = Number(user.id);
          setProcessingAllRead(true);
            try {
              await NotificationService.markAllRead(userId);
              await fetchData();
            } catch (e: any) {
              console.error('Failed to mark all read', e);
            } finally {
              setProcessingAllRead(false);
              setShowConfirmAllRead(false);
            }
        }}
      />
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title={deleteAllMode ? "Delete all notifications" : "Delete notification"}
        message={deleteAllMode ? "Are you sure you want to delete ALL notifications? This cannot be undone." : "Are you sure you want to delete this notification?"}
        confirmText="Delete"
        cancelText="Cancel"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          if (!user?.id) return;
          const userId = Number(user.id);
          setProcessingDelete(true);
          try {
            if (deleteAllMode) {
              console.log("teteo de el cick enviado");

              await NotificationService.removeAll(userId);
              await fetchData();
            } else if (deleteTargetId !== null) {
              console.log("teteo de el cick enviado");
              await NotificationService.remove(userId, deleteTargetId);
              await fetchData();
              if (selectedNotification?.id === deleteTargetId) setSelectedNotification(null);
            }
          } catch (e: any) {
            console.error('Failed to delete notification(s)', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDelete(false);
            setDeleteTargetId(null);
            setDeleteAllMode(false);
          }
        }}
      />
    </div>
  );
};

export default HomeownerNotifications;
