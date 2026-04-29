import { useEffect, useState, useRef } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { MessageService } from "@/core/services/messages/message.service";
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface ChatMessage {
  id: number;
  sender: "contractor" | "homeowner";
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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [showConfirmDeleteMessage, setShowConfirmDeleteMessage] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [showConfirmDeleteThread, setShowConfirmDeleteThread] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load all messages when chat opens
  useEffect(() => {
    if (!chat?.id) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        console.log("📥 Loading messages for thread:", chat.id);
        const response = await MessageService.getContractorConversation(chat.id);
        
        console.log("📨 Conversation response:", response);

        if (!response.success) {
          console.error("❌ Failed to load messages:", response.message);
          setMessages(chat.messages || []);
          return;
        }

        if (!response.data?.messages || response.data.messages.length === 0) {
          console.log("⚠️ No messages in response, using fallback");
          setMessages(chat.messages || []);
          return;
        }

        console.log("✅ Messages loaded:", response.data.messages);
        
        // Map messages from API
        const mappedMessages: ChatMessage[] = response.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "App\\Models\\Contractor" ? "contractor" : "homeowner",
          content: msg.message,
          timestamp: msg.created_at,
        }));

        console.log("📦 Mapped messages:", mappedMessages);
        setMessages(mappedMessages);
        // set thread id for delete operations
        const foundThreadId = response.data.thread?.id ?? response.data.thread_id ?? chat.id;
        setThreadId(foundThreadId ? Number(foundThreadId) : null);
      } catch (error) {
        console.error("❌ Error loading messages:", error);
        setMessages(chat.messages || []);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [chat?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !chat || isSending) return;

    const messageContent = messageInput.trim();
    setIsSending(true);
    
    try {
      // Get contractor ID from localStorage
      const userDataStr = localStorage.getItem("user_data");
      if (!userDataStr) {
        throw new Error("No user data found");
      }

      const userData = JSON.parse(userDataStr);
      const contractorId = userData?.id;

      if (!contractorId) {
        throw new Error("No contractor ID found");
      }

      // Add optimistic message
      const optimisticMessage: ChatMessage = {
        id: Date.now(),
        sender: "contractor",
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageInput("");

      console.log("📤 Sending reply - ContractorId:", contractorId, "ThreadId:", chat.id);
      const response = await MessageService.contractorReplyToThread(
        contractorId, 
        chat.id, 
        { message: messageContent }
      );
      
      if (!response.success) {
        throw new Error(response.message || "Failed to send reply");
      }

      console.log("✅ Reply sent successfully");
      
      // Reload messages to get the real message from server
      const conversationResponse = await MessageService.getContractorConversation(chat.id);
      if (conversationResponse.success && conversationResponse.data?.messages) {
        const mappedMessages: ChatMessage[] = conversationResponse.data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "App\\Models\\Contractor" ? "contractor" : "homeowner",
          content: msg.message,
          timestamp: msg.created_at,
        }));
        setMessages(mappedMessages);
      }

      // Notify parent component
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      alert(errorMessage);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(msg => msg.id !== Date.now()));
    } finally {
      setIsSending(false);
    }
  };

  if (!chat) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-white sm:w-96 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="border-b px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Professional</p>
              <p className="font-semibold text-gray-900">{chat.contractorName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Homeowner</p>
              <p className="font-semibold text-gray-900">{chat.homeownerName}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0ms" }} />
                  <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "150ms" }} />
                  <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <Send className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No messages yet</p>
                <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${message.sender === "contractor" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.sender === "contractor"
                              ? "bg-blue-500 text-white rounded-br-sm"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                          }`}
                  >
                    <div className={`mb-1.5 flex items-center gap-2 text-xs ${
                      message.sender === "contractor" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      <span className="font-semibold">
                        {message.sender === "contractor" ? "You" : chat.homeownerName}
                      </span>
                      <span>•</span>
                      <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className={`text-sm leading-relaxed ${
                        message.sender === "contractor" ? "text-white" : "text-gray-900"
                      }`}>
                        {message.content}
                      </p>
                      {message.sender === 'contractor' && threadId && (
                        <button
                          type="button"
                          onClick={() => { setDeleteMessageId(message.id); setShowConfirmDeleteMessage(true); }}
                          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-red-600 hover:bg-red-50"
                          title="Delete message"
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

        {/* Message Input Form */}
        <div className="border-t bg-white px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending || loadingMessages}
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !messageInput.trim() || loadingMessages}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              {isSending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      {/* Confirm delete message */}
      <ConfirmDialog
        isOpen={showConfirmDeleteMessage}
        title="Delete message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => { setShowConfirmDeleteMessage(false); setDeleteMessageId(null); }}
        onConfirm={async () => {
          if (!threadId || deleteMessageId === null) return;
          setProcessingDelete(true);
          try {
            const res = await MessageService.deleteMessage(threadId, deleteMessageId);
            if (!res.success) throw new Error(res.message || 'Delete failed');
            // reload messages
            const conversation = await MessageService.getContractorConversation(chat.id);
            if (conversation.success && conversation.data?.messages) {
              const mapped = conversation.data.messages.map((msg: any) => ({
                id: msg.id,
                sender: msg.sender_type === "App\\Models\\Contractor" ? "contractor" : "homeowner",
                content: msg.message,
                timestamp: msg.created_at,
              }));
              setMessages(mapped);
            }
          } catch (e: any) {
            console.error('Failed to delete message', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDeleteMessage(false);
            setDeleteMessageId(null);
          }
        }}
      />

      {/* Confirm delete thread */}
      <ConfirmDialog
        isOpen={showConfirmDeleteThread}
        title="Delete conversation"
        message="Are you sure you want to delete this conversation and all its messages? This cannot be undone."
        confirmText="Delete conversation"
        cancelText="Cancel"
        isProcessing={processingDelete}
        variant="danger"
        onCancel={() => setShowConfirmDeleteThread(false)}
        onConfirm={async () => {
          if (!threadId) return;
          setProcessingDelete(true);
          try {
            const res = await MessageService.deleteThread(threadId);
            if (!res.success) throw new Error(res.message || 'Delete failed');
            if (onMessageSent) onMessageSent();
            onClose();
          } catch (e: any) {
            console.error('Failed to delete thread', e);
          } finally {
            setProcessingDelete(false);
            setShowConfirmDeleteThread(false);
          }
        }}
      />
      </div>
    </>
  );
};

export default ChatModal;
