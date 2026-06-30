
import { redirect } from "next/navigation";

export default function LegacyOrdersRedirect() {
  redirect("/admin/impact-store/orders");
}
