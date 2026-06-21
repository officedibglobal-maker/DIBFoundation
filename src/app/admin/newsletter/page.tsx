
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminNewsletterPage() {
  return (
    <div>
      <AdminPageHeader title="Newsletter" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Newsletter", href: "/admin/newsletter" }]} />
      <div className="p-4">
        <p>Newsletter management functionality will be here.</p>
      </div>
    </div>
  );
}
