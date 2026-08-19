"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import MessagerieContent from "@/components/MessagerieContent";

export default function MessagerieModal() {
  const router = useRouter();

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose}>
      <Suspense fallback={null}>
        <MessagerieContent onClose={handleClose} />
      </Suspense>
    </Modal>
  );
}