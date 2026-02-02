import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ShieldCheck, MessageCircle, Send, Sparkles } from "lucide-react";
import { MessageService } from "@/core/services/messages/message.service";

export type ChatSender = "support" | "contractor" | "homeowner";

export interface ChatMessage {
  id: number;
  sender: ChatSender;
  text: string;
  timestamp: string;
}

interface ContractorChatAsideProps {
  messages: ChatMessage[];
  messageDraft: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onDraftChange: (event: ChangeEvent<HTMLInputElement>) => void;
  quickReplies?: string[];
  onQuickReplySelect?: (value: string) => void;
  rating?: number;
  onRatingChange?: (value: number) => void;
  onRatingSubmit?: (rating: number) => Promise<void> | void;
  contractorId: number | string;
  onMessageSent?: (message: any) => void;
  isLoadingChat?: boolean;
}

export function ContractorChatAside({
  messages,
  messageDraft,
  onSubmit,
  onDraftChange,
  quickReplies,
  onQuickReplySelect,
  contractorId,
  onMessageSent,
  isLoadingChat = false,
}: ContractorChatAsideProps) {
  const replies = quickReplies ?? [
    "Could you share today's update?",
    "Need help scheduling a visit.",
    "Let's review outstanding items.",
  ];

  const [sending, setSending] = useState(false);

  const handleInternalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated || !messageDraft.trim() || sending) return;

    // Si hay un onSubmit personalizado, usarlo
    if (onSubmit) {
      onSubmit(event);
      return;
    }

    // Lógica interna de envío usando MessageService
    const trimmedMessage = messageDraft.trim();
    setSending(true);

    console.log(contractorId);
    try {
      const response = await MessageService.sendMessage(contractorId, {
        message: trimmedMessage,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send message.");
      }

      // Limpiar el input
      const clearEvent = {
        target: { value: "" },
      } as unknown as ChangeEvent<HTMLInputElement>;
      onDraftChange(clearEvent);

      // Notificar al padre si hay callback
      if (onMessageSent && response.data) {
        onMessageSent(response.data.message);
      }

    } catch (error: any) {
      console.error("Chat send error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "No se pudo enviar el mensaje.";
      alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const sections = useMemo(() => {
    if (!messages.length) return [] as Array<{ dayLabel: string; items: Array<ChatMessage & { timeLabel: string }> }>;

    const dayFormatter = new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeFormatter = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return messages.reduce<Array<{ dayLabel: string; items: Array<ChatMessage & { timeLabel: string }> }>>((accumulator, message) => {
      const parsedDate = new Date(message.timestamp);
      const fallbackLabel = message.timestamp;
      const hasValidDate = !Number.isNaN(parsedDate.getTime());

      const dayLabel = hasValidDate ? dayFormatter.format(parsedDate) : "Recientes";
      const timeLabel = hasValidDate ? timeFormatter.format(parsedDate) : fallbackLabel;

      const enrichedMessage = { ...message, timeLabel };
      const lastSection = accumulator[accumulator.length - 1];

      if (lastSection && lastSection.dayLabel === dayLabel) {
        lastSection.items.push(enrichedMessage);
        return accumulator;
      }

      accumulator.push({ dayLabel, items: [enrichedMessage] });
      return accumulator;
    }, []);
  }, [messages]);

  const authToken = typeof window !== "undefined"
    ? window.localStorage.getItem("authToken") ?? window.localStorage.getItem("_tkn")
    : null;
  let storedName = "";
  let isContractorRole = false;
  if (typeof window !== "undefined") {
    const rawUser = window.localStorage.getItem("user_data");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        storedName = (parsed?.name ?? parsed?.username ?? parsed?.user_name ?? "").trim();
        const roleName = parsed?.role_name?.toLowerCase() || "";
        const roles = parsed?.roles || [];
        isContractorRole = roleName.includes("contractor") || 
          roles.some((role: any) => role.name?.toLowerCase() === "contractor");
      } catch {
        storedName = "";
      }
    }
  }
  const isAuthenticated = Boolean(authToken && storedName && !isContractorRole);
  const loginHref = "/login";
  const registerHref = "/formulario_solicitud";

  const handleQuickReply = (value: string) => {
    if (!isAuthenticated) {
      return;
    }
    if (onQuickReplySelect) {
      onQuickReplySelect(value);
      return;
    }

    const syntheticEvent = {
      target: { value },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onDraftChange(syntheticEvent);
  };

  const isSendDisabled = !isAuthenticated || !messageDraft.trim().length || sending;

  return (
    <aside className="flex flex-col rounded-3xl border border-[#F5D238]/35 bg-gradient-to-br from-[#181818] via-[#111] to-[#1f1f1f] p-5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.46)] lg:mx-auto lg:max-w-md lg:w-auto lg:self-start lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">
            <ShieldCheck className="h-3.5 w-3.5" /> Concierge Support
          </span>
          <div>
            <h2 className="text-lg font-semibold">Support chat</h2>
            <p className="text-xs text-white/55">Follow up with your assigned advisor any time.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-3 py-1 text-xs font-semibold text-[#1E1E17] shadow">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#1E1E17]" />
          Online
        </span>
      </div>

      {!isAuthenticated && (
        <div className="mt-4 rounded-2xl border border-[#F5D238]/40 bg-[#1E1E17]/70 px-4 py-4 text-sm text-white/80">
          <p className="text-[#F5D238] font-semibold uppercase tracking-wide text-xs">
            {isContractorRole ? "Access restricted" : "Sign in required"}
          </p>
          <p className="mt-2 text-xs">
            {isContractorRole 
              ? "Contractors cannot send messages from this chat. Only homeowners can initiate conversations with contractors."
              : "Create an account or log in to message this contractor. Once you are signed in, the conversation will unlock automatically."
            }
          </p>
          {!isContractorRole && (
            <div className="mt-3 flex gap-2">
              <a
                href={loginHref}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[#F5D238] bg-[#F5D238] px-3 py-2 text-xs font-bold text-[#1E1E17] transition hover:bg-[#f7df52]"
              >
                Log in
              </a>
              <a
                href={registerHref}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/25 bg-transparent px-3 py-2 text-xs font-semibold text-white transition hover:border-[#F5D238]/60 hover:text-[#F5D238]"
              >
                Register
              </a>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
        <div className="flex max-h-[420px] flex-col gap-4 overflow-y-auto pr-1" role="log" aria-live="polite">
          {isLoadingChat ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-6 text-center text-xs text-white/60">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5D238]" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5D238] animation-delay-100" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#F5D238] animation-delay-200" />
              </div>
              <p>Cargando chats...</p>
            </div>
          ) : (
            <>
              {sections.map((section) => (
                <div key={section.dayLabel} className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                    <span className="h-px flex-1 bg-white/10" />
                    {section.dayLabel}
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  {section.items.map((message) => {
                    const isSupport = message.sender === "support";
                    const isHomeowner = message.sender === "homeowner";
                    return (
                      <div key={message.id} className={`flex ${isSupport ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`relative max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm transition ${
                            isSupport
                              ? "border border-white/20 bg-white text-[#101010]"
                              : isHomeowner
                              ? "border border-[#F5D238]/30 bg-gradient-to-br from-[#070707] to-[#23231b] text-white"
                              : "border border-[#F5D238]/30 bg-gradient-to-br from-[#070707] to-[#23231b] text-white"
                          }`}
                        >
                          <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                          <span
                            className={`mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider ${
                              isSupport ? "text-[#101010]/55" : "text-white/60"
                            }`}
                          >
                            <MessageCircle className="h-3 w-3" aria-hidden />
                            {message.timeLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {!messages.length && (
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-6 text-center text-xs text-white/60">
                  <Sparkles className="h-6 w-6 text-[#F5D238]" aria-hidden />
                  <p>Start a conversation with support and we&apos;ll reply in minutes.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!!replies.length && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-white/70">
          {replies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 transition hover:border-[#F5D238]/60 hover:bg-[#F5D238]/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isAuthenticated}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleInternalSubmit}
        className="mt-4 flex gap-2"
        aria-label="Enviar mensaje al equipo de soporte"
      >
        <input
          type="text"
          value={messageDraft}
          onChange={(event) => {
            if (!isAuthenticated) return;
            onDraftChange(event);
          }}
          placeholder={isAuthenticated ? "Type your message..." : "Sign in to send messages"}
          className="flex-1 rounded-full border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#F5D238]/60 focus:outline-none focus:ring-2 focus:ring-[#F5D238]/45 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isAuthenticated}
          aria-label="Escribe tu mensaje"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5D238] px-4 py-2.5 text-sm font-semibold text-[#1E1E17] shadow-sm transition hover:bg-[#F5D238]/85 disabled:cursor-not-allowed disabled:bg-[#F5D238]/50"
          disabled={isSendDisabled}
          aria-disabled={isSendDisabled}
        >
          {sending ? "Sending..." : "Send"}
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </aside>
  );
}
