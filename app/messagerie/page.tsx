import { Suspense } from "react";
import MessagerieContent from "@/components/MessagerieContent";

export default function MessageriePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Suspense fallback={null}>
        <MessagerieContent />
      </Suspense>
    </div>
  );
}