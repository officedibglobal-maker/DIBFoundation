
import type { ReactNode } from "react";

export interface AdminPageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function AdminPageHeader({
  title,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="py-4 border-b flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children ? (
        <div className="flex items-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
