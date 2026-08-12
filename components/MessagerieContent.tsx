"use client";

import { useState } from "react";
import { mockConversations, mockMessages } from "@/lib/mockMessages";

export default function MessagerieContent({ onClose }: { onClose?: () => void }) {
  const [selectedId, setSelectedId] = useState(mockConversations[0].id);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-[85vh] max-h-[700px] md:h-[600px]">
      {/* Liste des conversations */}
      <div className="hidden w-full max-w-xs flex-col border-r border-gray-100 p-4 md:flex">
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
        <ul className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
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
                    <span className="font-medium">{conv.name}</span>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </span>
                  <span className="block truncate text-sm text-gray-500">
                    {conv.preview}
                  </span>
                </span>
                {conv.unread && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF6060]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Fil de discussion */}
      <div className="flex flex-1 flex-col bg-[#FFF8F5]">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la messagerie"
            className="self-end p-4 md:hidden"
          >
            ✕
          </button>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${
                  message.from === "me"
                    ? "bg-[#FF6060] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form
          className="flex items-center gap-2 border-t border-gray-100 bg-white p-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Envoyer un message"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Envoyer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6060] text-white"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}