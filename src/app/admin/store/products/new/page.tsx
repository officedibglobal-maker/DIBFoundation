
import { redirect } from "next/navigation";

export default function LegacyNewProductRedirect() {
  redirect("/admin/impact-store/products/new");
}
