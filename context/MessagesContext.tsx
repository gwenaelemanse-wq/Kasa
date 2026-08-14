"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { listConversationsAction, type Conversation } from "@/lib/actions/messages";

interface MessagesContextValue {
  conversations: Conversation[];
  unreadCount: number;
  isLoaded: boolean;
  refresh: () => Promise<void>;
}

const MessagesContext = createContext<MessagesContextValue | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // refresh() peut être appelée par n'importe quel composant (Header,
  // messagerie...) après une action qui change l'état des messages
  // (envoi, lecture) pour que TOUT le monde se mette à jour ensemble.
  const refresh = useCallback(async () => {
    if (!token) {
      setConversations([]);
      setIsLoaded(true);
      return;
    }
    const data = await listConversationsAction(token);
    setConversations(data);
    setIsLoaded(true);
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <MessagesContext.Provider value={{ conversations, unreadCount, isLoaded, refresh }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages doit être utilisé à l'intérieur de MessagesProvider");
  }
  return context;
}