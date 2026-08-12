import RequireRole from "@/components/RequireRole";
import BecomeHostPrompt from "@/components/BecomeHostPrompt";
import AjouterLogementForm from "@/components/AjouterLogementForm";

export default function AjouterLogementPage() {
  return (
    <RequireRole allowedRoles={["owner", "admin"]} fallback={<BecomeHostPrompt />}>
      <AjouterLogementForm />
    </RequireRole>
  );
}