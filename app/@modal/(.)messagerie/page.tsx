import MessagerieModalClient from "@/components/MessagerieModalClient";

export default async function MessagerieModalPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const params = await searchParams;
  const initialConversationId = params.conversation ? Number(params.conversation) : null;

  return <MessagerieModalClient initialConversationId={initialConversationId} />;
}