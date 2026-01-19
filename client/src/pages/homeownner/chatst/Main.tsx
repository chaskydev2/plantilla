import { useEffect, useMemo, useState } from "react";
import { Eye, MessageSquare, Search, X } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DataTable from "@/components/table/DataTable";
import type { ITableAction, ITableColumn, ITableProps, ITableSort } from "@/core/types/ITable";
import type { IPagination } from "@/core/types/IApi";

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
}

const mockChats: ChatThread[] = [
  {
    id: 1,
    homeownerName: "Laura Pérez",
    contractorName: "ConstruMar SRL",
    projectName: "Remodelación de cocina",
    lastMessage: "Perfecto, nos vemos el jueves a las 10am",
    unreadCount: 2,
    created_at: "2024-09-01T10:05:00Z",
    updated_at: "2024-09-12T14:30:00Z",
    messages: [
      {
        id: 11,
        sender: "homeowner",
        content: "Hola, ¿podemos reagendar la visita?",
        timestamp: "2024-09-12T13:42:00Z",
      },
      {
        id: 12,
        sender: "contractor",
        content: "Claro Laura, ¿te funciona el jueves a las 10am?",
        timestamp: "2024-09-12T14:02:00Z",
      },
      {
        id: 13,
        sender: "homeowner",
        content: "Perfecto, nos vemos entonces 🙂",
        timestamp: "2024-09-12T14:30:00Z",
      },
    ],
  },
  {
    id: 2,
    homeownerName: "Carlos Gutiérrez",
    contractorName: "Electricistas Norte",
    projectName: "Instalación de luminarias",
    lastMessage: "Envié el presupuesto actualizado",
    unreadCount: 0,
    created_at: "2024-08-21T09:12:00Z",
    updated_at: "2024-09-10T16:15:00Z",
    messages: [
      {
        id: 21,
        sender: "contractor",
        content: "Envié el presupuesto actualizado",
        timestamp: "2024-09-10T16:15:00Z",
      },
      {
        id: 22,
        sender: "homeowner",
        content: "Lo revisaré esta noche, gracias",
        timestamp: "2024-09-10T16:31:00Z",
      },
    ],
  },
  {
    id: 3,
    homeownerName: "Mariana Flores",
    contractorName: "Jardines Vivos",
    projectName: "Diseño de jardín",
    lastMessage: "¿Podemos adelantar la entrega dos días?",
    unreadCount: 5,
    created_at: "2024-07-02T11:18:00Z",
    updated_at: "2024-09-05T09:55:00Z",
    messages: [
      {
        id: 31,
        sender: "homeowner",
        content: "¿Podemos adelantar la entrega dos días?",
        timestamp: "2024-09-05T09:55:00Z",
      },
      {
        id: 32,
        sender: "contractor",
        content: "Déjame revisar con el equipo y te confirmo",
        timestamp: "2024-09-05T10:05:00Z",
      },
    ],
  },
];

const ChatPreviewPanel = ({ chat, onClose }: { chat: ChatThread | null; onClose: () => void }) => {
  if (!chat) return null;

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Conversación</p>
          <h3 className="text-lg font-bold text-gray-900">{chat.projectName}</h3>
        </div>
        <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-6 py-4 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-900">Propietario:</span> {chat.homeownerName}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Profesional:</span> {chat.contractorName}
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto px-6 pb-6 space-y-4">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`w-full rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
              message.sender === "homeowner" ? "border-emerald-100 bg-emerald-50" : "border-sky-100 bg-sky-50"
            }`}
          >
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">
                {message.sender === "homeowner" ? "Tú" : chat.contractorName}
              </span>
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </div>
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setItems(mockChats);
      setPagination((prev) => ({
        ...prev,
        total: mockChats.length,
        count: mockChats.length,
        total_pages: Math.max(1, Math.ceil(mockChats.length / prev.per_page)),
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
    {
      label: "Ver chat",
      icon: <Eye className="w-4 h-4" />,
      onClick: (chat) => setActiveChat(chat),
      variant: "secondary",
    },
  ];

  const columns: ITableColumn<ChatThread>[] = [
    {
      key: "participant",
      header: "Profesional",
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{item.contractorName}</p>
          <p className="text-xs text-gray-500">Proyecto: {item.projectName}</p>
        </div>
      ),
    },
    {
      key: "lastMessage",
      header: "Último mensaje",
      render: (item) => (
        <div className="text-sm text-gray-600 line-clamp-2">{item.lastMessage}</div>
      ),
    },
    {
      key: "unreadCount",
      header: "Sin leer",
      render: (item) => (
        <span className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-3 py-1 text-xs font-semibold ${item.unreadCount ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>
          {item.unreadCount}
        </span>
      ),
      sortable: true,
    },
    {
      key: "updated_at",
      header: "Actualizado",
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
          placeholder="Buscar chats, proyectos o profesionales"
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
      <PageBreadcrumb pageTitle="Mis Chats" icon={<MessageSquare className="h-5 w-5" />} />
      <DataTable<ChatThread> {...tableProps} />
      <ChatPreviewPanel chat={activeChat} onClose={() => setActiveChat(null)} />
    </div>
  );
};

export default HomeownerChats;
