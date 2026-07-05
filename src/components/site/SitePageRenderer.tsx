
import { SitePage } from "@/lib/models/site-pages";

interface SitePageRendererProps {
  page: SitePage;
}

export const SitePageRenderer = ({ page }: SitePageRendererProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">{page.title}</h1>
      {page.subtitle && <p className="text-xl text-gray-600">{page.subtitle}</p>}
      <div className="prose lg:prose-xl mt-8">
        {/* This is a placeholder for where the rest of the page content will be rendered */}
      </div>
    </div>
  );
};
