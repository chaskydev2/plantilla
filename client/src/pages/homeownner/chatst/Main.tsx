import { useEffect, useMemo, useState } from "react";
import { Eye, MessageSquare, Search, Trash2 } from "lucide-react";
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import type { ITableAction, ITableColumn, ITableProps, ITableSort } from "@/core/types/ITable";
import type { IPagination } from "@/core/types/IApi";
import { MessageService } from "@/core/services/messages/message.service";
import ChatModal from "./ChatModal";

interface ChatMessage {
  id: number;
  sender: "homeowner" | "contractor";
  content: string;
  timestamp: string;
}

interface ChatThread {
  id: number;
  homeownerName: string;
  contractorName: string;
  projectName: string;
  lastMessage: string;
  unreadCount: number;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  homeowner_profile_id?: number;
  contractor_id?: number;
}


// Modal moved to separate component file

const HomeownerChats: React.FC = () => {
  const [items, setItems] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<ITableSort>({ key: "updated_at", direction: "desc" });
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    count: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 0,
  });
  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [showConfirmDeleteThread, setShowConfirmDeleteThread] = useState(false);
  const [deleteThreadId, setDeleteThreadId] = useState<number | null>(null);
  const [processingDelete, setProcessingDelete] = useState(false);

  const fetchData = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      const userDataStr = localStorage.getItem("user_data");
      if (!userDataStr) { setLoading(false); return; }
      const userData = JSON.parse(userDataStr);
      const homeownerId = userData?.id;
      if (!homeownerId) { setLoading(false); return; }

      const response = await MessageService.getHomeownerAllThreads(homeownerId, page, perPage);
      if (!response || !response.success || !response.data?.threads) { setLoading(false); return; }

      const apiData = response.data;
      const homeownerName = userData?.name || userData?.username || "You";
      const mappedThreads: ChatThread[] = apiData.threads.map((thread: any) => {
        const contractorName = thread.contractor?.user?.name || thread.contractor?.name || "Unknown Professional";
        const lastMessage = thread.latest_message?.message || "No messages";
        const lastMessageTime = thread.latest_message?.created_at || thread.last_message_at;
        return {
          id: thread.id,
          homeownerName,
          contractorName,
          projectName: `Project ${thread.id}`,
          lastMessage,
          unreadCount: thread.unread_count || 0,
          created_at: thread.created_at || new Date().toISOString(),
          updated_at: lastMessageTime || thread.last_message_at || new Date().toISOString(),
          messages: thread.latest_message ? [{
            id: thread.latest_message.id,
            sender: thread.latest_message.sender_type === "App\\Models\\HomeownerProfile" ? "homeowner" : "contractor",
            content: thread.latest_message.message,
            timestamp: thread.latest_message.created_at,
          }] : [],
          homeowner_profile_id: thread.homeowner_profile_id,
          contractor_id: thread.contractor_id,
        };
      });

      setItems(mappedThreads);
      if (apiData.pagination) {
        setPagination({
          total: apiData.pagination.total,
          count: mappedThreads.length,
          per_page: apiData.pagination.per_page,
          current_page: apiData.pagination.current_page,
          total_pages: apiData.pagination.last_page,
        });
      }
    } catch (error) {
      console.error("Error fetching homeowner chats", error);
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
    return items.filter((item) => {
      return (
        item.projectName.toLowerCase().includes(query) ||
        item.contractorName.toLowerCase().includes(query) ||
        item.homeownerName.toLowerCase().includes(query) ||
        item.lastMessage.toLowerCase().includes(query)
      );
    });
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

  const actions: ITableAction<ChatThread>[] = [
    { label: "View chat", icon: <Eye className="w-4 h-4" />, onClick: (chat) => setActiveChat(chat), variant: "secondary" },
    { label: "Delete", icon: <Trash2 className="w-4 h-4" />, onClick: (item) => { setDeleteThreadId(item.id); setShowConfirmDeleteThread(true); }, variant: "danger" },
  ];

  const columns: ITableColumn<ChatThread>[] = [
    {
      key: "participant",
      header: "Professional",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.contractorName}</p>
          <p className="text-xs text-gray-500">Project: {item.projectName}</p>
        </div>
      ),
    },
    {
      key: "lastMessage",
      header: "Last message",
      render: (item) => (
        <div className="text-sm text-gray-600 line-clamp-2">{item.lastMessage}</div>
      ),
    },
    {
      key: "unreadCount",
      header: "Unread",
      render: (item) => (
        <span className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-3 py-1 text-xs font-semibold ${item.unreadCount ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>
          {item.unreadCount}
        </span>
      ),
      sortable: true,
    },
    {
      key: "updated_at",
      header: "Updated",
      render: (item) => (
        <div className="text-xs text-gray-500">{new Date(item.updated_at).toLocaleString()}</div>
      ),
      sortable: true,
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
          placeholder="Search chats, projects, or professionals"
          className="input w-full rounded-xl border border-gray-300 bg-white pl-11 text-sm text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );

  const tableProps: ITableProps<ChatThread> = {
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
      <PageBreadcrumb pageTitle="My Chats" icon={<MessageSquare className="h-5 w-5" />} />
      <DataTable<ChatThread> {...tableProps} />
      <ChatModal chat={activeChat} onClose={() => setActiveChat(null)} onMessageSent={() => fetchData(pagination.current_page, pagination.per_page)} />
      <ConfirmDialog
        isOpen={showConfirmDeleteThread}
        title="Delete conversation"
        message="Are you sure you want to delete this conversation and all its messages? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => { setShowConfirmDeleteThread(false); setDeleteThreadId(null); }}
        onConfirm={async () => {
          if (deleteThreadId === null) return;
          setProcessingDelete(true);
          try {
            const res = await MessageService.deleteThread(deleteThreadId);
            if (!res.success) throw new Error(res.message || 'Delete failed');
            fetchData(pagination.current_page, pagination.per_page);
          } catch (e: any) {
            console.error('Failed to delete thread', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDeleteThread(false);
            setDeleteThreadId(null);
          }
        }}
      />
    </div>
  );
};

export default HomeownerChats;
