"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import MessagerieContent from "@/components/MessagerieContent";

export default function MessagerieModalClient({
  initialConversationId,
}: {
  initialConversationId: number | null;
}) {
  const router = useRouter();

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose}>
      <MessagerieContent onClose={handleClose} initialConversationId={initialConversationId} />
    </Modal>
  );
}