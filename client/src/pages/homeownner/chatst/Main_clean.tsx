import { useEffect, useMemo, useState } from "react";
import { Eye, MessageSquare, Search } from "lucide-react";
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
  contractorName: string;
  homeownerName: string;
  projectName: string;
  lastMessage: string;
  unreadCount: number;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  homeowner_profile_id?: number;
  contractor_id?: number;
}

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

  const fetchData = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      const userDataStr = localStorage.getItem("user_data");
      if (!userDataStr) return setLoading(false);
      const userData = JSON.parse(userDataStr);
      const homeownerId = userData?.id;
      if (!homeownerId) return setLoading(false);

      const response = await MessageService.getHomeownerAllThreads(homeownerId, page, perPage);
      if (!response?.success || !response.data?.threads) return setLoading(false);

      const apiData = response.data;
      const homeownerName = userData?.name || userData?.username || "You";

      const mappedThreads: ChatThread[] = apiData.threads.map((thread: any) => {
        const contractorName = thread.contractor?.user?.name || thread.contractor?.name || "Unknown Professional";
        const lastMessage = thread.latest_message?.message || "No messages";
        const lastMessageTime = thread.latest_message?.created_at || thread.last_message_at;
        return {
          id: thread.id,
          contractorName,
          homeownerName,
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenChat = (chat: ChatThread) => setActiveChat(chat);
  const handleCloseChat = () => setActiveChat(null);
  const handleMessageSent = () => fetchData(pagination.current_page, pagination.per_page);

  const filteredItems = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.projectName.toLowerCase().includes(q) || i.contractorName.toLowerCase().includes(q) || i.homeownerName.toLowerCase().includes(q) || i.lastMessage.toLowerCase().includes(q));
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
    { label: "View chat", icon: <Eye className="w-4 h-4" />, onClick: handleOpenChat, variant: "secondary" },
  ];

  const columns: ITableColumn<ChatThread>[] = [
    { key: "participant", header: "Professional", render: (item) => (
      <div>
        <p className="font-semibold text-gray-900">{item.contractorName}</p>
        <p className="text-xs text-gray-500">Project: {item.projectName}</p>
      </div>
    ) },
    { key: "lastMessage", header: "Last message", render: (item) => (<div className="text-sm text-gray-600 line-clamp-2">{item.lastMessage}</div>) },
    { key: "unreadCount", header: "Unread", render: (item) => (<span className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-3 py-1 text-xs font-semibold ${item.unreadCount ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>{item.unreadCount}</span>), sortable: true },
    { key: "updated_at", header: "Updated", render: (item) => (<div className="text-xs text-gray-500">{new Date(item.updated_at).toLocaleString()}</div>), sortable: true },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-72">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><Search className="h-5 w-5" /></div>
        <input type="text" placeholder="Search chats, projects or professionals" className="input w-full rounded-xl border border-gray-300 bg-white pl-11 text-sm text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-600" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
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
    onPageChange: (page) => { setPagination((prev) => ({ ...prev, current_page: page })); fetchData(page, pagination.per_page); },
    onLimitChange: (limit) => { setPagination((prev) => ({ ...prev, per_page: limit, current_page: 1 })); fetchData(1, limit); },
    loading,
    renderTopToolbar: renderToolbar,
    availableLimits: [10, 20, 50],
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="My Chats" icon={<MessageSquare className="h-5 w-5" />} />
      <DataTable<ChatThread> {...tableProps} />
      <ChatModal chat={activeChat} onClose={handleCloseChat} onMessageSent={handleMessageSent} />
    </div>
  );
};

export default HomeownerChats;
