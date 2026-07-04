
import { redirect } from "next/navigation";

export default function LegacyProductsRedirect() {
  redirect("/admin/impact-store/products");
}
