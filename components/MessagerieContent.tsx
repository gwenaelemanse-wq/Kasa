"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessagesContext";
import { getMessagesAction, sendMessageAction, type Message } from "@/lib/actions/messages";

export default function MessagerieContent({
  onClose,
  initialConversationId = null,
}: {
  onClose?: () => void;
  initialConversationId?: number | null;
}) {
  const { user, token } = useAuth();
  const { conversations, isLoaded, refresh } = useMessages();

  const [selectedId, setSelectedId] = useState<number | null>(initialConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  // On ne veut sélectionner automatiquement la première conversation
  // qu'UNE SEULE FOIS au premier chargement — sinon, revenir à la liste sur
  // mobile (qui remet selectedId à null) re-sélectionnerait aussitôt la
  // première conversation, et le bouton "retour" ne servirait à rien.
  const hasAutoSelected = useRef(false);
  useEffect(() => {
    if (!hasAutoSelected.current && !selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
      hasAutoSelected.current = true;
    }
  }, [conversations, selectedId]);

  useEffect(() => {
    if (!token || !selectedId) return;
    getMessagesAction(selectedId, token).then((data) => {
      setMessages(data);
      refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, token]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!token || !selectedId || !draft.trim()) return;

    setIsSending(true);
    try {
      const newMessage = await sendMessageAction(selectedId, draft, token);
      setMessages((prev) => [...prev, newMessage]);
      setDraft("");
      refresh();
    } finally {
      setIsSending(false);
    }
  }

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  if (!user || !token) {
    return (
      <div className="p-8 text-center text-gray-500">
        Connectez-vous pour accéder à vos messages.
      </div>
    );
  }

  // Sur mobile, on affiche SOIT la liste, SOIT le fil de discussion, jamais
  // les deux : la liste si aucune conversation n'est sélectionnée, le fil
  // sinon. À partir de la taille tablette (md), les deux sont toujours
  // visibles côte à côte, quel que soit selectedId.
  const showListOnMobile = !selectedId;

  return (
    <div className="flex h-[85vh] max-h-[700px] md:h-[600px]">
      {/* Liste des conversations */}
      <div
        className={`${showListOnMobile ? "flex" : "hidden"} w-full max-w-xs flex-col border-r border-gray-100 p-4 md:flex`}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mb-4 self-start rounded-full border border-gray-200 px-3 py-1.5 text-sm"
          >
            ← Retour
          </button>
        )}
        <h1 className="mb-4 text-2xl font-bold">Messages</h1>

        {!isLoaded && <p className="text-sm text-gray-400">Chargement...</p>}

        {isLoaded && conversations.length === 0 && (
          <p className="text-sm text-gray-400">Aucune conversation pour l&apos;instant.</p>
        )}

        <ul className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <button
                type="button"
                onClick={() => setSelectedId(conv.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left ${
                  selectedId === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <span className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between">
                    <span className="font-medium">{conv.other.name}</span>
                  </span>
                  <span className="block truncate text-sm text-gray-500">
                    {conv.last_message || conv.property_title}
                  </span>
                </span>
                {conv.unread_count > 0 && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF6060]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Fil de discussion */}
      <div
        className={`${showListOnMobile ? "hidden" : "flex"} flex-1 flex-col bg-[#FFF8F5] md:flex`}
      >
        {/* Barre mobile : retour à la liste + fermer complètement */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            ← Conversations
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la messagerie"
            >
              ✕
            </button>
          )}
        </div>

        {!selectedConversation ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Sélectionnez une conversation
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 bg-white p-4">
              <p className="font-medium">{selectedConversation.other.name}</p>
              <p className="text-xs text-gray-400">{selectedConversation.property_title}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${
                      message.sender_id === user.id
                        ? "bg-[#FF6060] text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-gray-100 bg-white p-4"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Envoyer un message"
                aria-label="Écrire un message"
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={isSending}
                aria-label="Envoyer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#99331A] text-white disabled:opacity-60"
              >
                ↑
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}