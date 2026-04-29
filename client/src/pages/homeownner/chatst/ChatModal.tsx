import { useEffect, useState, useRef } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { MessageService } from "@/core/services/messages/message.service";
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

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

interface ChatModalProps {
  chat: ChatThread | null;
  onClose: () => void;
  onMessageSent?: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ chat, onClose, onMessageSent }) => {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showConfirmDeleteMessage, setShowConfirmDeleteMessage] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [showConfirmDeleteThread, setShowConfirmDeleteThread] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load all messages (homeowner view uses contractorId)
  useEffect(() => {
    if (!chat?.contractor_id) {
      setMessages(chat?.messages || []);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await MessageService.getConversation(chat.contractor_id!);
        if (!response.success || !response.data?.messages) {
          setMessages(chat.messages || []);
          return;
        }
        const mappedMessages: ChatMessage[] = response.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "App\\Models\\HomeownerProfile" ? "homeowner" : "contractor",
          content: msg.message,
          timestamp: msg.created_at,
        }));
        // try to capture thread id from response for delete actions
        const foundThreadId = response.data.thread?.id ?? response.data.thread_id ?? response.data.id ?? null;
        setThreadId(foundThreadId ? Number(foundThreadId) : null);
        setMessages(mappedMessages);
      } catch (error) {
        setMessages(chat.messages || []);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [chat?.contractor_id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !chat?.contractor_id || isSending) return;

    const messageContent = messageInput.trim();
    setIsSending(true);
    try {
      const optimisticMessage: ChatMessage = {
        id: Date.now(),
        sender: "homeowner",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageInput("");

      const res = await MessageService.sendMessage(chat.contractor_id!, { message: messageContent });
      if (!res.success) {
        throw new Error(res.message || "No se pudo enviar el mensaje");
      }

      const conversationResponse = await MessageService.getConversation(chat.contractor_id!);
      if (conversationResponse.success && conversationResponse.data?.messages) {
        const mappedMessages: ChatMessage[] = conversationResponse.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "App\\Models\\HomeownerProfile" ? "homeowner" : "contractor",
          content: msg.message,
          timestamp: msg.created_at,
        }));
        setMessages(mappedMessages);
      }

      if (onMessageSent) onMessageSent();
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };

  if (!chat) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-white sm:w-96 shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold">Conversación</p>
            <h3 className="text-lg font-bold text-gray-900">{chat.projectName}</h3>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Propietario</p>
              <p className="font-semibold text-gray-900">{chat.homeownerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Profesional</p>
              <p className="font-semibold text-gray-900">{chat.contractorName}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  <div className="h-3 w-3 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
                  <div className="h-3 w-3 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
                  <div className="h-3 w-3 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Cargando mensajes...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Send className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Aún no hay mensajes</p>
                <p className="text-xs text-gray-500 mt-1">¡Inicia la conversación!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                      <div key={`${message.id}-${index}`} className={`flex ${message.sender === "homeowner" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${message.sender === "homeowner" ? "bg-emerald-500 text-white rounded-br-sm" : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"}`}>
                    <div className={`mb-1.5 flex items-center gap-2 text-xs ${message.sender === "homeowner" ? "text-emerald-100" : "text-gray-500"}`}>
                      <span className="font-semibold">{message.sender === "homeowner" ? "Tú" : chat.contractorName}</span>
                      <span>•</span>
                      <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                          <div className="flex items-start gap-2">
                            <p className={`text-sm leading-relaxed ${message.sender === "homeowner" ? "text-white" : "text-gray-900"}`}>{message.content}</p>
                            {message.sender === 'homeowner' && threadId && (
                              <button
                                type="button"
                                onClick={() => { setDeleteMessageId(message.id); setShowConfirmDeleteMessage(true); }}
                                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-red-600 hover:bg-red-50"
                                title="Eliminar mensaje"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t bg-white px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isSending || loadingMessages}
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !messageInput.trim() || loadingMessages}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isSending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Enviar</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showConfirmDeleteMessage}
        title="Eliminar mensaje"
        message="¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => { setShowConfirmDeleteMessage(false); setDeleteMessageId(null); }}
        onConfirm={async () => {
          if (!threadId || deleteMessageId === null) return;
          setProcessingDelete(true);
          try {
            const res = await MessageService.deleteMessage(threadId, deleteMessageId);
            if (!res.success) throw new Error(res.message || 'No se pudo eliminar');
            // reload messages
            const conversation = await MessageService.getConversation(chat!.contractor_id!);
            if (conversation.success && conversation.data?.messages) {
              const mapped = conversation.data.messages.map((msg: any) => ({
                id: msg.id,
                sender: msg.sender_type === "App\\Models\\HomeownerProfile" ? "homeowner" : "contractor",
                content: msg.message,
                timestamp: msg.created_at,
              }));
              setMessages(mapped);
            }
          } catch (e: any) {
            console.error('No se pudo eliminar el mensaje', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDeleteMessage(false);
            setDeleteMessageId(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={showConfirmDeleteThread}
        title="Eliminar conversación"
        message="¿Estás seguro de que deseas eliminar esta conversación y todos sus mensajes? Esta acción no se puede deshacer."
        confirmText="Eliminar conversación"
        cancelText="Cancelar"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => setShowConfirmDeleteThread(false)}
        onConfirm={async () => {
          if (!threadId) return;
          setProcessingDelete(true);
          try {
            const res = await MessageService.deleteThread(threadId);
            if (!res.success) throw new Error(res.message || 'No se pudo eliminar');
            // close modal and inform parent to refresh threads
            if (onMessageSent) onMessageSent();
            onClose();
          } catch (e: any) {
            console.error('No se pudo eliminar la conversación', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDeleteThread(false);
          }
        }}
      />
    </>
  );
};

export default ChatModal;
