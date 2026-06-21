
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminSystemPage() {
  return (
    <div>
      <AdminPageHeader title="System" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "System", href: "/admin/system" }]} />
      <div className="p-4">
        <p>System settings and utilities will be here.</p>
      </div>
    </div>
  );
}
