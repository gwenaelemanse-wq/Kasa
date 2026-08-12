// Données factices en attendant le vrai back-end messagerie (Sprint 2).
// Centralisées ici pour être utilisées à la fois par le Header (badge) et la page messagerie.
export const mockConversations = Array.from({ length: 8 }, (_, i) => ({
  id: `conv-${i}`,
  name: "Utilisateur",
  time: "11:04 am",
  preview: "Bonjour, votre appartement est-il disp...",
  unread: i < 3,
}));

export const mockMessages = [
  { id: "m1", from: "them" as const, time: "11:04pm", text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?" },
  { id: "m2", from: "them" as const, time: "11:04pm", text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?" },
  { id: "m3", from: "me" as const, time: "11:04pm", text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?" },
];