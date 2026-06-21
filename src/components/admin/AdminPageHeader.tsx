
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href: string }[];
  children?: ReactNode;
}

export function AdminPageHeader({ title, breadcrumbs, children }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          {breadcrumbs.map((crumb, index) => (
            <>
              <a href={crumb.href} className="hover:text-primary">{crumb.label}</a>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
            </>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="mt-4 md:mt-0 flex-shrink-0">
        {children}
      </div>
    </div>
  );
}
